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

/*** THIS PART CONCERNS THE CREATION OF KILOMETER ELEMENTS ***/

var SVGNS = "http://www.w3.org/2000/svg";
var XLINKNS = "http://www.w3.org/1999/xlink";

function create_pin(data) {
  var useele = document.createElementNS(SVGNS, "use");
  useele.setAttributeNS(XLINKNS, "href", "#punkt" + data.pin_type);
  useele.setAttribute("transform", "rotate(" + data.angle + ")");
  return useele;
}

function create_textelement(data) {
  var lines = data.text.split("\\n");
  var extend = {
    x: 0,
    y: lines.length
  };
  var yoffset = 9 - 5 * lines.length;
  var xoffset = 6;
  if (data.pin_type == 1) {
    xoffset = 10;
  }
  switch(data.align) {
    case 'c':
      xoffset = 0;
      break;
    case 'r':
      xoffset *= -1;
      break;
  }
  var ele = document.createElementNS(SVGNS, "g");
  for (var l = 0; l < lines.length; ++l) {
    var text_ele = document.createElementNS(SVGNS, "text");
    var text_node = document.createTextNode(lines[l]);
    text_ele.appendChild(text_node);
    text_ele.setAttribute("x", xoffset)
    text_ele.setAttribute("y", yoffset + 10 * l);
    if (lines[l].length > extend.x) {
      extend.x = lines[l].length;
    }
    if (lines.length == 1) {
      return {
        ele: text_ele,
        extend: extend
      };
    }
    ele.appendChild(text_ele);
  }
  return {
    ele: ele,
    extend: extend
  };
}

function create_textbox(data) {
  var textelement = create_textelement(data);
  var kasten = document.createElementNS(SVGNS, "rect");
  kasten.classList.add('label');
  width = 23 + 5 * textelement.extend.x;
  kasten.setAttribute("width", width);
  kasten.setAttribute("height", 2 + 10 * textelement.extend.y);
  switch(data.align) {
    case 'l':
      kasten.setAttribute("x", 0);
      break;
    case 'r':
      kasten.setAttribute("x", -width);
      break;
    case 'c':
      kasten.setAttribute("x", -width / 2);
      break;
  }
  kasten.setAttribute("y", -1 - 5 * textelement.extend.y);
  kasten.setAttribute("rx", "2");
  kasten.setAttribute("ry", "2");
  var tbg = document.createElementNS(SVGNS, "g");
  tbg.appendChild(kasten);
  tbg.appendChild(textelement.ele);
  tbg.setAttribute("transform",
      "rotate(" + data.angle + ") "
    + "translate(0,-" + data.pin_length + ") "
    + "rotate(-" + data.angle + ")"
  );
  return tbg;
}

function create_kilometer_pin(data) {
  var group = document.createElementNS(SVGNS, "g");
  group.classList.add("kilometer");
  group.classList.add(data.css);
  if (data.transform) {
    group.setAttribute("transform", data.transform);
  }
  switch(data.align) {
    case "l":
      group.classList.add("ta");
      break;
    case "r":
      group.classList.add("te");
      break;
    case "c":
      group.classList.add("tm");
      break;
  }
  group.appendChild(create_textbox(data));
  group.appendChild(create_pin(data));
  return group;
}

function find_last_element_with_class(parentele, css) {
  var class_group = undefined;
  var children = parentele.children;
  for (var c = 0; c < children.length; ++c) {
    if (children[c].classList.contains(css)) {
      class_group = children[c];
    }
  }
  return class_group;
}

function create_kilometer_pins(ele, data) {
  // make sure hstdetails are after the pingroup:
  var details_group = find_last_element_with_class(ele, 'hstdetails');
  // one group for each strecke, so that they can be easily turned
  // on/off later.
  for (var s = 0; s < data.strecken.length; ++s) {
    data.css = data.strecken[s] + "_strecke";
    ele.insertBefore(create_kilometer_pin(data), details_group);
  }
}

function get_pin_data(text, id) {
  if (!text || !text.trim()) {
    console.error("Kilometer data for id='" + id + "' empty");
    return false;
  }
  var ary = text.trim().split("|");
  if (ary.length == 1) {
    console.error("Kilometer data for id='" + id + "' has no Strecken info");
    return false;
  }
  var data = {
    text: "",
    strecken: [],
    pin_type: 2,
    pin_length: 60,
    align: 'l',
    angle: 0,
    transform: undefined
  };
  data.text = ary[0];
  data.strecken = ary[1].split(",");
  if (ary.length > 2) {
    data.pin_type = Number(ary[2]);
    if (data.pin_type == 1) {
      data.pin_length = 99;
    }
    if (data.pin_type > 3) {
      // trambahn
      data.pin_length = 40;
    }
  }
  if (ary.length > 3) {
    var align = ary[3].toLowerCase();
    if (align == 'r' || align == 'l' || align == 'c') {
      data.align = align;
    }
    else {
      console.warn("Text alignment '" + ary[3] + "' not recognized in id='" + id + "'");
    }
  }
  if (ary.length > 4) {
    var angle = Number(ary[4]);
    if (!isNaN(angle)) {
      // make sure angle is within [0, 360)
      data.angle = (angle % 360 + 360) % 360;
    }
    else {
      console.warn("Angle '" + ary[4] + "' not recognized in id='" + id + "'");
    }
  }
  if (ary.length > 5) {
    data.transform = ary[5];
  }
  return data;
}

function create_kilometers() {
  var allKmElements = document.getElementsByClassName("kmhst");
  for (var i = 0; i < allKmElements.length; ++i) {
    create_kilometer_one_station(allKmElements[i]);
  }

  var allKmData = document.getElementsByClassName("kmdata");
  for (var i = 0; i < allKmData.length; ++i) {
    if (allKmData[i].tagName != "desc") {
      continue;
    }
    if (! allKmData[i].firstChild) {
      continue;
    }
    var group_id = allKmData[i].parentElement.getAttribute("id");
    var pindata = get_pin_data(allKmData[i].firstChild.data, group_id);
    if (! pindata) {
      continue;
    }
    create_kilometer_pins(allKmData[i].parentElement, pindata);
  }
}
