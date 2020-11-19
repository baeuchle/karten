<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:svg="http://www.w3.org/2000/svg"
xmlns:dc="http://purl.org/dc/elements/1.1/"
>

<!-- Call with
xsltproc
-stringparam VERSION $(git log -1 -pretty=%H)
-stringparam DATE $(date +%Y-%m-%d)
-stringparam MONTH "$(date +'%B %Y')"
-stringparam YEAR $(date +%Y)
update.xsl SVGFILE
(double hyphens, though)
-->
<xsl:param name="VERSION" select="'0000000000000000000000000000000000000000'"/>
<xsl:param name="DATE" select="'2020-10-01'"/>
<xsl:param name="MONTH" select="'Oktober 2020'"/>
<xsl:param name="YEAR" select="'2020'"/>

<xsl:output method="xml" encoding="utf-8" indent="yes"/>
<xsl:template match="@*|node()">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()" />
  </xsl:copy>
</xsl:template>

<xsl:template match="svg:a[contains(@class, 'rev')]/@xlink:href">
  <xsl:attribute name="xlink:href">https://plan.frankfurtium.de/<xsl:value-of select="."/>/<xsl:value-of select="$VERSION"/></xsl:attribute>
</xsl:template>
<xsl:template match="svg:tspan[contains(@class, 'hash')]">
  <xsl:value-of select="$VERSION"/>
</xsl:template>
<xsl:template match="dc:date">
  <dc:date><xsl:value-of select="$DATE"/></dc:date>
</xsl:template>
<xsl:template match="svg:tspan[@id='stand_monat']">
  <xsl:value-of select="$MONTH"/>
</xsl:template>
<xsl:template match="svg:tspan[@id='stand_jahr']">
  <xsl:value-of select="$YEAR"/>
</xsl:template>

</xsl:stylesheet>
