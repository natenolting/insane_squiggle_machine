let canvasWidth = 5000;
let canvasHeight = 5000;
let margin = 100;
let iterations = 500;
let sizeVariation = 10;
let lengthVariation = 10;

let cubeSideHeightMultiple = 0.577396542692509;
let cubesideWidth = 12.2176;
let cubesideHeight = cubesideWidth * cubeSideHeightMultiple;

const pallets = [
["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
["233d4d","fe7f2d","fcca46","a1c181","619b8a"],
["ff6b35","f7c59f","efefd0","004e89","1a659e"],
["ffffff","84dcc6","a5ffd6","ffa69e","ff686b"],


];


let saveId = new Helpers().makeid(10);
let saveCount = 0;


const colors = new Colors();
let colorList;
let hexColors;


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  pixelDensity(1);
}


function draw() {
  noLoop();
	background(0, 0, 100, 100);
  noStroke();
  fill(0, 0, 100, 100);
  rect(0,0,canvasWidth,canvasHeight);

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  let pallet = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colors.HEXtoRGB(hexColors[i]);
    colorList.push(rgb);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    pallet.push(hsl);
  }
  let roll = new Helpers().rollADie(7);
  let size = new Helpers().rollADie(sizeVariation);
  let multiple = new Helpers().rollADie(lengthVariation);
  let iso = new Isometric(canvasWidth/2, canvasHeight/2, cubesideWidth, cubesideHeight,size);
  let coord = iso.pickDirection(roll, multiple);
  let thisColor = random(pallet);

  coord.build(thisColor.h, thisColor.s, thisColor.l);
  let oldCoord = coord;
  for (var i = 0; i < iterations; i++) {
    let origin = { x: oldCoord.a.x, y: oldCoord.a.y };

    let newIso = new Isometric(
      origin.x + cubesideWidth,
      origin.y + cubesideHeight,
      cubesideWidth,
      cubesideHeight,
      size
    );
    roll = new Helpers().rollADie(7);
    multiple = new Helpers().rollADie(lengthVariation);
    let newCoord = newIso.pickDirection(roll, multiple);

    // if we hit a wall reset the starting point/size
    if (
      newCoord.d.x < margin || newCoord.d.y < margin ||
      newCoord.c.x < 0 || newCoord.c.y < 0 ||
      newCoord.b.x < 0 || newCoord.b.y < 0 ||
      newCoord.e.x > canvasWidth - margin || newCoord.e.y > canvasHeight - margin ||
      newCoord.f.x > canvasWidth - margin || newCoord.f.y > canvasHeight - margin ||
      newCoord.a.x > canvasWidth - margin || newCoord.a.y > canvasHeight - margin
    ) {
      size = new Helpers().rollADie(sizeVariation);
      oldCoord = new Isometric(
        floor(random(margin, canvasWidth - margin)),
        floor(random(margin, canvasHeight - margin)),
        cubesideWidth,
        cubesideHeight,
        size
      );
      // pick a new color
      thisColor = random(pallet);
      continue;
    }

    newCoord.build(thisColor.h, thisColor.s, thisColor.l);
    oldCoord = newCoord;
  }


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
    switch (direction) {
      case 2:
        this.rectangleSe(multiple);
        break;
      case 3:
        this.rectangleSw(multiple);
        break;
      case 4:
        this.rectangleNw(multiple);
        break;
      case 5:
        this.rectangleNe(multiple);
        break;
      case 6:
        this.rectangleN(multiple);
        break;
      case 7:
        this.rectangleS(multiple);
        break;
      default:

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

  // Build a rectangle in a north direction
  rectangleS = function(multiplier = 1) {
    this.f = { x: this.f.x, y: this.f.y + ((this.sideH * 2) * multiplier) };
    this.a = { x: this.a.x, y: this.a.y + ((this.sideH * 2) * multiplier) };
    this.b = { x: this.b.x, y: this.b.y + ((this.sideH * 2) * multiplier) };
    return this;
  };

  build = function (h = 0, s = 0, l = 50) {

    strokeWeight(.5);
    // left face
    stroke(h, s, l / 2, 100);
    fill(h, s, l / 2, 100);
    beginShape();
    vertex(this.a.x, this.a.y);
    vertex(this.b.x, this.b.y);
    vertex(this.c.x, this.c.y);
    vertex(this.g.x, this.g.y);
    vertex(this.a.x, this.a.y);
    endShape();

    // right face
    stroke(h, s, l / 4, 100);
    fill(h, s, l / 4, 100);
    beginShape();
    vertex(this.a.x, this.a.y);
    vertex(this.f.x, this.f.y);
    vertex(this.e.x, this.e.y);
    vertex(this.g.x, this.g.y);
    vertex(this.a.x, this.a.y);
    endShape();

    // top
    stroke(h, s, l, 100);
    fill(h, s, l, 100);
    beginShape();
    vertex(this.c.x, this.c.y);
    vertex(this.d.x, this.d.y);
    vertex(this.e.x, this.e.y);
    vertex(this.g.x, this.g.y);
    vertex(this.c.x, this.c.y);
    endShape();
  };

}

function saveFileName() {
  let fileName = `${saveId}_${canvasWidth}x${canvasHeight}_${margin}_${iterations}_${sizeVariation}_${lengthVariation}_${saveCount}.jpeg`;
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
