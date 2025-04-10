normalworld = {};
function angles_to_canvas(canvas, angles) {
  if (angles.length == 2) {
    phi = angles[0];
    theta = angles[1];
  }
  else {
    phi = angles.phi;
    theta = angles.theta;
  }
  x = (phi + 180) / 360  * canvas.width;
  y = (90 - theta) / 180 * canvas.height;
  return { x: x, y: y };
}

function canvas_to_angles(canvas, coords) {
  phi = coords[0] / canvas.width * 360 - 180;
  theta = 90 - coords[1] / canvas.height * 180;
  return { phi: phi, theta: theta };
}

function equator(pole, phi) {
   theta = -atand(cosd(phi - pole.phi) / tand(pole.theta))
   return theta;
}

function plain_from_false(pole, false_angles) {
  var ft = false_angles.theta;
  var fp = false_angles.phi;
  var pt = pole.theta;
  var phi = atan2d(sind(fp) * cosd(ft)
                 , sind(pt) * cosd(ft) * cosd(fp)
                 + cosd(pt) * sind(ft))
          + pole.phi;
  var theta = asind(-cosd(pt) * cosd(ft) * cosd(fp)
                   + sind(pt) * sind(ft));
  if (theta > 90) {
    theta -= 180;
  }
  if (theta < -90) {
    theta += 180;
  }
  if (phi < -180) {
    phi += 360;
  }
  if (phi > 180) {
    phi -= 360;
  }
  return { phi: phi, theta: theta };
}

function false_from_plain(pole, plain_angles) {
  var ft = plain_angles.theta;
  var fp = plain_angles.phi - pole.phi;
  var pt = pole.theta;
  var phi = atan2d(sind(fp) * cosd(ft)
                 , sind(pt) * cosd(ft) * cosd(fp)
                 - cosd(pt) * sind(ft));
  var theta = asind(+cosd(pt) * cosd(ft) * cosd(fp)
                   + sind(pt) * sind(ft));
  if (theta > 90) {
    theta -= 180;
  }
  if (theta < -90) {
    theta += 180;
  }
  if (phi < -180) {
    phi += 360;
  }
  if (phi > 180) {
    phi -= 360;
  }
  return { phi: phi, theta: theta };

}

var last_angles = false;
var last_detour = 0;
function get_outside_y(canvas) {
  if ((last_angles.theta > 0 && (last_detour != -1)) || last_detour == 1) {
    last_detour = 1;
    return -2;
  }
  last_detour = -1;
  return canvas.height + 2;
}

function draw_line(canvas, context, next_angles) {
  var point = angles_to_canvas(canvas, next_angles);
  if (last_angles == false) {
    context.beginPath();
    context.moveTo(point.x, point.y);
    last_angles = next_angles;
    return;
  }
  // More than half a circle away? Go the other way 'round.
  if (next_angles.phi > last_angles.phi + 180) {
    var last = angles_to_canvas(canvas, last_angles);
    var outside_y = get_outside_y(canvas);
    context.lineTo(-2, last.y);
    context.lineTo(-2, outside_y);
    context.lineTo(canvas.width + 2, outside_y);
    context.lineTo(canvas.width + 2, last.y);
  }
  if (next_angles.phi < last_angles.phi - 180) {
    var last = angles_to_canvas(canvas, last_angles);
    var outside_y = get_outside_y(canvas);
    context.lineTo(canvas.width + 2, last.y);
    context.lineTo(canvas.width + 2, outside_y);
    context.lineTo(-2, outside_y);
    context.lineTo(-2, last.y);
  }
  context.lineTo(point.x, point.y);
  last_angles = next_angles;
}

function close_line(context) {
  context.closePath();
  end_line();
}

function end_line() {
  last_angles = false;
  last_detour = 0;
}

