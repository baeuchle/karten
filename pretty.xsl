<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:svg="http://www.w3.org/2000/svg"
>
  <xsl:output method="xml" encoding="utf-8" indent="yes"/>
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()" />
    </xsl:copy>
  </xsl:template>
  <xsl:template match="text()">
    <xsl:value-of select="normalize-space()" />
  </xsl:template>
  <xsl:template match="svg:style/text()">
    <xsl:copy-of select="."/>
  </xsl:template>
  <xsl:template match="svg:text/text()">
    <xsl:copy-of select="."/>
  </xsl:template>
  <xsl:template match="svg:tspan/text()">
    <xsl:copy-of select="."/>
  </xsl:template>

</xsl:stylesheet>
