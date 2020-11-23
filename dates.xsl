<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:svg="http://www.w3.org/2000/svg"
xmlns:dc="http://purl.org/dc/elements/1.1/"
xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <!-- Call with
  xsltproc
    -stringparam DATE $(date +%Y-%m-%d)
    -stringparam MONTH "$(date +'%B %Y')"
    -stringparam YEAR $(date +%Y)
    this_file.xsl SVGFILE
  (double hyphens, though)
  -->
  <xsl:param name="EMPTYHASH" select="'0000000000000000000000000000000000000000'" />
  <xsl:param name="VERSION" select="$EMPTYHASH"/>
  <xsl:param name="DATE" select="'unknown date'"/>
  <xsl:param name="MONTH" select="'unknown month'"/>
  <xsl:param name="YEAR" select="'unknown year'"/>
  
  <xsl:output method="xml" encoding="utf-8" indent="yes" cdata-section-elements="xhtml:script"/>
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()" />
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="svg:a[contains(@class, 'viewboxlink')]/@xlink:href">
    <xsl:attribute name="altehref"><xsl:value-of select="."/></xsl:attribute>
    <xsl:attribute name="xlink:href">https://plan.frankfurtium.de/<xsl:value-of select="substring-before(., '?')"/>/<xsl:value-of select="$VERSION"/>?<xsl:value-of select="substring-after(., '?')"/></xsl:attribute>
  </xsl:template>
  <xsl:template match="svg:a[contains(@class, 'rev')]/@xlink:href">
    <xsl:attribute name="xlink:href">
      <xsl:choose>
        <xsl:when test="starts-with(., './')">
          <!-- old style: no hash present  -->
          <xsl:value-of select="'https://plan.frankfurtium.de/'" />
          <xsl:value-of select="substring-after(., './')" />
          <xsl:value-of select="'/'" />
          <xsl:value-of select="$VERSION" />
        </xsl:when>
        <xsl:when test="starts-with(., 'https://plan.frankfurtium.de')">
          <!-- intermediate: contains hash -->
          <xsl:value-of select="substring-before(., $EMPTYHASH)" />
          <xsl:value-of select="$VERSION" />
        </xsl:when>
        <xsl:otherwise>
          <!-- new: neither -->
          <xsl:value-of select="'https://plan.frankfurtium.de/'" />
          <xsl:value-of select="." />
          <xsl:value-of select="'/'" />
          <xsl:value-of select="$VERSION" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:attribute>
  </xsl:template>
  <xsl:template match="xhtml:a[contains(@class, 'rev')]/@href|svg:script/@href">
    <xsl:attribute name="href">https://plan.frankfurtium.de/<xsl:value-of select="."/>/<xsl:value-of select="$VERSION"/></xsl:attribute>
  </xsl:template>
  <xsl:template match="xhtml:script[contains(@class, 'rev')]/@src">
    <xsl:attribute name="src">https://plan.frankfurtium.de/<xsl:value-of select="."/>/<xsl:value-of select="$VERSION"/></xsl:attribute>
  </xsl:template>
  <xsl:template match="*[contains(@class, 'hash')]">
    <xsl:value-of select="$VERSION"/>
  </xsl:template>

  <xsl:template match="dc:date">
    <dc:date><xsl:value-of select="$DATE"/></dc:date>
  </xsl:template>
  <xsl:template match="*[contains(@class, 'stand_monat')]">
    <xsl:value-of select="$MONTH"/>
  </xsl:template>
  <xsl:template match="*[contains(@class, 'stand_jahr')]">
    <xsl:value-of select="$YEAR"/>
  </xsl:template>

<!-- transformations for legacy versions -->
  <xsl:template match="*[text()='(0000000000000000000000000000000000000000)']/text()">
    <xsl:value-of select="concat('(',$VERSION,')')" />
  </xsl:template>

</xsl:stylesheet>
