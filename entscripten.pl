#!/usr/bin/perl -w

$script = 0;
$g_ausbau = 0;
$g_klick = 0;
$g_kilo = 0;
$g_bb = 0;

while( <> ) {
 $script = 1 if /<script\b/;
 s/onclick="[^"]"//g;
 
 $g_ausbau++ if /<g/ && $g_ausbau > 0;
 $g_ausbau++  if /<g id="ausbauprojekte"/;

 $g_klick++ if /<g/ && $g_klick > 0;
 $g_klick++  if /<g id="clickrechtecke"/;

 $g_bb++ if /<g/ && $g_bb > 0;
 $g_bb++  if /<g id="bbrechtecke"/;

 $g_kilo++ if /<g/ && $g_kilo > 0;
 $g_kilo++  if /<g id="kilometrierungen"/;

 print unless $script > 0 || $g_ausbau > 0 || $g_kilo > 0 || $g_klick > 0 || $g_bb > 0;
 $script = 0 if /<\/script>/;
 $g_kilo-- if /<\/g/ && $g_kilo > 0;
 $g_klick-- if /<\/g/ && $g_klick > 0;
 $g_ausbau-- if /<\/g/ && $g_ausbau > 0;
 $g_bb-- if /<\/g/ && $g_bb > 0;
}
