function get_global_coords(event) {
  var bounding = document.documentElement.getBoundingClientRect();
  var view = get_viewbox();
  real = {}
  real.x = view.width * (event.pageX - bounding.left) / bounding.width + bounding.left + view.left;
  real.y = view.height * (event.pageY - bounding.top) / bounding.height + bounding.top + view.top;
  real.x = Math.round(real.x);
  real.y = Math.round(real.y);
  return real;
}

var selectview_status = false;
var select_start = { 'x': "", 'y': "" };

function selectview(event) {
  if (select_start.x == "") {
    return;
  }
  var real = get_global_coords(event);
  var rect = document.getElementById("frame");
  rect.setAttribute("x", Math.min(real.x, select_start.x));
  rect.setAttribute("y", Math.min(real.y, select_start.y));
  rect.setAttribute("width", Math.abs(real.x - select_start.x));
  rect.setAttribute("height", Math.abs(real.y - select_start.y));
}

function start_selectview(event) {
  if (! selectview_status) {
    return;
  }
  var rect = document.getElementById("frame");
  if (select_start.x == "") {
    select_start = get_global_coords(event);
    rect.setAttribute("class", "frame_active");
    rect.setAttribute("x", select_start.x);
    rect.setAttribute("y", select_start.y);
    rect.setAttribute("width", "20");
    rect.setAttribute("height", "20");
    return;
  }
  else {
    rect.setAttribute("class", "frame_inactive");
    select_start.x = "";
    if (event.altKey || event.shiftKey || event.ctrlKey) {
      toggle_makeview(event);
      var new_viewbox = rect.getAttribute("x") + "/";
      new_viewbox += rect.getAttribute("y") + "/";
      new_viewbox += rect.getAttribute("width") + "/";
      new_viewbox += rect.getAttribute("height") + "/";
      var factor = 1;
      if (event.shiftKey) {
        factor = 2;
      }
      if (event.altKey) {
        factor = 5;
      }
      new_viewbox += factor
      set_viewbox(new_viewbox);
    }
  }
}

function toggle_makeview(event) {
  var element = document.getElementById("make_view_frame");
  var curr_style = element.getAttribute("class");
  if (curr_style == "make_view_inactive") {
    element.setAttribute("class", "make_view_active");
    selectview_status = true;
    select_start.x = "";
  }
  else {
    element.setAttribute("class", "make_view_inactive");
    selectview_status = false;
    select_start.x = "";
  }
  // prevent from global click handler starting a rect right away:
  event.stopPropagation();
}
