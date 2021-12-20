let canvasWidth = 1200;
let canvasHeight = 1800;
// let canvasWidth = 3584;
// let canvasHeight = 4563;
let cells;
let cellsWidth;
let cellsHeight;
let saveId = new Helpers().makeid(10);
let saveCount = 0;
let cW;
let cH;
let cols;
let rows;
const colors = new Colors();
let colorList;
let hexColors;
const pallets = [
  // https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
  ["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"],
  // https://coolors.co/f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0
  ["f72585","b5179e","7209b7","560bad","480ca8","3a0ca3","3f37c9","4361ee","4895ef","4cc9f0"],
  // https://coolors.co/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08
  ["03071e","370617","6a040f","9d0208","d00000","dc2f02","e85d04","f48c06","faa307","ffba08"],
  // https://coolors.co/ff6d00-ff7900-ff8500-ff9100-ff9e00-240046-3c096c-5a189a-7b2cbf-9d4edd
  ["ff6d00","ff7900","ff8500","ff9100","ff9e00","240046","3c096c","5a189a","7b2cbf","9d4edd"],
  // ["FBB042", "58595B", "231F20", "ffffff"],
];

// lower number = tighter design
let cellVariance = 25;

function setupCells(cv) {
  cols = ceil(canvasWidth / cv);
  rows = ceil(canvasHeight / cv);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  cellsWidth = (cols - 2) * cW;
  cellsHeight = (rows - 2) * cH;
}

function setup() {
  setupCells(cellVariance);
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  pixelDensity(1);
}

function draw() {
  noLoop();
  background(0, 0, 100, 100);
  cells = _.shuffle(new Cells(cols, rows, cW, cH).populateCells(false)[0]);
  cells = _.slice(cells, 0, floor(cells.length / 6));
  //cells = new Cells(cols, rows, cW, cH).populateCells(false)[0];

  ////--------------------------------------------------------------------------------
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  let pallet = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colors.HEXtoRGB(hexColors[i]);
    colorList.push(rgb);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    pallet.push(hsl);
  }
  ////--------------------------------------------------------------------------------

  for (var i = 0; i < cells.length; i++) {
    const c = cells[i];

    if (c.x === 0 || c.y === 0 || c.col + 1 === cols || c.row + 1 === rows) {
      continue;
    }

    let thisColor = random(pallet);
    let flip = new Helpers().flipACoin();

    //flip = false;
    if (flip) {
      let cube = new Cube(
        cW,
        cH,
        random(0.125, 10),
        random(0.125, 10),
        random(0.125, 10),
        c.x,
        c.y
      );

      // show the cube if it's inside the outer margin
      if (
        cube.v.a.x > cW * 1.5 &&
        cube.v.a.y > cH * 1.5 &&
        cube.v.b.x > cW * 1.5 &&
        cube.v.b.y > cH * 1.5 &&
        cube.v.f.x > cW * 1.5 &&
        cube.v.f.y > cH * 1.5 &&
        cube.v.c.x < canvasWidth - cW &&
        cube.v.c.y < canvasHeight - cH &&
        cube.v.d.x < canvasWidth - cW &&
        cube.v.d.y < canvasHeight - cH &&
        cube.v.e.x < canvasWidth - cW &&
        cube.v.e.y < canvasHeight - cH
      ) {
        cube.build(thisColor.h, thisColor.s, thisColor.l);
        //break;
      }
    } else {
      let hW = random(0.125, 10);
      let pyramid = new Pyramid(cW, cH, hW / 2, hW, random(0.125, 10), c.x, c.y);
      if (
        pyramid.v.a.x > cW * 1.5 &&
        pyramid.v.a.y > cH * 1.5 &&
        pyramid.v.e.x > cW * 1.5 &&
        pyramid.v.e.y > cH * 1.5 &&
        pyramid.v.c.x < canvasWidth - cW &&
        pyramid.v.c.y < canvasHeight - cH &&
        pyramid.v.d.x < canvasWidth - cW &&
        pyramid.v.d.y < canvasHeight - cH
      ) {
        pyramid.build(thisColor.h, thisColor.s, thisColor.l);
      }
    }

  }
}

class Cube {
  constructor(
    cellWidth = 10,
    cellHeight = 10,
    width = 1,
    height = 1,
    depth = 1,
    startX = 10,
    startY = 10
  ) {
    this.cW = cellWidth;
    this.cH = cellHeight;
    this.w = width;
    this.h = height;
    this.d = depth;
    this.x = startX;
    this.y = startY;
    this.v = {};
    this.v.g = createVector(this.x, this.y);
    this.v.c = createVector(this.x + this.cW * this.w, this.y);
    this.v.d = createVector(
      this.x + this.cW * this.w,
      this.y + this.cH * this.h
    );
    this.v.e = createVector(this.x, this.y + this.cH * this.h);

    this.v.f = createVector(
      this.v.e.x - this.cW * this.d,
      this.v.e.y - this.cH * this.d
    );

    this.v.b = createVector(
      this.v.c.x - this.cW * this.d,
      this.v.c.y - this.cH * this.d
    );

    this.v.a = createVector(
      this.v.g.x - this.cW * this.d,
      this.v.g.y - this.cH * this.d
    );
  }

