#!/usr/bin/perl -w

use strict;
use constant PI => 2*atan2(1,0);
use Data::Dumper;

BEGIN {
  do 'regierungen/landtage.pl';
  do 'regierungen/karte.pl';
}

my %colors = &read_colors;
my $landtage = &landtage;
my $spreads = &spread;
my $positions = &position;

my $gradients = '';
my $parlaments = '';

for my $land (keys %$landtage) {
  my $current_land = $landtage->{$land};
  print "Land $land\n";

  my $regierungssitze = 0;
  for my $regierungspartei (@{$current_land->{'regierung'}}) {
    $regierungssitze += $current_land->{'sitze'}->{$regierungspartei};
  }

  my $gradienttext = sprintf << 'ENDE', $land, @{$spreads->{$land}};
  <linearGradient id="%s" spreadMethod="repeat" x1="%s" x2="%s" y1="%s" y2="%s" gradientUnits="userSpaceOnUse">
ENDE
  my $position = 0;
  for my $regierungspartei (@{$current_land->{'regierung'}}) {
    $gradienttext .= sprintf q!   <stop offset="%2d%%" stop-color="%s" />!, $position, $colors{$regierungspartei};
    $position += $current_land->{'sitze'}->{$regierungspartei} / $regierungssitze * 100;
    $gradienttext .= sprintf q!<stop offset="%2d%%" stop-color="%s" />!, $position, $colors{$regierungspartei};
    $gradienttext .= "\n";
  }
  $gradienttext .= '  </linearGradient>';
  $gradienttext .= "\n";

  my $allesitze = 0;
  for my $partei (keys %{$current_land->{'sitze'}}) {
    $allesitze += $current_land->{'sitze'}->{$partei};
  }
  my $nichtwaehler = 100 - $current_land->{'beteiligung'};
  my $parlamenttext = sprintf <<'PARL', $land, @{$positions->{$land}}, $nichtwaehler * 1.8;
 <g id="parlament_%s" transform="translate(%d %d)">
  <g transform="scale(%d) rotate(%5.1f)">
   <circle class="parlament" r="1.25" />
PARL
  $parlamenttext .= sprintf <<'NICHTWAEHLER', &koordinaten($nichtwaehler);
   <path class="nicht" d="M 0,0 L  0.0000, 1.0000 A 1,1 0,0,0 %7.4f,%7.4f Z"/>
NICHTWAEHLER
  $position = $nichtwaehler;
  my $sitze = $current_land->{'sitze'};
  for my $partei (sort { $sitze->{$b} <=> $sitze->{$a} } keys %{$sitze}) {
    my $alteposition = $position;
    $position = $alteposition + $sitze->{$partei} / $allesitze * $current_land->{'beteiligung'};
    $parlamenttext .= sprintf <<'KUCHEN', $partei, &koordinaten($alteposition), &koordinaten($position);
   <path class="%s" d="M 0,0 L %7.4f,%7.4f A 1,1 0,0,0 %7.4f,%7.4f Z"/>
KUCHEN
  }
  $parlamenttext .= <<'KUCHENENDE';
  </g>
 </g>
KUCHENENDE

  $gradients .= $gradienttext;
  $parlaments .= $parlamenttext;
}

open my $source_fh, 'regierungen/d_regierungen.svg.template';
open my $target_fh, '>', 'd_regierungen.svg';
while (my $line = <$source_fh>) {
  if ($line =~ /GRADIENTEN/) {
    $line = $gradients;
  }
  elsif ($line =~ /PARLAMENTE/) {
    $line = $parlaments;
  }
  print $target_fh $line;
}
close $source_fh;
close $target_fh;

exit 0;

sub read_colors {
  my %colors = ();
  open my $parteien, 'regierungen/parteien' or die "Farbdefinitionen für Dateien nicht gefunden";
  while (my $line = <$parteien>) {
    chomp $line;
    my ($partei, $color) = split /\s+/, $line;
    $colors{$partei} = $color;
  }
  close $parteien;
  return %colors;
}

sub koordinaten {
  my $position = shift;
  return sin($position / 100 * 2 * PI), cos($position / 100 * 2 * PI);
}
