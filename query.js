function set_debug() {
  document.documentElement.setAttribute("class","debug");
  add_to_deeplink("debug");
}

function readquery() {
  // first: not query-related: set whole_view_link to original viewbox.
  set_whole_link();

  var query = location.search;
  if (query == "") {
    return;
  }
  if (query.indexOf("?") == 0) {
    query = query.substring(1);
  }
  var fields = query.split("&").sort();
  for (var i = 0; i < fields.length; ++i) {
    var key = fields[i];
    if (key == "debug") {
      set_debug();
      continue;
    }
    if (key.startsWith("showdetails=")) {
      var group = document.getElementById(key.substring(key.indexOf("=") + 1));
      if (group === undefined) {
        continue;
      }
      toggle_stopdetails(group);
      continue;
    }
    if (key.startsWith("kilometer=")) {
      var value = key.substring(key.indexOf("=") + 1);
      if (value == "") {
        continue;
      }
      kilometer(value);
      continue;
    }
    if (key.startsWith("geplant=")) {
      var value = key.substring(key.indexOf("=") + 1);
      if (value == "") {
        continue;
      }
      geplant_onoff(value, true);
      continue;
    }
    if (key.startsWith("nogeplant=")) {
      var value = key.substring(key.indexOf("=") + 1);
      if (value == "") {
        continue;
      }
      geplant_onoff(value, false);
      continue;
    }
    if (key.startsWith("viewbox=")) {
      var value = key.substring(key.indexOf("=") + 1);
      if (value == "") {
        continue;
      }
      set_viewbox(value)
      continue;
    }
  }
}
