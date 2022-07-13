// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 3000;
const COLUMNS = 40;
const ROWS = 50
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
let palletData = {pallets: [["2b2d42","8d99ae","edf2f4","ef233c","d90429"]]};
let pallets;
let hexColors;
let cells;


function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

window.preload = () => {

    //palletData = loadJSON("../../data/palettes-new.json");

let sets = [];
sets[0] = 49;
sets[1] = 26;
sets[2] = 12;
sets[3] = 48;
sets[4] = 26;
sets[5] = 60;
sets[6] = 43;
sets[7] = 69;
sets[8] = 33;
sets[9] = 22;
sets[10] = 23;
sets[11] = 60;
sets[12] = 34;
sets[13] = 12;
sets[14] = 43;
sets[15] = 132;
sets[16] = 68;
sets[17] = 225;
sets[18] = 120;
sets[19] = 223;
sets[20] = 46;
sets[21] = 14;

let list = [];
for (var i = 0; i <= 21; i++) {
  for (var a = 1; a <= sets[i]; a++) {
    list.push(`../images/squiggles/set-${i}/${a}.png`)
  }
}

let imagesMax = list.length;
let imageIndexes = HELPER.shuffleArray(range(1, imagesMax)).slice(0, 250);

for (let i = 0; i < imageIndexes.length; i++) {
  if (list[imageIndexes[i]] !== undefined) {
    squiggles.push(loadImage(list[imageIndexes[i]]));
  }
}

}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);

  pallets = palletData.pallets

  let heights = [];
  let widths = [];
  for (let i = 0; i < squiggles.length; i++) {
    heights.push(squiggles[i].height);
    widths.push(squiggles[i].width);
  }

  console.log(`Images average width: ${HELPER.mean(widths)}`);
  console.log(`Images average height: ${HELPER.mean(heights)}`);

}

function draw() {
  background(0, 0, 0, 100);
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
  for (var i = 0; i < cells.length; i+=5) {

    if(i % 150 === 0) {
      doBand();
    }

    let c = cells[i];
    doSquiggle(c.cX, c.cY);

}

  // create margin
  if(DO_MARGIN) {
    doMargin();
  }
}

function doBand() {
  let imgId = floor(map(random(), 0, 1, 0, squiggles.length));
  let thisImage = squiggles[imgId];
  let thisColor = HELPER.shuffleArray(colors)[0];
  let coodA = createVector(0,0);
  let coodB = createVector(0,0);
  let coordInc = map(random(), 0, 1, 0.015, 0.055)
  if(HELPER.flipACoin()) {
    // horizontal
    coodA.x = 0;
    coodA.y = map(random(), 0, 1, 0, CANVAS_HEIGHT)
    coodB.x = CANVAS_WIDTH;
    coodB.y = map(random(), 0, 1, 0, CANVAS_HEIGHT)
  } else {
    // vertical
    coodA.y = 0;
    coodA.x = map(random(), 0, 1, 0, CANVAS_WIDTH)
    coodA.y = CANVAS_HEIGHT;
    coodB.x = map(random(), 0, 1, 0, CANVAS_WIDTH)
  }
  fill(0,0,0,100);
  noStroke();
  let flip = HELPER.rollADie(6);
  for (var i = 0; i <= 1; i+=coordInc) {
    let coodC = p5.Vector.lerp(coodA, coodB, i);

    push();
    translate(coodC.x - (thisImage.width / 2), coodC.y - (thisImage.height / 2));
    let rotateBase = map(random(), 0, 1, 45, 90);
    rotate(radians(map(i, 0, 1, -rotateBase, rotateBase)));
    scale(map(i, 0, 1, 0.1, 1));
    tint(
      thisColor.h,
      thisColor.s,
      thisColor.l,
      100
    );
    switch (flip) {
      case (1):
        TRANSFORM.imgRotatePi(thisImage, coodC.x, coodC.y);
        break;
      case (2):
        TRANSFORM.imgRotateHalfPi(thisImage, coodC.x, coodC.y);
        break;
      case (3):
        TRANSFORM.imgRotateHalfPiCc(thisImage, coodC.x, coodC.y);
        break;
      case (4):
        TRANSFORM.imageFlipV(thisImage, coodC.x, coodC.y);
        break;
      case (5):
        TRANSFORM.imageFlipH(thisImage, coodC.x, coodC.y);
        break;
      default:
        tint(0, 0, 100, 100);
        image(thisImage, coodC.x, coodC.y);
        break;
    };
    pop();
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
  let thisScale = noise(x, y);
  scale(thisScale);

  rotate(radians(map(noise(x, y), 0, 1, -45, 45)));

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
