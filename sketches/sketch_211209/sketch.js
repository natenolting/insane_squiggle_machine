// let canvasWidth = 1200;
// let canvasHeight = 900;
let canvasWidth = 3584;
let canvasHeight = 4563;
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
  [
    "f72585",
    "b5179e",
    "7209b7",
    "560bad",
    "480ca8",
    "3a0ca3",
    "3f37c9",
    "4361ee",
    "4895ef",
    "4cc9f0",
  ],
  [
    "03071e",
    "370617",
    "6a040f",
    "9d0208",
    "d00000",
    "dc2f02",
    "e85d04",
    "f48c06",
    "faa307",
    "ffba08",
  ],
  [
    "001219",
    "005f73",
    "0a9396",
    "94d2bd",
    "e9d8a6",
    "ee9b00",
    "ca6702",
    "bb3e03",
    "ae2012",
    "9b2226",
  ],
  [
    "0b090a",
    "161a1d",
    "660708",
    "a4161a",
    "ba181b",
    "e5383b",
    "b1a7a6",
    "d3d3d3",
    "f5f3f4",
    "ffffff",
  ],
];

// lower number = tighter design
let cellVariance = 100;

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
  createCanvas(canvasWidth, canvasHeight, P2D);
  colorMode(HSL, 359, 100, 100, 100);
  pixelDensity(1);
}

function draw() {
  noLoop();
  //background(0, 0, 100, 100);
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

    let cube = new Cube(
      cW,
      cH,
      random(0.125, 5),
      random(0.125, 5),
      random(0.125, 5),
      c.x,
      c.y
    );
    let thisColor = random(pallet);
    // show the cube if it's inside the outer margin
    if (
      cube.v.a.x > cW &&
      cube.v.a.y > cH &&
      cube.v.b.x > cW &&
      cube.v.b.y > cH &&
      cube.v.f.x > cW &&
      cube.v.f.y > cH &&
      cube.v.c.x < canvasWidth - cW &&
      cube.v.c.y < canvasHeight - cH &&
      cube.v.d.x < canvasWidth - cW &&
      cube.v.d.y < canvasHeight - cH
    ) {
      cube.build(thisColor.h, thisColor.s, thisColor.l);
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
    startX = 0,
    startY = 0
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
    this.v.e = createVector(this.x, this.y + this.cH * this.h);
    this.v.d = createVector(
      this.x + this.cW * this.w,
      this.y + this.cH * this.h
    );
    this.v.c = createVector(this.x + this.cW * this.w, this.y);

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

    // base
    fill(h, s, l / 4, 100);
    beginShape();
    vertex(this.v.a.x, this.v.a.y);
    vertex(this.v.b.x, this.v.b.y);
    vertex(this.v.c.x, this.v.c.y);
    vertex(this.v.d.x, this.v.d.y);
    vertex(this.v.e.x, this.v.e.y);
    vertex(this.v.f.x, this.v.f.y);
    vertex(this.v.a.x, this.v.a.y);
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
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
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