  build = function (h = 0, s = 0, l = 0) {
    // l = l + floor(random(-25, 25));
    // base
    fill(h, s, l / 4, 100);
    noStroke();
    beginShape();
    vertex(this.v.a.x + 1, this.v.a.y + 1);
    vertex(this.v.b.x - 1, this.v.b.y + 1);
    vertex(this.v.c.x - 1, this.v.c.y);
    vertex(this.v.d.x - 1, this.v.d.y - 1);
    vertex(this.v.e.x + 1, this.v.e.y - 1);
    vertex(this.v.f.x + 1, this.v.f.y - 1);
    vertex(this.v.a.x + 1, this.v.a.y + 1);
    endShape();

    fill(h, s, l, 100);
    noStroke();
    beginShape();
    vertex(this.v.g.x, this.v.g.y);
    vertex(this.v.c.x, this.v.c.y);
    vertex(this.v.d.x, this.v.d.y);
    vertex(this.v.e.x, this.v.e.y);
    vertex(this.v.g.x, this.v.g.y);
    endShape();
    fill(h, s, l / 2, 100);
    beginShape();
    vertex(this.v.g.x, this.v.g.y);
    vertex(this.v.c.x, this.v.c.y);
    vertex(this.v.b.x, this.v.b.y);
    vertex(this.v.a.x, this.v.a.y);
    vertex(this.v.g.x, this.v.g.y);
    endShape();
    fill(h, s, l / 4, 100);
    beginShape();
    vertex(this.v.g.x, this.v.g.y);
    vertex(this.v.a.x, this.v.a.y);
    vertex(this.v.f.x, this.v.f.y);
    vertex(this.v.e.x, this.v.e.y);
    vertex(this.v.g.x, this.v.g.y);
    endShape();
  };

  // https://editor.p5js.org/mwburke/sketches/h1ec1s6LG
  intersectPoint = function (point1, point2, point3, point4) {
    const ua =
      ((point4[0] - point3[0]) * (point1[1] - point3[1]) -
        (point4[1] - point3[1]) * (point1[0] - point3[0])) /
      ((point4[1] - point3[1]) * (point2[0] - point1[0]) -
        (point4[0] - point3[0]) * (point2[1] - point1[1]));

    const ub =
      ((point2[0] - point1[0]) * (point1[1] - point3[1]) -
        (point2[1] - point1[1]) * (point1[0] - point3[0])) /
      ((point4[1] - point3[1]) * (point2[0] - point1[0]) -
        (point4[0] - point3[0]) * (point2[1] - point1[1]));

    const x = point1[0] + ua * (point2[0] - point1[0]);
    const y = point1[1] + ua * (point2[1] - point1[1]);

    return [x, y];
  };
}

class Pyramid {
  constructor(
    cellWidth = 10,
    cellHeight = 10,
    width = 1,
    height = 1,
    depth = 1,
    startX = 10,
    startY = 10
  ) {
    this.cW = cellWidth;
    this.cH = cellHeight;
    this.w = width;
    this.h = height;
    this.d = depth;
    this.x = startX;
    this.y = startY;
    this.v = {};

    this.v.b = createVector(this.x, this.y);
    this.v.c = createVector(
      this.x + this.w * this.cW,
      this.y + this.h * this.cH
    );
    this.v.d = createVector(
      this.x - this.w * this.cW,
      this.y + this.h * this.cH
    );
    this.v.e = createVector(
      this.v.d.x - this.d * this.cW,
      this.v.d.y - this.d * this.cH
    );
    this.v.a = createVector(
      this.v.b.x - this.d * this.cW,
      this.v.b.y - this.d * this.cH
    );
  }

  build = function (h = 0, s = 0, l = 0) {
    //base

    fill(h, s, l / 4, 100);
    beginShape();
    vertex(this.v.a.x + 1, this.v.a.y + 1);
    vertex(this.v.b.x - 1, this.v.b.y + 1);
    //vertex(this.v.c.x - 1, this.v.c.y - 1);
    vertex(this.v.b.x + (dist(this.v.b.x, 0, this.v.c.x, 0) / 2), this.v.b.y + (dist(0, this.v.b.y, 0, this.v.c.y) / 2));
    vertex(this.v.d.x + 1, this.v.d.y - 1);
    vertex(this.v.e.x + 1, this.v.e.y);
    vertex(this.v.a.x + 1, this.v.a.y + 1);
    endShape();

    fill(h, s, l, 100);
    noStroke();
    triangle(
      this.v.d.x,
      this.v.d.y,
      this.v.b.x,
      this.v.b.y,
      this.v.c.x,
      this.v.c.y
    );

    fill(h, s, l / 4, 100);
    beginShape();
    vertex(this.v.b.x, this.v.b.y);
    vertex(this.v.a.x, this.v.a.y);
    vertex(this.v.e.x, this.v.e.y);
    vertex(this.v.d.x, this.v.d.y);
    endShape();
  };
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.svg`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === "r") {
    window.location.reload(false);
  }

  if (key === "Enter") {
    redraw();
  }

  if (key === "s") {
    save(saveFileName());
  }

  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 10; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
