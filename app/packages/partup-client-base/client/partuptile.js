Partup.client.partuptile = {
  drawCircle: function(canvas, options) {
    // Get options
    options = options || {};
    let background_color = get(options, 'background_color') || '#fff';
    let border_color = get(options, 'border_color') || '#ffa725';
    let border_color_negative = get(options, 'border_color_negative') || '#eee';

    // jQuery object
    let $canvas = $(canvas);

    // Settings
    let settings = {
      percent: $canvas.data('percent') || 0.000001, // needed to draw Arc 2 when percent = 0
      linewidth: 2,
      firstcolor: border_color,
      secondcolor: border_color_negative,
      width: $canvas.width(),
      height: $canvas.height(),
    };

    // Create context
    let ctx = canvas.getContext('2d');

    // Circle calculations
    let circ = Math.PI * 2;
    let quart = circ / 4;
    let endingAngle = circ * settings.percent / 100 - quart;
    let radius = settings.width / 2;

    // Set canvas dimensions
    canvas.width = settings.width;
    canvas.height = settings.height;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Outer circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = background_color;
    ctx.fill();
    ctx.closePath();

    // Arc 1
    ctx.beginPath();
    ctx.arc(
      radius,
      radius,
      radius - 4 - settings.linewidth / 2,
      -quart,
      endingAngle,
      false
    );
    ctx.strokeStyle = settings.firstcolor;
    ctx.lineWidth = settings.linewidth;
    ctx.stroke();
    ctx.closePath();

    // Arc 2
    ctx.beginPath();
    ctx.arc(
      radius,
      radius,
      radius - 4 - settings.linewidth / 2,
      endingAngle,
      -quart,
      false
    );
    ctx.strokeStyle = settings.secondcolor;
    ctx.lineWidth = settings.linewidth;
    ctx.stroke();
    ctx.closePath();
  },

  /**
   * Function to calculate x and y for an avatar
   *
   * @param {number} count   Number of total avatars
   * @param {number} current   Index of current avatar (from 0)
   * @param {number} base_angle   Base angle (in degrees)
   * @param {number} distance_angle   Distance angle between each avatar (in degrees)
   * @param {number} radius   Radius of the circle in pixels
   * @returns {Object} coordinates   Coordinates for the center of the avatar in pixels
   * @returns {Object} coordinates.x
   * @returns {Object} coordinates.y
   */
  getAvatarCoordinates: function(
    count,
    current,
    base_angle,
    distance_angle,
    radius
  ) {
    let start_angle = distance_angle * ((count - 1) / 2) + base_angle;
    let current_angle = start_angle - current * distance_angle;
    let x = radius * Math.cos(current_angle * (Math.PI / 180));
    let y = -radius * Math.sin(current_angle * (Math.PI / 180));

    return {
      x: x,
      y: y,
    };
  },

  userIsDefinitlyMemberOfNetwork: function(networkObject, userId) {
    if (!userId) return false;
    if (!networkObject) return false;
    let uppers = networkObject.uppers || [];
    return mout.lang.isString(userId) && uppers.indexOf(userId) > -1;
  },
};
