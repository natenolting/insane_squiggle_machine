const helper = new Helpers();
// --------------------------------------------------------------------------------------------------
// Settings
// 2750 x 4250 = 11x17" @ 250 ppi
let margin = 25;
let canvasWidth = window.innerWidth - margin;
let canvasHeight = window.innerHeight - margin;
let iterations = 1000;
let sizeVariation = helper.range(1,15);
let lengthVariation = 20;
let cubesideWidth = 12;
let rollBetween = helper.range(1,7);
let pixelD = 4;
let opacity = 100;

// --------------------------------------------------------------------------------------------------

let cubeSideHeightMultiple = 0.577396542692509;
let cubesideHeight = cubesideWidth * cubeSideHeightMultiple;
//canvasHeight = (canvasWidth / 2) * cubeSideHeightMultiple * 4;
let data;
let pallets;
let cols = Math.floor(canvasWidth / cubesideWidth);
let rows = Math.floor(canvasHeight / cubesideHeight);

let cells = _.sortBy(new Cells(cols, rows, cubesideWidth, cubesideHeight).populateCells(false)[0], ['row', 'col']);
//cells = _.filter(cells, function(o) { return o.cX >= (canvasWidth / 2) - (cubesideWidth / 2) && o.cX <= (canvasWidth / 2) + (cubesideWidth / 2); })
//console.log(cells);

let saveId = helper.makeid(10);
let saveCount = 0;


const colors = new Colors();
let colorList;
let hexColors;

function vectorsAreInsideBounds(iso) {
    return iso.a.x >= margin && iso.a.y >= margin && iso.a.x <= canvasWidth - margin && iso.a.y <= canvasHeight - margin &&
           iso.b.x >= margin && iso.b.y >= margin && iso.b.x <= canvasWidth - margin && iso.b.y <= canvasHeight - margin &&
           iso.c.x >= margin && iso.c.y >= margin && iso.c.x <= canvasWidth - margin && iso.c.y <= canvasHeight - margin &&
           iso.d.x >= margin && iso.d.y >= margin && iso.d.x <= canvasWidth - margin && iso.d.y <= canvasHeight - margin &&
           iso.e.x >= margin && iso.e.y >= margin && iso.e.x <= canvasWidth - margin && iso.e.y <= canvasHeight - margin &&
           iso.f.x >= margin && iso.f.y >= margin && iso.f.x <= canvasWidth - margin && iso.f.y <= canvasHeight - margin &&
           iso.g.x >= margin && iso.g.y >= margin && iso.g.x <= canvasWidth - margin && iso.g.y <= canvasHeight - margin
}

function pickPallet() {
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  let pallet = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colors.HEXtoRGB(hexColors[i]);
    colorList.push(rgb);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    pallet.push(hsl);
  }
  return pallet;
}

function preload() {
  data = loadJSON("../../data/palettes.json");

}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  console.log();
  colorMode(HSL, 359, 100, 100, 100);
  pixelDensity(pixelD);
  pallets = data.palettes;
}