function draw_normal() {
  var can = document.getElementById("normal_world");
  var ctx = can.getContext("2d");
  ctx.fillStyle = "#c6ecff";
  ctx.fillRect(0, 0, can.width, can.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#646464";
  ctx.fillStyle = "#fefef9";
  for (var i = 0; i < shapes.length; i++) {
    curr_shape = shapes[i];
    for (var j = 0; j < curr_shape.length; j++) {
      draw_line(can, ctx, { phi: curr_shape[j][0], theta: curr_shape[j][1] });
    }
    close_line(ctx);
    ctx.stroke();
    ctx.fill();
  }
  normalworld = ctx.getImageData(0, 0, can.width, can.height);
}

function draw_false(pole) {
  var can = document.getElementById("false_world");
  var ctx = can.getContext("2d");
  ctx.fillStyle = "#c6ecff";
  ctx.fillRect(0, 0, can.width, can.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#646464";
  ctx.fillStyle = "#fefef9";
  for (var i = 0; i < shapes.length; i++) {
    curr_shape = shapes[i];
    for (var j = 0; j < curr_shape.length; j++) {
      draw_line(can, ctx, false_from_plain(pole, { phi: curr_shape[j][0], theta: curr_shape[j][1] }))
    }
    close_line(ctx);
    ctx.stroke();
    ctx.fill();
  }
  ctx.lineWidth = .5;
  ctx.strokeStyle = "#ff0000";
  var theta_start = 90;
  /* längengrade */
  for (var phi_m = 0; phi_m < 360; phi_m += 45) {
    ctx.beginPath();
    for (var theta_m = theta_start; theta_m >= -75; theta_m -= 1) {
      draw_line(can, ctx, false_from_plain(north_pole, { phi: phi_m, theta: theta_m }));
    }
    end_line();
    ctx.stroke();
    ctx.strokeStyle = "#008000";
    theta_start = 75;
  }
  /* breitengrade */
  for (var theta_l = -75; theta_l <= 75; theta_l += 15) {
    ctx.strokeStyle = theta_l == 0 ? "#000000" : "#000080";
    for (var phi_l = 0; phi_l <= 360; phi_l += 5) {
      draw_line(can, ctx, false_from_plain(north_pole, { phi: phi_l, theta: theta_l }));
    }
    end_line();
    ctx.stroke();
  }
}

function track_poles(ev) {
  var can = document.getElementById("normal_world");
  var ctx = can.getContext("2d");
  ctx.putImageData(normalworld, 0, 0);
  ctx.fillStyle = "#ff0000";
  north_pole = canvas_to_angles(can, [ev.offsetX, ev.offsetY]);
  south_pole = { phi: north_pole.phi + 180, theta: -north_pole.theta };
  if (south_pole.phi > 180) {
    south_pole.phi -= 360;
  }
  np_coords = angles_to_canvas(can, north_pole);
  sp_coords = angles_to_canvas(can, south_pole);
  np = plain_from_false(north_pole, { phi: 0, theta:90 });
  np2= plain_from_false(north_pole, { phi:37, theta:90 });
  ctx.fillRect(np_coords.x - 1, np_coords.y - 1, 2, 2);
  ctx.fillStyle = "#0000ff";
  ctx.fillRect(sp_coords.x - 1, sp_coords.y - 1, 2, 2);
  ctx.lineWidth = .5;
  ctx.strokeStyle = "#ff0000";
  var theta_start = 90;
  /* längengrade */
  for (var phi_m = 0; phi_m < 360; phi_m += 45) {
    ctx.beginPath();
    meridian_point = angles_to_canvas(can, plain_from_false(north_pole, { phi: phi_m, theta: -90 }));
    ctx.moveTo(meridian_point.x, meridian_point.y);
    for (var theta_m = theta_start; theta_m >= -75; theta_m -= 1) {
      draw_line(can, ctx, plain_from_false(north_pole, { phi: phi_m, theta: theta_m }));
    }
    end_line();
    ctx.stroke();
    ctx.strokeStyle = "#008000";
    theta_start = 75;
  }
  /* breitengrade */
  for (var theta_l = -75; theta_l <= 75; theta_l += 15) {
    ctx.strokeStyle = theta_l == 0 ? "#000000" : "#000080";
    for (var phi_l = 0; phi_l <= 360; phi_l += 5) {
      draw_line(can, ctx, plain_from_false(north_pole, { phi: phi_l, theta: theta_l }));
    }
    end_line();
    ctx.stroke();
  }
  set_poles(ev);
}

function set_poles(ev) {
  var orig_can = document.getElementById("normal_world");
  north_pole = canvas_to_angles(orig_can, [ev.offsetX, ev.offsetY]);
  draw_false(north_pole);
}
