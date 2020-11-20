#!/bin/bash

revision=$(git log -1 --pretty=format:%H)
day=$(date +%Y-%m-%d)
month="$(date +'%B %Y')"
year=$(date +%Y)

echo "Update date and version ($revision $day)"
for i in strassenbahnnetz.svg ubahnnetz.svg; do
    xsltproc pretty.xsl $i |\
    tee ${i/.svg/-pretty.svg} |\
    xsltproc \
        --stringparam VERSION $revision \
        --stringparam DATE    $day \
        --stringparam MONTH  "$month" \
        --stringparam YEAR    $year \
        dates.xsl \
        - |\
    tee $i.dist |\
    xsltproc \
        entscripten.xsl \
        - \
        > ${i/svg/wiki.svg};
done
xsltproc \
    --stringparam VERSION $revision \
    --stringparam DATE    $day \
    --stringparam MONTH  "$month" \
    --stringparam YEAR    $year \
    dates.xsl \
    false-pole.html \
    > false-pole.html.dist

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
    mv ubahnnetz.svg.dist /var/www/plan/ubahnnetz.svg
    mv strassenbahnnetz.svg.dist /var/www/plan/strassenbahnnetz.svg
    mv false-pole.html.dist /var/www/plan/false-pole.html
    cp shapes.js /var/www/plan/shapes.js
    cp fahrrad.svg /var/www/plan/
    cp oldrev.pl /var/www/plan/
fi
