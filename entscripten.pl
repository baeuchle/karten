#!/usr/bin/perl -w

my $script = 0;
my $g_ausbau = 0;
my $g_bb = 0;
my $g_klick = 0;
my $g_kilo = 0;
my $g_wiki = 0;

while (<>) {
  $script = 1 if /<script\b/;
  s/onclick="[^"]+"//g;

  if (/<g/) {
    $g_ausbau++ if /<g/ && $g_ausbau > 0;
    $g_bb++ if /<g/ && $g_bb > 0;
    $g_kilo++ if /<g/ && $g_kilo > 0;
    $g_klick++ if /<g/ && $g_klick > 0;
    $g_wiki++ if /<g/ && $g_wiki > 0;
  }
  $g_ausbau++  if /<g id="ausbauprojekte"/;
  $g_bb++  if /<g id="bbrechtecke"/;
  $g_kilo++  if /<g id="kilometrierungen"/;
  $g_klick++  if /<g id="clickrechtecke"/;
  $g_wiki++  if /<g class="nowiki"/;
 
  print unless $script > 0 || $g_ausbau > 0 || $g_kilo > 0 || $g_klick > 0 || $g_bb > 0 || $g_wiki > 0;

  $script = 0 if m{</script};
  if (m{</g}) {
  $g_ausbau-- if $g_ausbau > 0;
    $g_bb-- if $g_bb > 0;
    $g_kilo-- if $g_kilo > 0;
    $g_klick-- if $g_klick > 0;
    $g_wiki-- if $g_wiki > 0;
  }
}
