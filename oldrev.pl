#!/usr/bin/perl -w

## returns a specific version of a file from the repository.
## call: oldrev.pl file revision
## file must be in the @file_whitelist, revision must consist of no more
## than 40 hexadecimal digits.

use strict;

my $repository = '/home/baeuchle/karten/';
chdir $repository;

## read and check file input:
my $file = shift @ARGV;
my @file_whitelist = qw ! fahrrad.svg ubahnnetz.svg strassenbahn.svg !;
my $file_is_allowed = 0;
foreach my $allowed_file (@file_whitelist) {
  $file_is_allowed = 1 if $file eq $allowed_file;
}

unless ($file_is_allowed) {
  &invalid_file($file);
}

## read and check revision input:
my $rev = shift @ARGV;
if (length ($rev) > 40 || $rev =~ /[\da-f]/) {
  &invalid_revision($rev);
}

my $ref_id = $rev.':'.$file;

print <<'HTTP';
Content-Type: image/xml+svg

HTTP

my $a = system('git', 'show', $ref_id);

exit;

sub invalid_file {
  my $filename = shift || "";
  print <<"FEHLER";
HTTP/1.1 404 File Not Found
Content-Type: text/plain

Die angeforderte Datei $filename wurde nicht gefunden.
FEHLER
  exit 1;
}

sub invalid_revision {
  my $filename = shift || "";
  print <<"FEHLER";
HTTP/1.1 404 File Not Found
Content-Type: text/plain

$rev ist keine gültige Revision! SHA-1 angeben.
FEHLER
  exit 1;
}
