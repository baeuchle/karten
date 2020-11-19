<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:svg="http://www.w3.org/2000/svg"
>

<xsl:param name="VERSION" />

<xsl:output method="xml" encoding="utf-8" indent="yes"/>
<xsl:template match="@*|node()">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()" />
  </xsl:copy>
</xsl:template>

<xsl:template match="text()">
  <xsl:value-of select="normalize-space()" />
</xsl:template>
<!-- Copy style attribute as-is (no normalize-space()) -->
<xsl:template match="svg:style">
  <xsl:copy-of select="."/>
</xsl:template>

<xsl:template match="@onclick|@onload|@onmousemove|@onmousemove"/>
<xsl:template match="svg:script"/>
<xsl:template match="svg:defs[@id='defs_grid']"/>
<xsl:template match="svg:defs[@id='defs_kilometer']"/>
<xsl:template match="svg:defs[@id='defs_hstdetails']"/>
<xsl:template match="svg:defs[@id='defs_signale']"/>
<xsl:template match="svg:defs[@id='defs_links']"/>
<xsl:template match="svg:g[@id='kilometrierungen_gruppen']"/>
<xsl:template match="svg:g[@id='always_links']"/>
<xsl:template match="svg:g[@id='frame']"/>
<xsl:template match="svg:g[@id='ausbauprojekte']"/>
<xsl:template match="svg:g[@id='kilometrierungen']"/>
<xsl:template match="*[contains(@class, 'nowiki')]" />

</xsl:stylesheet>
