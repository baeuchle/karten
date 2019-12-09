var deep_link_parts = { 'base': '', 'query': [] };

function set_deeplink() {
  if (deep_link_parts.base == "") {
    var base = document.getElementById("plain_link").getAttributeNS('http://www.w3.org/1999/xlink', 'href');
    deep_link_parts.base = base;
  }
  var new_url = deep_link_parts.base + "?" + deep_link_parts.query.join("&");
  var dl_element = document.getElementById("deep_link");
  dl_element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', encodeURI(new_url));
}

function add_to_deeplink(text) {
  deep_link_parts.query.push(text);
  set_deeplink();
}

function remove_from_deeplink(text) {
  new_q = []
  for (var q = 0; q < deep_link_parts.query.length; ++q) {
    if (deep_link_parts.query[q] != text) {
      new_q.push(deep_link_parts.query[q]);
    }
  }
  deep_link_parts.query = new_q;
  set_deeplink();
}

function purge_from_deeplink(text) {
  new_q = []
  for (var q = 0; q < deep_link_parts.query.length; ++q) {
    if (! deep_link_parts.query[q].startsWith(text)) {
      new_q.push(deep_link_parts.query[q]);
    }
  }
  deep_link_parts.query = new_q;
  set_deeplink();
}
