#!/bin/bash

echo "1024"
convert -resize 1024x454 countries-ive-been-to.svg countries-ive-been-to-1024.png
echo "512"
convert -resize  512x227 countries-ive-been-to.svg countries-ive-been-to-512.png
echo "256"
convert -resize  256x113 countries-ive-been-to.svg countries-ive-been-to-256.png
echo "128"
convert -resize  128x57  countries-ive-been-to.svg countries-ive-been-to-128.png
echo "Moving countries"
mv countries-ive-been-to*.png ~/public_html/bilder/
cp countries-ive-been-to.svg  ~/public_html/bilder/

cp ubahnnetz.svg straßenbahnnetz.svg ~/public_html/bilder/

./entscripten.pl < ubahnnetz.svg > ubahnnetz.wiki.svg
./entscripten.pl < straßenbahnnetz.svg > straßenbahnnetz.wiki.svg
