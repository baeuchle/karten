/// Schaltet die Haltestellendetails der übergeordneten Gruppe an oder aus:
/// @param clickobj Objekt, auf das geklickt wird; sollte direkt unter
/// der Haltestellengruppe liegen.
function toggle_details(clickobj) {
  toggle_stopdetails(clickobj.parentNode);
}

/// Schaltet die Haltestellendetails dieser Haltestelle an oder aus
/// @param domobj Objekt, dass die zu dieser Haltestelle gehörende
/// SVG-Gruppe enthält.
function toggle_stopdetails(domobj) {
  var detailobjects = domobj.getElementsByClassName("hstdetails");
  if (detailobjects.length == 0) {
    return;
  }
  var aktion = detailobjects[0].style.display != 'inline';
  // alle ausschalten
  var alldetails = document.getElementsByClassName("hstdetails");
  for (var i = 0; i < alldetails.length; ++i) {
    var detailelement = alldetails[i];
    detailelement.style.display = 'none';
  }
  purge_from_deeplink("showdetails");
  if (! aktion) {
    return;
  }
  add_to_deeplink("showdetails=" + domobj.id);
  // gewünschte einschalten.
  for (var i = 0; i < detailobjects.length; ++i) {
    var detailelement = detailobjects[i];
    detailelement.style.display = 'inline';
  }
}

/// Hebt ein Signal, sein Name und den Standort hervor.
function highlight(domobj) {
  domobj.addEventListener('mouseout', downlight, true);
  domobj.classList.add("highlightedsignal");
  var uses = domobj.getElementsByTagName("use");
  for (var u = 0; u < uses.length; ++u) {
    var href = uses[u].getAttributeNS('http://www.w3.org/1999/xlink','href');
    if (href == '#signalplatz') {
      uses[u].setAttributeNS('http://www.w3.org/1999/xlink','href','#highlightedsignalplatz');
    }
    if (href.startsWith('#signal_')) {
      var ellipses = domobj.getElementsByTagName("ellipse");
      if (ellipses.length > 0) {
        continue;
      }
      var foothighlight = document.createElementNS("http://www.w3.org/2000/svg","ellipse");
      foothighlight.setAttribute('transform',uses[u].getAttribute("transform"));
      foothighlight.setAttribute('rx','7');
      foothighlight.setAttribute('ry','2');
      domobj.insertBefore(foothighlight,domobj.firstChild);
    }
  }
}

function downlight(event) {
  var domobj = event.currentTarget;
  domobj.removeEventListener('mouseout', downlight);
  domobj.classList.remove("highlightedsignal");
  var uses = domobj.getElementsByTagName("use");
  for (var u = 0; u < uses.length; ++u) {
    if (uses[u].getAttributeNS('http://www.w3.org/1999/xlink','href') == '#highlightedsignalplatz') {
      uses[u].setAttributeNS('http://www.w3.org/1999/xlink','href','#signalplatz');
    }
  }
}