function draw() {
  noLoop();
	// background(0, 0, 100, 100);
  // noStroke();
  // fill(0, 0, 100, 100);
  // rect(0,0,canvasWidth,canvasHeight);

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  let pallet = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colors.HEXtoRGB(hexColors[i]);
    colorList.push(rgb);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    pallet.push(hsl);
  }
  let sizeOfShape;
  let roll;
  let multiple;
  if (Array.isArray(rollBetween)) {
    roll = random(rollBetween);
  } else {
    roll = helper.rollADie(7);
  }

  if (Array.isArray(sizeVariation)) {
    sizeOfShape = random(sizeVariation);
  } else {
    sizeOfShape = helper.rollADie(sizeVariation);
  }
  if (Array.isArray(lengthVariation)) {
    multiple = random(lengthVariation);
  } else {
    multiple = helper.rollADie(lengthVariation);
  }

  let startingPoint = random(cells);
  let iso = new Isometric(startingPoint.cX, startingPoint.cY, cubesideWidth, cubesideHeight,sizeOfShape);
  let coord = iso.pickDirection(roll, multiple);
  let thisColor = random(pallet);
  if (vectorsAreInsideBounds(coord)) {
    coord.build(thisColor.h, thisColor.s, thisColor.l, opacity);
  }
  let oldCoord = coord;
  for (var i = 0; i < iterations; i++) {
    if (Array.isArray(rollBetween)) {
      roll = random(rollBetween);
    } else {
      roll = helper.rollADie(7);
    }
    // starting point "g" seems to give the best result
    startingPoint = { x: oldCoord.g.x, y: oldCoord.g.y };

    let newIso = new Isometric(
      startingPoint.x,
      startingPoint.y,
      cubesideWidth,
      cubesideHeight,
      sizeOfShape
    );

    multiple = helper.rollADie(lengthVariation);
    let newCoord = newIso.pickDirection(roll, multiple);

    // if we hit a wall reset the starting point/size
    if (!vectorsAreInsideBounds(newCoord)) {
      if (Array.isArray(sizeVariation)) {
        sizeOfShape = random(sizeVariation);
      } else {
        sizeOfShape = helper.rollADie(sizeVariation);
      }

      startingPoint = random(cells);
      oldCoord = new Isometric(
        startingPoint.cX,
        startingPoint.cY,
        cubesideWidth,
        cubesideHeight,
        sizeOfShape
      );
      // pick a new color
      thisColor = random(pallet);
      continue;
    }

    newCoord.build(thisColor.h, thisColor.s, thisColor.l, opacity);
    oldCoord = newCoord;
  }

// show the pallet used in the corner
push();
let offset = (margin / 4) * pallet.length;
// stroke(0,0,0,100);
// strokeWeight(5);
// line(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
translate((canvasWidth / 2) - offset + (margin / 8), 0);

let pp = {x: 0, y: canvasHeight - (margin/2), w: (margin / 4), h: (margin / 4) };
for (var i = 0; i < pallet.length; i++) {
  let cp = pallet[i];
  fill(cp.h, cp.s, cp.l, 100);
  rect(pp.x, pp.y, pp.w, pp.h);
  pp.x = pp.x + pp.w + (margin / 4);
}
pop();
}

class Isometric {
  constructor(startX, startY, sideW, sideH, multiplier) {
    this.startX = startX;
    this.startY = startY;
    this.multiplier = multiplier;
    this.sideW = sideW * this.multiplier;
    this.sideH = sideH * this.multiplier;
    this.baseCoodinates();
  };

  pickDirection = function(direction, multiple) {

    let directions = {
      2: 'rectangleSe',
      3: 'rectangleSw',
      4: 'rectangleNw',
      5: 'rectangleNe',
      6: 'rectangleN',
      7: 'rectangleS',
    }
    if (direction in directions) {
      eval(`this.${directions[direction]}(${multiple})`);
    }

    return this;
  }

  baseCoodinates = function () {

    this.a = { x: this.startX, y: this.startY };
    this.b = { x: this.a.x - this.sideW, y: this.a.y - this.sideH };
    this.c = { x: this.b.x, y: this.b.y - this.sideH * 2 };
    this.g = { x: this.a.x, y: this.a.y - this.sideH * 2 };
    this.f = { x: this.a.x + this.sideW, y: this.a.y - this.sideH };
    this.e = { x: this.f.x, y: this.f.y - this.sideH * 2 };
    this.d = { x: this.a.x, y: this.a.y - this.sideH * 4 };

  };

  // Build a rectangle in the southeast direction
  rectangleSe = function (multiplier = 1) {
    this.a = { x: this.b.x + ((this.sideW * 2) * multiplier), y: this.b.y + ((this.sideH * 2) * multiplier) };
    this.e = { x: this.d.x + ((this.sideW * 2) * multiplier), y: this.d.y + ((this.sideH * 2) * multiplier) };
    this.f = { x: this.g.x + ((this.sideW * 2) * multiplier), y: this.g.y + ((this.sideH * 2) * multiplier) };
    this.g = { x: this.c.x + ((this.sideW * 2) * multiplier), y: this.c.y + ((this.sideH * 2) * multiplier) };
    return this;
  };

