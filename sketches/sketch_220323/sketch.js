const helper = new Helpers();
const colors = new Colors();
// --------------------------------------------------------------------------------------------------
// Settings
// 2750 x 4250 = 11x17" @ 250 ppi
let margin = 50;
let canvasWidth = window.innerWidth - margin;
let canvasHeight = window.innerHeight - margin;
let iterations = 1000;
let cubesideWidth = 12;
let pixelD = 4;
let maxBlockToSide = 35;
let blocksToSkip = 30;
let opacity = 100;
let useStroke = false;
let useRotation = true;
let useScale = true;
let useNoise = true;

// --------------------------------------------------------------------------------------------------

let cubeSideHeightMultiple = 0.577396542692509;
let cubesideHeight = cubesideWidth * cubeSideHeightMultiple;

let data;
let pallets;

let hexColors;
let cols = Math.floor(canvasWidth / cubesideWidth);
let rows = Math.floor(canvasHeight / cubesideHeight);

let cells = _.sortBy(new Cells(cols, rows, cubesideWidth, cubesideHeight).populateCells(false)[0], ['row', 'col']);
//cells = _.filter(cells, function(o) { return o.cX >= (canvasWidth / 2) - (cubesideWidth / 2) && o.cX <= (canvasWidth / 2) + (cubesideWidth / 2); })
//console.log(cells);

let saveId = helper.makeid(10);
let saveCount = 0;

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

  let pallet = pickPallet()

	background(0, 0, 100, 100);
  noStroke();
  fill(0, 0, 100, 100);
  rect(0,0,canvasWidth,canvasHeight);

  fill(0,0,100,100);
  stroke(0,0,0,100);
  strokeWeight(2);
  strokeCap(ROUND);

  let basicIso = new Isometric(canvasWidth/2, canvasHeight - margin, cubesideWidth, cubesideHeight, 1);
  let containerMultipler = (canvasHeight - (margin * 2)) / dist(basicIso.a.x, basicIso.a.y, basicIso.d.x, basicIso.d.y);

  let containerIso = new Isometric(canvasWidth/2, canvasHeight - margin, cubesideWidth, cubesideHeight, containerMultipler);
  // containerIso.buildTopFace();
  // containerIso.buildLeftFace();
  // containerIso.buildRightFace();

  let startingPointX = canvasWidth/2;
  let startingPointY = canvasHeight - margin;
  let blockSideWidth = (dist(containerIso.a.x, containerIso.a.y, containerIso.b.x,containerIso.a.y)) / maxBlockToSide;
  let blockSideHeight = blockSideWidth * cubeSideHeightMultiple;

  let blocks = [];

  for (var c = 0; c < maxBlockToSide; c++) {
    for (var r = 0; r < maxBlockToSide; r++) {

    blocks.push(
      new Isometric(
        containerIso.g.x + (blockSideWidth * c),
        containerIso.g.y + (blockSideHeight * 2) - (blockSideHeight * 2 * r) + (blockSideHeight * c),
        blockSideWidth,
        blockSideHeight,
        1
      )
    );

    for (var i = 1; i < maxBlockToSide; i++) {
      let last = blocks[i - 1];
      blocks.push(
        new Isometric(
          last.a.x - blockSideWidth + (blockSideWidth * c),
          last.a.y + blockSideHeight - (blockSideHeight * 2 * r) + (blockSideHeight * c),
          blockSideWidth,
          blockSideHeight,
          1
        )
      );
    }
  }
}

  for (var i = 0; i < blocks.length; i+=blocksToSkip) {
        let thisColor = random(pallet);
        push();
        let cube = blocks[i];
        let startX = cube.g.x;
        let startY = cube.g.y;
        //console.log(startX, startY);
        if (useNoise) {
          startX += noise(cube.g.x, cube.g.y)
          startY += noise(cube.g.x, cube.g.y)
        }
        //console.log(startX, startY);
        translate(startX, startY);

        if(useRotation) {
          angleMode(DEGREES);
          rotate(random([30, 0, -30]));
        }
        if (useScale) {
          scale(random(0.125, 4));
        }
        let transCube = new Isometric(
          0,
          blockSideHeight * 2,
          blockSideWidth,
          blockSideHeight,
          1
        );
        noStroke();
        if (useStroke) {
          strokeWeight(.5);
          stroke(thisColor.h, thisColor.s, thisColor.l * 0.25 ,opacity);
        }

        fill(thisColor.h, thisColor.s, thisColor.l * 0.1 ,opacity);
        transCube.buildBottomFace();
        fill(thisColor.h, thisColor.s, thisColor.l * 0.9 ,opacity);
        transCube.buildTopFace();
        fill(thisColor.h, thisColor.s, thisColor.l * 0.75 ,opacity);
        transCube.buildLeftFace();
        fill(thisColor.h, thisColor.s, thisColor.l * 0.45 ,opacity);
        transCube.buildRightFace();
        pop();
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


  buildBottomFace = function()
  {
    beginShape();
    vertex(this.a.x, this.a.y);
    vertex(this.b.x, this.b.y);
    vertex(this.g.x, this.g.y);
    vertex(this.f.x, this.f.y);
    vertex(this.a.x, this.a.y);
    endShape();
  }

  build = function (h = 0, s = 0, l = 50, o = 100) {

    noStroke();
    // bottom face
    fill(h, s, l * .1, o);
    this.buildBottomFace();

    // left face
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
