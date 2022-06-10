// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const CANVAS_WIDTH = 3840 * 2;
const CANVAS_HEIGHT = 2160;
const COLUMNS = 70;
const ROWS = 20;
const DO_MARGIN = true;
const CELL_WIDTH = CANVAS_WIDTH / COLUMNS;
const CELL_HEIGHT = CANVAS_HEIGHT / ROWS;
const HELPER = new Helpers();
const COLORS = new Colors();
const TRANSFORM = new Transform();

let colors = [];
let saveId = HELPER.makeid(10);
let saveCount = 0;
let squiggles = [];
let palletData;
let pallets;
let hexColors;
let cells;


function preload() {

  palletData = loadJSON("../../data/palettes-new.json");

  for (let i = 1; i <= 132; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-15/${i}.png`));
  }
  for (let i = 1; i <= 49; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-0/${i}.png`));
  }

  for (let i = 1; i <= 26; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-1/${i}.png`));
  }

  for (let i = 1; i <= 12; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-2/${i}.png`));
  }

  for (let i = 1; i <= 48; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-3/${i}.png`));
  }

  for (let i = 1; i <= 26; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-4/${i}.png`));
  }

  for (let i = 1; i <= 60; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-5/${i}.png`));
  }

  for (let i = 1; i <= 43; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-6/${i}.png`));
  }

  for (let i = 1; i <= 67; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-7/${i}.png`));
  }

  for (let i = 1; i <= 33; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-8/${i}.png`));
  }

  for (let i = 1; i <= 22; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-9/${i}.png`));
  }

  for (let i = 1; i <= 23; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-10/${i}.png`));
  }

  for (let i = 1; i <= 12; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-13/${i}.png`));
  }

  for (let i = 1; i <= 43; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-14/${i}.png`));
  }

}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);

  pallets = palletData.pallets

}

function draw() {
  background(0, 0, 100, 100);
  noLoop();
  stroke(0, 0, 0, 100);
  noFill();

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colors = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = COLORS.HEXtoRGB(hexColors[i]);
    let hsl = COLORS.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  cells = (new Cells(COLUMNS, ROWS, CELL_WIDTH, CELL_HEIGHT)).populateCells(false)[0];
  let randCells;
  randCells = HELPER.shuffleArray(cells);
  for (var i = 0; i < randCells.length * .75; i++) {
    let c = randCells[i];
    // stroke(0,0,0,100);
    // strokeWeight(2);
    // rect(c.x, c.y, c.w, c.h);
    // noStroke();
    doSquiggle(c.cX, c.cY);

}

  // create margin
  if(DO_MARGIN) {
    doMargin();
  }
}

function doMargin() {

  fill(0, 0, 100, 100);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  beginContour();
  vertex(CELL_WIDTH, CELL_HEIGHT);
  vertex(CELL_WIDTH, height - CELL_HEIGHT);
  vertex(width - CELL_WIDTH, height - CELL_HEIGHT);
  vertex(width - CELL_WIDTH, CELL_HEIGHT);
  endContour();
  endShape(CLOSE);

  stroke(0, 0, 0, 100);
  strokeWeight(20);
  noFill();
  rect(CELL_WIDTH, CELL_HEIGHT, width - CELL_WIDTH * 2, height - CELL_HEIGHT * 2);
}

function doSquiggle(x, y) {
  let thisColor = HELPER.shuffleArray(colors)[0];

  let flip = HELPER.rollADie(6);
  let thisImage = squiggles[Math.floor(_.random(squiggles.length - 1))];
  push();
  translate(x - (thisImage.width / 2), y - (thisImage.height / 2));

  let thisScale = map(noise(x, y), 0, 1, 0.1, .95);
  scale(thisScale);

  rotate(radians(map(noise(x, y), 0, 1, -35, 35)));

  tint(thisColor.h, thisColor.s, thisColor.l, 100);
  switch (flip) {
    case (1):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      TRANSFORM.imgRotatePi(thisImage, x, y);
      break;
    case (2):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      TRANSFORM.imgRotateHalfPi(thisImage, x, y);
      break;
    case (3):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      TRANSFORM.imgRotateHalfPiCc(thisImage, x, y);
      break;
    case (4):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      TRANSFORM.imageFlipV(thisImage, x, y);
      break;
    case (5):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      TRANSFORM.imageFlipH(thisImage, x, y);
      break;
    default:
      tint(0, 0, 100, 100);
      image(thisImage, x, y);
      break;
  };



  pop();
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === 'Enter') {
    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }

  if (key === 'g') {
    // generate stack of images
    for (var i = 0; i < 25; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
