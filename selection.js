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

function apply_select_state_to_rect(rect) {
  rect.setAttribute("x", select_state.position.x);
  rect.setAttribute("y", select_state.position.y);
  rect.setAttribute("width", select_state.size.x);
  rect.setAttribute("height", select_state.size.y);
}

function turn_off_frame() {
  select_state.status = 0;
  select_state.position.x = 0;
  select_state.position.y = 0;
  select_state.size.x = 0;
  select_state.size.y = 0;
  var rect = document.getElementById("frame");
  rect.setAttribute("class", "frame_inactive");
  apply_select_state_to_rect(rect);
}

var select_state = {
  // 0: no selection
  // 1: selectable, waiting for click
  // 2: selection started, waiting for second click
  // 3: selection ended, rect is visible, waiting for cancel or apply
  // 4: like 2, but first click was center of area
  'status': 0,
  'position': { 'x': 0, 'y': 0 },
  'start': { 'x': 0, 'y': 0 },
  'size': { 'x': 0, 'y': 0 }
};

function select_move(event) {
  if (select_state.status != 2 && select_state.status != 4) {
    return;
  }
  var real = get_global_coords(event);
  dx = Math.abs(real.x - select_state.start.x);
  dy = Math.abs(real.y - select_state.start.y);
  if (select_state.status == 2) {
    select_state.position.x = Math.min(real.x, select_state.start.x);
    select_state.position.y = Math.min(real.y, select_state.start.y);
    select_state.size.x = dx;
    select_state.size.y = dy;
  }
  else {
    select_state.position.x = select_state.start.x - dx;
    select_state.position.y = select_state.start.y - dy;
    select_state.size.x = 2 * dx;
    select_state.size.y = 2 * dy;
  }
  apply_select_state_to_rect(document.getElementById("frame"));
}

/// ctrl + click: toggle makeview.
/// first click: start rect
/// second click: fix rect
/// third click: delete rect
function select_click(event) {
  if (event.ctrlKey) {
    toggle_makeview(event);
  }
  switch(select_state.status) {
  case 0:
    return;
  case 1:
    select_state.start = get_global_coords(event);
    if (event.ctrlKey && event.shiftKey) {
      select_state.position.x = select_state.start.x - 10;
      select_state.position.y = select_state.start.y - 10;
      select_state.status = 4;
    } else {
      select_state.position.x = select_state.start.x;
      select_state.position.y = select_state.start.y;
      select_state.status = 2;
    }
    select_state.size.x = 20;
    select_state.size.y = 20;
    var rect = document.getElementById("frame");
    rect.setAttribute("class", "frame_active");
    apply_select_state_to_rect(rect);
    break;
  case 2:
  case 4:
    // same as move, really; this is necessary if we do not have a move
    // (e.g., on a touch screen)
    select_move(event);
    select_state.status = 3;
    break;
  case 3:
    turn_off_frame();
    select_state.status = 1;
    break;
  }
}

function select_apply(event) {
  if (select_state.status != 3) {
    return;
  }
  var rect = document.getElementById("frame");
  var new_viewbox = select_state.position.x + "/";
  new_viewbox += select_state.position.y + "/";
  new_viewbox += select_state.size.x + "/";
  new_viewbox += select_state.size.y + "/";
  var factor = 1;
  if (event.ctrlKey) {
    factor *= 1.5
  }
  if (event.shiftKey) {
    factor *= 2;
  }
  if (event.altKey) {
    factor *= 2.5;
  }
  new_viewbox += factor
  toggle_makeview(event);
  set_viewbox(new_viewbox);
}

function toggle_makeview(event) {
  var element = document.getElementById("make_view_frame");
  var curr_style = element.getAttribute("class");
  if (select_state.status == 0) {
    element.setAttribute("class", "make_view_active");
    select_state.status = 1;
  }
  else {
    element.setAttribute("class", "make_view_inactive");
    turn_off_frame();
  }
  // prevent from global click handler starting a rect right away:
  event.stopPropagation();
}
