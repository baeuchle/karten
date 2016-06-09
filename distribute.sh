#!/bin/bash


echo "Update date"
for i in straßenbahnnetz.svg ubahnnetz.svg; do
    perl -pi -e '@f = localtime(time); $_ =~ s/>.+</sprintf ">%04d-%02d-%02d<", $f[5]+1900, $f[4]+1, $f[3]/gex if /dc:date/' $i
    perl -pi -e '@f = localtime(time); @a = qw ! Januar Februar März April Mai Juni Juli August September Oktober November Dezember !; $_ =~ s/Stand: .+?</sprintf "Stand: %s %4d<", $a[$f[4]], $f[5]+1900/gex' $i
    perl -pi -e '@f = localtime(time); $_ =~ s/2011-\d{4}/sprintf "2011-%4d", $f[5]+1900/gex' $i
done

if [ -d /var/www/plan ]; then
    if [ $(which convert) ]; then
        echo "1024"
        convert -resize 1024x454 countries-ive-been-to.svg countries-ive-been-to-1024.png
        echo "512"
        convert -resize  512x227 countries-ive-been-to.svg countries-ive-been-to-512.png
        echo "256"
        convert -resize  256x113 countries-ive-been-to.svg countries-ive-been-to-256.png
        echo "128"
        convert -resize  128x57  countries-ive-been-to.svg countries-ive-been-to-128.png
        echo "Moving countries"
        mv countries-ive-been-to*.png /var/www/plan/
    fi
    cp countries-ive-been-to.svg  /var/www/plan/
    echo "Moving Netzplaene"
    cp ubahnnetz.svg /var/www/plan/
    cp straßenbahnnetz.svg /var/www/plan/strassenbahnnetz.svg
    cp fahrrad.svg /var/www/plan/
    cp oldrev.pl /var/www/plan/
fi
echo "Entscripten"
./entscripten.pl < ubahnnetz.svg > ubahnnetz.wiki.svg
./entscripten.pl < straßenbahnnetz.svg > straßenbahnnetz.wiki.svg
