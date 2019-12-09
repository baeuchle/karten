/// Zeigt die Kilometrierung für eine Strecke an oder versteckt sie wieder.
///
/// Detektiert, ob an- oder ausgeschaltet werden soll anhand des
/// Schriftgewichtes im Linkelement mit dem Namen <classname>_tx.
/// @param classname Name der CSS-Klasse, die alle Elemente der
/// Kilometrierung der gewünschten Strecke haben.
function kilometer(classname) {
  var linkElement = document.getElementById(classname + "_tx");
  var zeigen = linkElement.getAttribute("font-weight") != "bold";
  linkElement.setAttribute("font-weight", zeigen ? "bold" : "normal");
  var allStyledElements = document.getElementsByClassName(classname);
  for (var i = 0; i < allStyledElements.length; ++i) {
    var classedElement = allStyledElements[i];
    classedElement.style.display = zeigen ? 'inline' : 'none';
  }
  if (zeigen) {
    add_to_deeplink("kilometer=" + classname);
  }
  else {
    remove_from_deeplink("kilometer=" + classname);
  }
}
