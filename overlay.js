/// Zeigt oder versteckt overlay
///
/// Detektiert, ob an- oder ausgeschaltet werden soll anhand des
/// Textes im Linkelement mit dem Namen <name>_aktion.
/// @param name Name des overlays
function overlay(name) {
  var linkElement = document.getElementById(name + "_aktion");
  var aktion = linkElement.firstChild.data == "anzeigen";
  overlay_onoff(name, aktion);
}

/// Zeigt oder versteckt overlay
/// @param name Name des overlays
/// @param aktion Wenn \c true, dann wird versteckt.
function overlay_onoff(name, aktion) {
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
    add_to_deeplink("overlay=" + name);
  }
  else {
    remove_from_deeplink("overlay=" + name);
  }
}
