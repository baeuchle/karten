function get_viewbox() {
  var root = document.documentElement;
  var box = root.getAttribute("viewBox").split(/\s+/);
  var viewbox = {};
  viewbox.show_height = Number(root.getAttribute("height").replace("px", ""));
  viewbox.show_width = Number(root.getAttribute("width").replace("px", ""));
  viewbox.left = Number(box[0]);
  viewbox.top = Number(box[1]);
  viewbox.width = Number(box[2]);
  viewbox.height = Number(box[3]);
  viewbox.right = viewbox.left + viewbox.width;
  viewbox.bottom = viewbox.top + viewbox.height;
  return viewbox;
}

function linkable_viewbox(box) {
  var result = box.left + "/";
  result += box.top + "/";
  result += box.width + "/";
  result += box.height + "/";
  if (box.show_height / box.height == box.show_width / box.width) {
    result += (box.show_height / box.height);
  }
  else {
    result += box.show_width + "/" + box.show_height;
  }
  return result;
}

function boxable_viewbox(box) {
  var result = box.left + " ";
  result += box.top + " ";
  result += box.width + " ";
  result += box.height;
  return result;
}

var original_viewbox = get_viewbox();

function apply_viewBox(viewbox, width, height) {
  var root_element = document.documentElement;
  root_element.setAttribute("viewBox", viewbox);
  root_element.setAttribute("width", width)
  root_element.setAttribute("height", height);
  purge_from_deeplink("viewbox");
  add_to_deeplink("viewbox=" + linkable_viewbox(get_viewbox()));
}

function move_link_box(coords) {
  var width = Number(coords[2]);
  var height = Number(coords[3]);
  var right = Number(coords[0]) + width;
  var bottom= Number(coords[1]) + height;
  var translation = "translate(" + right + "," + bottom + ")";
  // make sure there is no overflow:
  var width_ratio = width / 32;
  var height_ratio = height / 32;
  if (width_ratio < 1 || height_ratio < 1) {
    translation = translation + " scale(" + Math.min(width_ratio, height_ratio) + ")";
  }
  document.getElementById("always_links").setAttribute("transform", translation);
}

// Zeigt nur einen bestimmten Ausschnitt an:
function set_viewbox(value) {
  var requested_numbers = value.split(/[\/ ]+/);
  var new_viewbox;
  var new_width;
  var new_height;
  switch (requested_numbers.length) {
    case 4:
      // take width and height from viewBox itself
      new_viewbox = requested_numbers.join(" ");
      new_width = requested_numbers[2];
      new_height = requested_numbers[3];
      break;
    case 5:
      // take 5th entry to be the scaling factor
      factor = requested_numbers.pop();
      new_viewbox = requested_numbers.join(" ");
      new_width = factor * requested_numbers[2];
      new_height = factor * requested_numbers[3];
      break;
    case 6:
      // take 5th entry as width, 6th as height.
      new_height = requested_numbers.pop();
      new_width = requested_numbers.pop();
      new_viewbox = requested_numbers.join(" ");
      break;
    default:
      return;
  }
  // set viewBox:
  apply_viewBox(new_viewbox, new_width, new_height);
  // set link position:
  move_link_box(requested_numbers);
}

function set_whole_link() {
  var whole_link = document.getElementById("whole_view_link");
  var clickstring = "javascript:set_viewbox('" + linkable_viewbox(original_viewbox) + "')";
  whole_link.setAttributeNS('http://www.w3.org/1999/xlink', 'href', clickstring);
}