  // build a rectangle in the southwest direction
  rectangleSw = function (multiplier = 1) {
    this.a = { x: this.f.x - ((this.sideW * 2) * multiplier), y: this.f.y + ((this.sideH * 2) * multiplier) };
    this.b = { x: this.g.x - ((this.sideW * 2) * multiplier), y: this.g.y + ((this.sideH * 2) * multiplier) };
    this.c = { x: this.d.x - ((this.sideW * 2) * multiplier), y: this.d.y + ((this.sideH * 2) * multiplier) };
    this.g = { x: this.e.x - ((this.sideW * 2) * multiplier), y: this.e.y + ((this.sideH * 2) * multiplier) };
    return this;
  };

  // build a rectangle in the northwest direction
  rectangleNw = function (multiplier = 1) {
    this.b = { x: this.a.x - ((this.sideW * 2) * multiplier), y: this.a.y - ((this.sideH * 2) * multiplier) };
    this.c = { x: this.g.x - ((this.sideW * 2) * multiplier), y: this.g.y - ((this.sideH * 2) * multiplier) };
    this.d = { x: this.e.x - ((this.sideW * 2) * multiplier), y: this.e.y - ((this.sideH * 2) * multiplier) };
    return this;
  };

  // build a rectangle in a northeast direction
  rectangleNe = function (multiplier = 1) {
    this.d = { x: this.c.x + ((this.sideW * 2) * multiplier), y: this.c.y - ((this.sideH * 2) * multiplier) };
    this.e = { x: this.g.x + ((this.sideW * 2) * multiplier), y: this.g.y - ((this.sideH * 2) * multiplier) };
    this.f = { x: this.a.x + ((this.sideW * 2) * multiplier), y: this.a.y - ((this.sideH * 2) * multiplier) };
    return this;
  };
  // Build a rectangle in a north direction
  rectangleN = function(multiplier = 1) {
    this.e = { x: this.e.x, y: this.e.y - ((this.sideH * 2) * multiplier) };
    this.d = { x: this.d.x, y: this.d.y - ((this.sideH * 2) * multiplier) };
    this.c = { x: this.c.x, y: this.c.y - ((this.sideH * 2) * multiplier) };
    this.g = { x: this.g.x, y: this.g.y - ((this.sideH * 2) * multiplier) };
    return this;
  };

  // Build a rectangle in a south direction
  rectangleS = function(multiplier = 1) {
    this.f = { x: this.f.x, y: this.f.y + ((this.sideH * 2) * multiplier) };
    this.a = { x: this.a.x, y: this.a.y + ((this.sideH * 2) * multiplier) };
    this.b = { x: this.b.x, y: this.b.y + ((this.sideH * 2) * multiplier) };
    return this;
  };

  buildLeftFace = function()
  {
    beginShape();
    vertex(this.a.x, this.a.y);
    vertex(this.b.x, this.b.y);
    vertex(this.c.x, this.c.y);
    vertex(this.g.x, this.g.y);
    vertex(this.a.x, this.a.y);
    endShape();
  }

  buildRightFace = function()
  {
    beginShape();
    vertex(this.a.x, this.a.y);
    vertex(this.f.x, this.f.y);
    vertex(this.e.x, this.e.y);
    vertex(this.g.x, this.g.y);
    vertex(this.a.x, this.a.y);
    endShape();
  }

  buildTopFace = function()
  {
    beginShape();
    vertex(this.c.x, this.c.y);
    vertex(this.d.x, this.d.y);
    vertex(this.e.x, this.e.y);
    vertex(this.g.x, this.g.y);
    vertex(this.c.x, this.c.y);
    endShape();
  }

  build = function (h = 0, s = 0, l = 50, o = 100) {

    // left face
    noStroke();
    fill(h, s, l * .75, o);
    this.buildLeftFace();

    // right face
    fill(h, s, l * .55, o);
    this.buildRightFace();

    // top
    fill(h, s, l, o);
    this.buildTopFace()

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
    clear();
    redraw();
  }

  if (key === "s") {
    save(saveFileName());
  }

  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 10; i++) {
      clear();
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
