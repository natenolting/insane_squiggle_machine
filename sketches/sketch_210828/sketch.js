// 8x10"
let canvasWidth = 2400;
let canvasHeight = 3000;
let cols = 10;
let rows = 10;
let cW = canvasWidth / cols;
let cH = canvasHeight / rows;
let helpers = new Helpers();
let colorClass = new Colors();
let transform = new Transform();
let colors = [];
let saveId = helpers.makeid(10);
let saveCount = 0;
let squiggles = [];
let pallets = [
  // https://coolors.co/c8ffbe-edffab-ba9593-89608e-623b5a
  ["c8ffbe","edffab","ba9593","89608e","623b5a"],
  // https://coolors.co/e63946-f1faee-a8dadc-457b9d-1d3557
  ["e63946","f1faee","a8dadc","457b9d","1d3557"],
  // https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
  ["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"],
  // https://coolors.co/e9f5db-cfe1b9-b5c99a-97a97c-87986a-718355
  ["e9f5db","cfe1b9","b5c99a","97a97c","87986a","718355"],
  // https://coolors.co/d4e09b-f6f4d2-cbdfbd-f19c79-a44a3f
  ["d4e09b","f6f4d2","cbdfbd","f19c79","a44a3f"],
  //https://coolors.co/ffa69e-faf3dd-b8f2e6-aed9e0-5e6472
  ["ffa69e","faf3dd","b8f2e6","aed9e0","5e6472"],
  // https://coolors.co/3772ff-f038ff-ef709d-e2ef70-70e4ef
  ["3772ff","f038ff","ef709d","e2ef70","70e4ef"],

];
let hexColors;
let colorA;
let colorB;
let colorC;
let colorD;

let cells;

let border;

function preload() {

  border = loadImage('border.svg');

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

}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);

}

function draw() {
  background(0, 0, 100, 100);
  noLoop();
  stroke(0, 0, 0, 100);
  noFill();

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colors = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  cells = (new Cells(cols, rows, cW, cH)).populateCells();

  let randomizedCells = helpers.shuffleArray(cells[0]);
  for (var c = 0; c < randomizedCells.length; c++) {
    // rect(cells[0][c].x, cells[0][c].y, cells[0][c].w, cells[0][c].h);
    doSquiggle(randomizedCells[c].x, randomizedCells[c].y);
  }

  // create margin
  doMargin();
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
  vertex(cW, cH);
  vertex(cW, height - cH);
  vertex(width - cW, height - cH);
  vertex(width - cW, cH);
  endContour();
  endShape(CLOSE);

  stroke(0, 0, 0, 100);
  strokeWeight(20);
  noFill();
  rect(cW, cH, width - cW * 2, height - cH * 2);
}

function doSquiggle(x, y) {

  let thisColor = helpers.shuffleArray(colors)[0];
  let flip = helpers.rollADie(6);
  let thisImage = squiggles[Math.floor(_.random(squiggles.length - 1))];

  push();
  scale(random(0.2, 1));
  rotate(radians(random(-35, 35)));
  tint(thisColor.h, thisColor.s, thisColor.l, 100);
  switch (flip) {
    case (1):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      transform.imgRotatePi(thisImage, x, y);
      break;
    case (2):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      transform.imgRotateHalfPi(thisImage, x, y);
      break;
    case (3):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      transform.imgRotateHalfPiCc(thisImage, x, y);
      break;
    case (4):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      transform.imageFlipV(thisImage, x, y);
      break;
    case (5):
      tint(thisColor.h, thisColor.s, thisColor.l, 100);
      transform.imageFlipH(thisImage, x, y);
      break;
    default:
      tint(0 , 0, 100, 100);
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
