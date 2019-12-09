/// Zeigt oder versteckt geplante Strecke
///
/// Detektiert, ob an- oder ausgeschaltet werden soll anhand des
/// Textes im Linkelement mit dem Namen <name>_aktion.
/// @param name Name der geplanten Strecke.
function geplant(name) {
  var linkElement = document.getElementById(name + "_aktion");
  var aktion = linkElement.firstChild.data == "anzeigen";
  geplant_onoff(name, aktion);
}

/// Zeigt oder versteckt geplante Strecke
/// @param name Name der geplanten Strecke
/// @param aktion Wenn \c true, dann wird versteckt.
function geplant_onoff(name, aktion) {
  var linkElement = document.getElementById(name + "_aktion");
  var allStyledElements = document.getElementsByClassName(name);
  for (var i = 0; i < allStyledElements.length; ++i) {
    var classedElement = allStyledElements[i];
    classedElement.style.display = aktion ? 'inline' : 'none';
  }
  var allNonStyledElements = document.getElementsByClassName("no_" + name);
  for (var i = 0; i < allNonStyledElements.length; ++i) {
    var classedElement = allNonStyledElements[i];
    classedElement.style.display = !aktion ? 'inline' : 'none';
  }
  linkElement.firstChild.data = aktion ? 'verstecken' : 'anzeigen';
  if (aktion) {
    add_to_deeplink("geplant=" + name);
  }
  else {
    remove_from_deeplink("geplant=" + name);
  }
}
