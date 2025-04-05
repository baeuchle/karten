#!/usr/bin/python3

"""Extracts, transforms and reports old versions of git-tracked files"""

import argparse
import cgi
from datetime import datetime
from pathlib import Path
from subprocess import Popen, PIPE
import sys
import xml.etree.ElementTree as ET
# on the server, both the GitVersion submodule and the xsl file will be somewhere else, but apache
# helpfully provides us with their whereabouts.
import os
karten_dir = os.environ.get('KARTEN_DIR', '.')
sys.path.insert(0, karten_dir)
from GitVersion import Git # pylint: disable=C0413

def get_whitelist():
    whitelist = {x: 1 for x in """
        fahrrad.svg
        ubahnnetz.svg
        strassenbahnnetz.svg
        straßenbahnnetz.svg
        false-pole.html
        viewbox.js
        deep_link.js
        geplant.js
        kilometer.js
        hstdetails.js
        selection.js
        overlay.js
        query.js
        shapes.js
        math.js
        poles.js""".split()}
    return whitelist

def write_error(code, page_title="Fehler", message="Das war nicht gut"):
    html = ET.Element('html')
    head = ET.SubElement(html, 'head')
    head.append(ET.Element('meta', attrib={'charset': 'utf-8'}))
    head.append(ET.Element('meta', attrib={
        'name': 'viewport',
        'content': 'width=device-width, initial-scale=1.0'
    }))
    title = ET.SubElement(head, 'title')
    title.text = "Fehler: " + page_title
    body = ET.SubElement(html, 'body')
    h1 = ET.SubElement(body, 'h1')
    h1.text = "Fehler: " + page_title
    body.append(ET.fromstring(message))
    codenames = {400: "Bad Request", 404: "Not Found"}
    print("Status: {} {}".format(code, codenames.get(code, 'Unknown Status')))
    print("Content-Type: text/html")
    print()
    print(ET.tostring(html, encoding='unicode', method='html'))

def check_parameters(data):
    if "file" in data and "rev" in data:
        return True
    write_error(400, page_title="Parameter fehlen",
        message="<p>Das Programm benötigt die Parameter <tt>rev</tt> und <tt>file</tt></p>")
    return False

def check_filename(filename):
    if filename in get_whitelist():
        return True
    write_error(404, page_title="Datei unbekannt",
        message="""<p>
            Die angeforderte Datei {} ist nicht in der Liste der erlaubten Dateien enthalten!
        </p>""".format(filename))
    return False

def check_revision(rev, filename):
    if len(rev) <= 40:
        try:
            # try to convert rev as hexadecimal integer.
            # if it works, we have a valid hash (or part thereof):
            sha_int = int(rev, 16) # pylint: disable=W0612
            return True
        except ValueError:
            pass
    write_error(404, page_title="Revision ungültig", message="""
        <div>
          <p>{0} ist keine gültige Revisionsangabe</p>
          <p><a href="/{1}">Aktuelle Version dieser Datei</a></p>
        </div>
    """.format(rev, filename))
    return False

def filerev_notfound(rev, filename):
    write_error(404, page_title="Datei und Revision passen nicht", message="""
      <div>
        <p>
          Entweder konnte keine Revision {0} gefunden werden oder
          diese Revision enthält Datei {1} nicht!</p>
        <p><a href="/{1}">Aktuelle Version dieser Datei</a></p>
      </div>
    """.format(rev, filename))
    return False

def print_content(rev, filename):
    revid = '{}:{}'.format(rev, filename)
    git = Git(karten_dir, stderr=Git.DEVNULL)
    object_id = git.command('rev-parse', revid)
    if git.returncode != 0:
        if filename == 'straßenbahnnetz.svg':
            return print_content(rev, 'strassenbahnnetz.svg')
        return filerev_notfound(rev, filename)
    authordates = git.commandlines('log',
        # cannot use --find-object hash because old git version on server
        '--find-object={}'.format(object_id),
        # also, cannot use --format=%as.
        '--format=%ad', '--date=short')
    if not authordates:
        authordates = git.commandlines('log', '-1', '--format=%ad', 'date=short')
    # cannot use fromisoformat because old python3 version on server
    filedate = datetime.strptime(authordates[-1].strip(), '%Y-%m-%d')
    contents = git.command('show', object_id)
    if git.returncode != 0:
        return filerev_notfound(rev, filename)
    filetype = Path(filename).suffix
    if filetype == '.js':
        print("Content-Type: text/javascript")
        print()
        print(contents)
        return True
    if filetype == '.html':
        print("Content-Type: text/html")
    if filetype == '.svg':
        print("Content-Type: image/svg+xml")
    print()
    with Popen(['xsltproc',
                '--stringparam', 'VERSION', rev,
                '--stringparam', 'DATE', filedate.strftime('%Y-%m-%d'),
                '--stringparam', 'MONTH', filedate.strftime('%B %Y'),
                '--stringparam', 'YEAR', filedate.strftime('%Y'),
                '{}/dates.xsl'.format(karten_dir),
                '-'],
               stdout=PIPE,
               stdin=PIPE,
               universal_newlines=True
              ) as proc:
        transformed, errors = proc.communicate(input=contents)
        print(transformed)
        return errors is not None

def translate_revision(oldrev: str) -> str:
    with open('rev_translate', 'r') as rt:
        all_revs = rt.readlines()
        for line in all_revs:
            pair = line.split(' ')
            if len(pair) < 2:
                continue
            if pair[0] == oldrev:
                return pair[1]
    return oldrev

def process_request(data):
    if not check_parameters(data):
        return False
    if not check_filename(data['file']):
        return False
    if not check_revision(data['rev'], data['file']):
        return False
    revision = data['rev']
    try:
        revision = translate_revision(data['rev'])
    except FileNotFoundError:
        pass
    result = print_content(revision, data['file'])
    if result and data['file'] == 'straßenbahnnetz.svg':
        return print_content(revision, 'strassenbahnnetz.svg')
    return result

def parse_cmdline():
    parser = argparse.ArgumentParser()
    parser.add_argument('--show-whitelist', action='store_true')
    parser.add_argument('--file')
    parser.add_argument('--rev')
    args = parser.parse_args()
    if args.show_whitelist:
        for f in get_whitelist():
            print(f)
        sys.exit(0)
    result = {}
    if args.file:
        result['file'] = args.file
    if args.rev:
        result['rev'] = args.rev
    return result

if __name__ == '__main__':
    arguments = {}
    if len(sys.argv) > 1:
        arguments = parse_cmdline()
    else:
        cgidata = cgi.FieldStorage()
        arguments = {x: cgidata[x].value for x in cgidata}
    process_request(arguments)
