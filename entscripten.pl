#!/usr/bin/perl -w

my $script = 0;
my $g_ausbau = 0;
my $g_bb = 0;
my $g_klick = 0;
my $g_kilo = 0;
my $g_wiki = 0;
my $g_always_links = 0;

while (<>) {
  $script = 1 if /<script\b/;
  s/onclick="[^"]+"//g;
  s/onload="[^"]+"//g;
  s/onmouseover="[^"]+"//g;
  s/onmousemove="[^"]+"//g;
  s/\.nowiki\s+\{\s+display\:inline/.nowiki \{ display:none/g;
  next if /Dieser Plan bei Wikipedia/;
  next if /de.wikipedia.org.favicon/;

  if (/<g/) {
    $g_ausbau++ if /<g/ && $g_ausbau > 0;
    $g_bb++ if /<g/ && $g_bb > 0;
    $g_kilo++ if /<g/ && $g_kilo > 0;
    $g_klick++ if /<g/ && $g_klick > 0;
    $g_wiki++ if /<g/ && $g_wiki > 0;
    $g_always_links++ if /<g/ && $g_always_links > 0;
  }
  $g_ausbau++  if /<g id="ausbauprojekte"/;
  $g_bb++  if /<g id="bbrechtecke"/;
  $g_kilo++  if /<g id="kilometrierungen"/;
  $g_klick++  if /<g id="clickrechtecke"/;
  $g_wiki++  if /<(g|tspan) class="nowiki"/;
  $g_always_links++ if /<g[^>]*\sid="always_links"/;
 
  print unless $script > 0 || $g_ausbau > 0 || $g_kilo > 0 || $g_klick > 0 || $g_bb > 0 || $g_wiki > 0 || $g_always_links >  0;

  $script = 0 if m{</script};
  if (m{</g}) {
    $g_ausbau-- if $g_ausbau > 0;
    $g_bb-- if $g_bb > 0;
    $g_kilo-- if $g_kilo > 0;
    $g_klick-- if $g_klick > 0;
    $g_wiki-- if $g_wiki > 0;
    $g_always_links-- if $g_always_links > 0;
  }
  if (m{</tspan}) {
    $g_wiki-- if $g_wiki > 0;
  }
}
