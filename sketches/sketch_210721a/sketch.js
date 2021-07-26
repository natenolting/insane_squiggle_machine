let cols = 25;
let rows = 25;

let sketch = function (p) {
  p.wW = p.windowWidth * 0.95;
  p.wH = p.windowWidth * 0.95;

  p.coordinates = [];

  p.cW = p.wW / cols;
  p.cH = p.wH / cols;

  p.saveCount = 0;

  p.setup = function () {
    let sketchCanvas = p.createCanvas(p.wW, p.wH);
    p.colorMode(p.HSB, 359, 100, 100, 100);
    sketchCanvas.parent('p5js_canvas');
  };

  // // https://stackoverflow.com/a/57892466
  // p.intersectLineCircle = function(p1, p2, cpt, r) {
  //
  //     let sign = function(x) { return x < 0.0 ? -1 : 1; };
  //
  //     let x1 = p1.copy().sub(cpt);
  //     let x2 = p2.copy().sub(cpt);
  //
  //     let dv = x2.copy().sub(x1)
  //     let dr = dv.mag();
  //     let D = x1.x*x2.y - x2.x*x1.y;
  //
  //     // evaluate if there is an intersection
  //     let di = r*r*dr*dr - D*D;
  //     if (di < 0.0)
  //         return [];
  //
  //     let t = p.sqrt(di);
  //
  //     ip = [];
  //     ip.push( new p5.Vector(D*dv.y + sign(dv.y)*dv.x * t, -D*dv.x + p.abs(dv.y) * t).div(dr*dr).add(cpt) );
  //     if (di > 0.0) {
  //         ip.push( new p5.Vector(D*dv.y - sign(dv.y)*dv.x * t, -D*dv.x - p.abs(dv.y) * t).div(dr*dr).add(cpt) );
  //     }
  //     return ip;
  // }

  // https://stackoverflow.com/a/57892466
  // p.inBetween = function (p1, p2, px) {
  //   let v = p2.copy().sub(p1);
  //   let d = v.mag();
  //   v = v.normalize();
  //
  //   let vx = px.copy().sub(p1);
  //   let dx = v.dot(vx);
  //
  //   return dx >= 0 && dx <= d;
  // };

  p.endlessLine = function(x1, y1, x2, y2) {

    p1 = new p5.Vector(x1, y1);
    p2 = new p5.Vector(x2, y2);

    let dia_len = new p5.Vector(p.windowWidth, p.windowHeight).mag();
    let dir_v = p5.Vector.sub(p2, p1).setMag(dia_len);
    let lp1 = p5.Vector.add(p1, dir_v);
    let lp2 = p5.Vector.sub(p1, dir_v);

    p.line(lp1.x, lp1.y, lp2.x, lp2.y);

    return [lp1, lp2];
  };

  p.bubbleIntersect = function (cpt, check, cptR, checkR) {

    let distance = p.dist(cpt.x, cpt.y, check.x, check.y);
    return distance < cptR + checkR;

  };

  p.tTextureTopLeft = function (x, y, w, h, rad, texture) {

    let eX;
    let eY;
    let eR;
    let eRH;
    let cpt;
    let v = 0.90;

    // for debugging
    p.stroke(236, 91, 72, 100);

    // top left
    if (w <= h) {
      // for debugging
      console.log('width');
      p.rect(x, y, w / (rad * v), w / (rad * v));
      p.stroke(236, 91, 72, 100);

      // end debugging
      eX = x + w / (rad * v);
      eY = y + w / (rad * v);
      eR = w / (rad * v) * 2;

    } else {
      // for debugging
      console.log('height');

      p.rect(x, y, h / (rad * 0.75), h / (rad * 0.75));

      // end debugging
      eX = x + h / (rad * 0.75);
      eY = y + h / (rad * 0.75);
      eR = h / (rad * 0.375);
    }

    // for debugging
    p.ellipse(eX, eY, eR);
    p.ellipse(eX, eY, 5);

    // end debugging

    cpt = p.createVector(eX, eY);

    for (var i = 0; i < texture.length; i++) {
      if (p.bubbleIntersect(cpt, texture[i], eR / 2, 2)) {
        p.point(texture[i].x, texture[i].y);
        _.pullAt(texture, [i]);
      }
    }

    return texture;
  };

  p.tTexture = function (x, y, w, h, r, density, lightDark) {
    let xOffset = w;
    let yOffset = h;
    let texture = [];

    for (let i = 0; i < density; i++) {
      texture.push(p.createVector(
        _.random(x, x + xOffset, true),
        _.random(y, y + yOffset, true)
      ));
    }

    p.noStroke();

    if (lightDark % 2 === 0) {
      p.fill(0, 0, 100, 100);
    } else {
      p.fill(0, 0, 0, 100);
    }

    // debugging
    p.fill(0, 0, 100, 100);

    if (w >= h) {
      p.rect(x, y, w, h, w / r, w / r);
    } else {
      p.rect(x, y, w, h, h / r, h / r);
    }

    p.noFill();

    // debug stuff
    p.stroke(0, 100, 100, 100);
    p.line(x + w / 2, y, x + w / 2, y + h);
    p.line(x, y + h / 2, x + w, y + h / 2);

    p.tTextureTopLeft(x, y, w, h, 4, texture);

  };

  p.saveFileName = function () {
    let fileName = `sketch_210721a_${saveCount}.jpg`;
    saveCount++;
    return fileName;
  };

  p.draw = function () {
    p.noLoop();
    p.background(0, 0, 50, 100);
    let lightDark = _.random(1, 10);
    p.tTexture(
      p.cW,
      p.cH * 3,
      300,
      600,
      5,
      _.random(1000, 100000),
      lightDark
    );

    // for (var i = 0; i < 100; i++) {
    //   let coord = coordinates[_.random(0, coordinates.length - 1)];
    //   let lightDark = _.random(1, 10);
    //
    //   tTexture(
    //     coord.x,
    //     coord.y,
    //     cW * _.random(1, cols),
    //     cH * _.random(1, rows),
    //     _.random(1, 100000),
    //     lightDark
    //   );
    // }
  };

  p.keyPressed = function () {
    if (p.key === "Enter") {
      p.redraw();
    }

    if (p.key === "s") {
      p.save(p.saveFileName());
    }
  };
};

let circle_line = new p5(sketch);
