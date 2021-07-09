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

target_dir=/var/www/plan
if [ -d $target_dir ]; then
    if [ $(which convert) ]; then
        for s in 128 256 512 1024; do
            echo $s
            convert \
                -resize ${s}x${s} \
                countries-ive-been-to.svg \
                countries-ive-been-to-$s.png
        done
        echo "Moving countries"
        mv countries-ive-been-to*.png $target_dir
    fi
    cp countries-ive-been-to.svg  $target_dir
    echo "Moving Netzplaene"
    for mvfile in $(./oldrev.py --show-whitelist) oldrev.py rev_translate; do
        if [ -f $mvfile.dist ]; then
            mv $mvfile.dist $target_dir/$mvfile
        elif [ -f $mvfile ]; then
            cp $mvfile $target_dir
        fi
    done
fi
