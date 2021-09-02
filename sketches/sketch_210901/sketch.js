// 8x10"
let canvasWidth = 2400;
let canvasHeight = 3000;
let cols = 12;
let rows = 15;
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
  // https://coolors.co/e63946-f1faee-a8dadc-457b9d-1d3557
  ["e63946","f1faee","a8dadc","457b9d","1d3557"],
  // https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
  ["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"],
  //https://coolors.co/ffa69e-faf3dd-b8f2e6-aed9e0-5e6472
  ["ffa69e","faf3dd","b8f2e6","aed9e0","5e6472"],
  // https://coolors.co/3772ff-f038ff-ef709d-e2ef70-70e4ef
  ["3772ff","f038ff","ef709d","e2ef70","70e4ef"],
  // https://coolors.co/050505-1b9aaa-dddbcb-f5f1e3-ffffff-6d5a72
  ["050505","1b9aaa","dddbcb","f5f1e3","ffffff","6d5a72"],
  // https://coolors.co/2b2d42-8d99ae-edf2f4-ef233c-d90429
  ["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
  // https://coolors.co/1c3144-d00000-ffba08-a2aebb-3f88c5
  ["1c3144","d00000","ffba08","a2aebb","3f88c5"]



];
let hexColors;
let colorA;
let colorB;
let colorC;
let colorD;

let cells;

let border;

function preload() {

  // for (let i = 1; i <= 49; i++) {
  //   squiggles.push(loadImage(`../images/squiggles/set-0/${i}.png`));
  // }
  //
  // for (let i = 1; i <= 26; i++) {
  //   squiggles.push(loadImage(`../images/squiggles/set-1/${i}.png`));
  // }
  //
  // for (let i = 1; i <= 12; i++) {
  //   squiggles.push(loadImage(`../images/squiggles/set-2/${i}.png`));
  // }
  //
  // for (let i = 1; i <= 48; i++) {
  //   squiggles.push(loadImage(`../images/squiggles/set-3/${i}.png`));
  // }

  // for (let i = 1; i <= 26; i++) {
  //   squiggles.push(loadImage(`../images/squiggles/set-4/${i}.png`));
  // }
  //
  // for (let i = 1; i <= 60; i++) {
  //   squiggles.push(loadImage(`../images/squiggles/set-5/${i}.png`));
  // }

  for (let i = 1; i <= 43; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-6/${i}.png`));
  }

  for (let i = 1; i <= 67; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-7/${i}.png`));
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

    if (c === floor(randomizedCells.length * (3/8))) {
      let slashColor = helpers.shuffleArray(colors)[0];
      fill(slashColor.h, slashColor.s, slashColor.l, 100);
      stroke(0,0,0,100);
      strokeWeight(20);
      ellipse(width / 2, height / 2, width - cW * 4);
    }
    noFill();
    noStroke();

    doSquiggle(randomizedCells[c].x, randomizedCells[c].y);

  }
  // create margin
  doMargin();



}

function doMargin() {
  // margin
  thisCW = cW * (5/8);
  thisCH = cH * (5/8);
  rectMode(CORNER);
  fill(0, 0, 100, 100);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  beginContour();
  vertex(thisCW, thisCH);
  vertex(thisCW, height - thisCH);
  vertex(width - thisCW, height - thisCH);
  vertex(width - thisCW, thisCH);
  endContour();
  endShape(CLOSE);

  stroke(0, 0, 0, 100);
  strokeWeight(thisCW * (1/8));
  noFill();
  rect(thisCW, thisCH, width - thisCW * 2, height - thisCH * 2);

  // thin border
  strokeWeight(thisCW * (1/16));
  stroke(colors[4].h, colors[4].s, colors[4].l, 100);
  rect(thisCW * (3/4), thisCH * (3/4), width - (thisCW * (3/4) * 2), height - (thisCH * (3/4) * 2));

  // corners
  strokeWeight(thisCW * (1/8));
  let cornerOffset = (55/64);
  rectMode(CENTER);

  // top left
  fill(0, 0, 100, 100);
  stroke(0, 0, 0, 100);
  rect(thisCW * cornerOffset, thisCH * cornerOffset, thisCW, thisCH);
  fill(colors[0].h, colors[0].s, colors[0].l, 100);
  noStroke();
  ellipse(thisCW * cornerOffset, thisCH * cornerOffset, thisCW / 2);

  // top right
  fill(0, 0, 100, 100);
  stroke(0, 0, 0, 100);
  rect(width - thisCW * cornerOffset, thisCH * cornerOffset, thisCW, thisCH);
  fill(colors[1].h, colors[1].s, colors[1].l, 100);
  noStroke()
  ellipse(width - thisCW * cornerOffset, thisCH * cornerOffset, thisCW / 2);

  // bottom right
  fill(0, 0, 100, 100);
  stroke(0, 0, 0, 100);
  rect(width - thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW, thisCH);
  fill(colors[2].h, colors[2].s, colors[2].l, 100);
  noStroke();
  ellipse(width - thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW / 2);

  // bottom left
  fill(0, 0, 100, 100);
  stroke(0, 0, 0, 100);
  rect(thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW, thisCH);
  fill(colors[3].h, colors[3].s, colors[3].l, 100);
  noStroke();
  ellipse(thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW / 2);
}

function doSquiggle(x, y) {

  let thisColors = helpers.shuffleArray(colors);
  let colorA = thisColors[0];
  let colorB = thisColors[1];
  let flip = helpers.rollADie(6);
  //let flip = 100000;
  let thisImage = squiggles[Math.floor(_.random(squiggles.length - 1))];
  thisImage.filter(GRAY);

  push();
  imageMode(CENTER);
  translate(x,y);
  let thisScale = random(0.2, 1);
  scale(thisScale);

  let thisRotation = radians(random(-45, 45));
  rotate(thisRotation);

  if (helpers.rollADie(50) === 50) {
    thisImage.filter(INVERT);
  }

  switch (flip) {
    case (1):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imgRotatePi(thisImage, x, y);
      break;
    case (2):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imgRotateHalfPi(thisImage, x, y);
      break;
    case (3):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imgRotateHalfPiCc(thisImage, x, y);
      break;
    case (4):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imageFlipV(thisImage, x, y);
      break;
    case (5):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imageFlipH(thisImage, x, y);
      break;
    default:
      tint(0 , 0, 100, 100);
      image(thisImage, 0, 0);


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
    for (var i = 0; i < 10; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
