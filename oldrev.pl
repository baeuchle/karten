#!/usr/bin/perl -w

## returns a specific version of a file from the repository.
## call: oldrev.pl file revision
## file must be in the @file_whitelist, revision must consist of no more
## than 40 hexadecimal digits.

use strict;
binmode STDOUT, ':encoding(UTF-8)';
binmode STDERR, ':encoding(UTF-8)';
binmode STDIN, ':encoding(UTF-8)';
use utf8;
use open ':encoding(utf8)';

use CGI;
my $query = CGI->new;

my $repository = '/home/baeuchle/karten/';
chdir $repository;

## read and check file input:
my $file = $query->param('file');
&missing_parameter unless $file;
my @file_whitelist = qw ! fahrrad.svg ubahnnetz.svg strassenbahnnetz.svg !;
my $file_is_allowed = 0;
foreach my $allowed_file (@file_whitelist) {
  $file_is_allowed = 1 if $file eq $allowed_file;
}

unless ($file_is_allowed) {
  &invalid_file($file);
}

## read and check revision input:
my $rev = $query->param('rev');
&missing_parameter unless $rev;
if (length ($rev) > 40 || $rev =~ /[^\da-f]/) {
  &invalid_revision($rev, $file);
}

my $content = &get_content($rev, $file);
$content = &get_content($rev, 'straßenbahnnetz.svg') if ! $content && $file eq 'strassenbahnnetz.svg';

if ($content) {
  print <<"HTTP";
Content-Type: image/svg+xml

$content
HTTP
  exit 0;
}

&filerev_notfound($rev, $file);
exit 1;

sub filerev_notfound {
  my $rev = shift || '';
  my $file = shift || '';
  print <<"FEHLER";
Status: 404 Not Found
Content-Type: text/html

<html><head><title>Fehler: Datei und Revision passen nicht</title></head>
<body><h1>Fehler: Datei und Revision passen nicht</h1>
<p>Entweder konnte keine Revision $rev gefunden werden oder diese Revision enthält Datei $file nicht!</p>
<p><a href="$file">Aktuelle Version dieser Datei</a></p>
</body></html>
FEHLER
  exit 1;
}

sub invalid_file {
  my $filename = shift || "";
  print <<"FEHLER";
Status: 404 Not Found
Content-Type: text/html

<html><head><title>Fehler: Datei unbekannt</title></head>
<body><h1>Fehler: Datei unbekannt</h1>
<p>Die angeforderte Datei $filename ist nicht in der Liste der erlaubten Dateien enthalten!</p>
</body></html>
FEHLER
  exit 1;
}

sub invalid_revision {
  my $revision = shift || "";
  my $filename = shift || '';
  print <<"FEHLER";
Status: 404 Not Found
Content-Type: text/html

<html><head><title>Fehler: Revision ungültig</title></head>
<body><h1>Fehler: Revision ungültig</h1>
<p>$rev ist keine gültige Revisionsangabe</p>
<p><a href="$filename">Aktuelle Version dieser Datei</a></p>
</body></html>
FEHLER
  exit 1;
}

sub missing_parameter {
  print <<"FEHLER";
Status: 400 Bad Request
Content-Type: text/html

<html><head><title>Fehler: Parameter fehlen</title></head>
<body><h1>Fehler</h1>
<p>Das Programm benötigt Parameter <tt>rev</tt> und <tt>file</tt></p>
</body></html>
FEHLER
  exit 1;
}

sub get_content {
  my $rev = shift;
  my $file = shift;
  my $ref_id = $rev.':'.$file;
  print STDERR $ref_id;
  
  open GIT, "git show $ref_id | ./update.pl $rev |";
  my $content;
  
  while (<GIT>) {
    $content .= $_;
  }
  close GIT;
  return $content;
}
