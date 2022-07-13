// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const PROJECT_WIDTH = 3000;
const PROJECT_HEIGHT = 3000;
const DO_MARGIN = true;
const MARGIN = PROJECT_WIDTH * .03;
const HELPER = new Helpers();
const COLORS = new Colors();
const TRANSFORM = new Transform();
const BW_OR_MONO = fxrand();


const CONFIG = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    rainbow: BW_OR_MONO > .15 && BW_OR_MONO < .155 ? true : false,

    /** is this monochrome? **/
    monochrome: BW_OR_MONO < .15 ? true : false,

    /** is this monochrome? **/
    coloring_book: BW_OR_MONO > .95 ? true : false,

    density: fxrand(),
};

window.$fxhashFeatures = {
    ...CONFIG,
};

const pos = {
    /** width */
    w: null,
    /** height */
    h: null,
    /** canvas width */
    cW: null,
    /** canvas height */
    cH: null,
};
let columns = 0;
let rows = 0;
let cellWidth = 0;
let cellHeight = 0;

function setupColumnsAndRows() {
  let d = map(CONFIG.density, 0, 1, 100, 300)
  columns = Math.floor(PROJECT_WIDTH/d);
  rows = Math.floor(PROJECT_WIDTH/d);
  cellWidth = PROJECT_WIDTH / columns;
  cellHeight = PROJECT_HEIGHT / rows;
}

function setupPosition() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) {
      pos.cW = h;
      pos.cH = h;
  } else {
    pos.cW = w;
    pos.cH = w;
  }

  pos.w = PROJECT_WIDTH;
  pos.h = PROJECT_HEIGHT;
}

let colors = [];
let saveId = HELPER.makeid(10);
let saveCount = 0;
let squiggles = [];
let palletData;
let pallets;
let hexColors;
let cells;
let cg;
let blurAmount;
const pallet = {
    // pallet index
    i: null,
    // pallet hex colors
    h: [],
    // pallet rgb colors
    rgb: [],
    // pallet hsl colors
    hsl: [],
}

function setupPallet() {
  // setup colors
  let pallets = palletData.pallets;

  if(CONFIG.coloring_book) {
    pallet.i = 0;
    pallet.h = ['000000', 'ffffff'];
    setupPalletRGAndHSL();
    return;
  }

  if (CONFIG.rainbow) {
      pallet.i = 0;
      pallet.h = ['ff0000', 'ffa500', 'ffff00', '008000', '0000ff', '4b0082', 'ee82ee'];
    setupPalletRGAndHSL();
    return;
  }

  pallet.i = floor(map(fxrand(), 0, 1, 0, pallets.length - 1));
  pallet.h = pallets[pallet.i];
  setupPalletRGAndHSL();

  if(CONFIG.monochrome) {
    let randColor = floor(map(fxrand(), 0, 1, 0, pallet.h.length));
    let randHSL = {h: pallet.hsl[randColor].h, s: pallet.hsl[randColor].s, l: pallet.hsl[randColor].l}

    pallet.h = [
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 15),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 35),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 55),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 75),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 95),
    ];
    setupPalletRGAndHSL();
  }

  return;

}

function setupPalletRGAndHSL(){
  pallet.rgb = [];
  pallet.hsl = [];
  for (var i = 0; i < pallet.h.length; i++) {
      let h = pallet.h[i];
      pallet.rgb.push(COLORS.HEXtoRGB(h));
      let rgb = pallet.rgb[pallet.rgb.length - 1];
      pallet.hsl.push(COLORS.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

window.preload = () => {

  palletData = loadJSON("./data/palettes.json");

  let sets = [];
  sets[20] = 46;
  sets[21] = 14;

let list = [];
for (var i = 20; i <= 21; i++) {
  for (var a = 1; a <= sets[i]; a++) {
    list.push(`./images/squiggles/set-${i}/${a}-fs8.png`)
  }
}

let imagesMax = list.length;
let imageIndexes = HELPER.shuffleArray(range(1, imagesMax)).slice(0, 10);

for (let i = 0; i < imageIndexes.length; i++) {
  if (list[imageIndexes[i]] !== undefined) {
    squiggles.push(loadImage(list[imageIndexes[i]]));
  }
}



}

window.setup = () => {
  setupPosition();
  setupColumnsAndRows();
  pallets = palletData.pallets
  setupPallet();
  createCanvas(pos.cW, pos.cH);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
  noiseSeed(CONFIG.noiseSeed);
  cg = createGraphics(pos.w, pos.h);
  cg.colorMode(HSL, 359, 100, 100, 100);
  TRANSFORM.cg = cg;
}

window.windowResized = () => {}

window.draw = () => {
  //console.log(CONFIG);
  noLoop();

  cg.background(0, 0, 100, 100);

  if (!CONFIG.coloring_book) {
    // give the canvas a muted background
    let bgColor = HELPER.shuffleArray(pallet.hsl)[0];
    //console.log(bgColor);
    cg.fill(bgColor.h, bgColor.s, bgColor.l, 25);
    cg.rect(0,0,cg.width, cg.height);
  }

  cg.stroke(0, 0, 0, 100);
  cg.noFill();

  cells = (new Cells(columns, rows, cellWidth, cellHeight)).populateCells(false)[0];
  //cg.push();
  // let rotatebg = HELPER.rollADie(4);
  // switch (rotatebg) {
  //   case 1:
  //     cg.rotate(radians(90));
  //     cg.translate(0, -cg.height)
  //     break;
  //   case 2:
  //     cg.rotate(radians(180));
  //     cg.translate(-cg.width, -cg.height)
  //     break;
  //   case 3:
  //     cg.rotate(radians(270));
  //     cg.translate(-cg.width, 0)
  //     break;
  //   default:
  //
  // }
  // let stColor = HELPER.shuffleArray(pallet.hsl)[0];
  // cg.fill(stColor.h, stColor.s, stColor.l, 100);
  // cg.noStroke();
  //
  // for (var i = 0; i < cells.length; i++) {
  //   let c = cells[i];
  //   let shapeSize = cellWidth/map(fxrand(), 0, 1, 1, 5);
  //   //cg.strokeWeight(lineWidth)
  //   cg.push();
  //   cg.translate(c.cX, c.cY);
  //   cg.rotate(radians(45));
  //   if(HELPER.flipACoin()) {
  //       cg.ellipse(0, 0, shapeSize)
  //   } else {
  //       cg.rectMode(CENTER);
  //       cg.rect(0, 0, shapeSize, shapeSize);
  //       cg.rectMode(CORNER)
  //
  //   }
  //   cg.pop();
  // }
  //cg.pop();
  let randCells;
  randCells = HELPER.shuffleArray(cells);
  console.log(randCells.length);
  for (var i = 0; i < randCells.length; i++) {

    let c = randCells[i];
    if(i % 2 === 0) {
      //doSquiggle(c.cX, c.cY);
    }
    if(i % 10 === 0) {
      doBand();
    }
}


let dots = [];
for (var y = 0; y < cg.height; y++) {
  for (var x = 0; x < cg.width; x++) {
    if(HELPER.rollADie(10) === 10) {
      dots.push({x: x, y: y});
    }
  }
}


cg.noStroke();

for (var i = 0; i < dots.length; i++) {
  if(HELPER.flipACoin()) {
    cg.fill(0, 0, 100, 50);
  } else {
    cg.fill(0, 0, 0, 50);
  }
  cg.ellipse(dots[i].x, dots[i].y, 1, 1);
}


  // create margin
  if(DO_MARGIN) {
    doMargin();
  }
  cg.filter(BLUR, 1);
  image(cg, 0, 0, pos.cW, pos.cH);
}

function doBand() {
  let imgId = floor(map(fxrand(), 0, 1, 0, squiggles.length));
  let thisImage = squiggles[imgId];
  let thisColor = HELPER.shuffleArray(pallet.hsl)[0];
  let coodA = createVector(0,0);
  let coodB = createVector(0,0);
  let coordInc = map(CONFIG.density, 0, 1, 0.0125, 0.05)
  if(HELPER.flipACoin()) {
    // horizontal
    coodA.x = 0;
    coodA.y = map(fxrand(), 0, 1, 0, PROJECT_HEIGHT)
    coodB.x = PROJECT_WIDTH;
    coodB.y = map(fxrand(), 0, 1, 0, PROJECT_HEIGHT)
  } else {
    // vertical
    coodA.y = 0;
    coodA.x = map(fxrand(), 0, 1, 0, PROJECT_WIDTH)
    coodA.y = PROJECT_HEIGHT;
    coodB.x = map(fxrand(), 0, 1, 0, PROJECT_WIDTH)
  }
  cg.fill(0,0,0,100);
  cg.noStroke();
  let flip = HELPER.rollADie(6);
  for (var i = 0; i <= 1; i+=coordInc) {
    let coodC = p5.Vector.lerp(coodA, coodB, i);

    cg.push();
    cg.translate(coodC.x - (thisImage.width / 2), coodC.y - (thisImage.height / 2));
    cg.rotate(radians(map(i, 0, 1, -90, 90)));
    cg.scale(map(i, 0, 1, 0.25, 2.25));
    if (!CONFIG.coloring_book) {
      cg.tint(
        thisColor.h,
        thisColor.s,
        thisColor.l,
        100
      );
    }
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
        cg.image(thisImage, coodC.x, coodC.y);
        break;
    };
    //cg.ellipse(0, 0, 100);
    cg.pop();
  }
}

function doMargin() {

  cg.fill(0, 0, 100, 100);
  cg.noStroke();
  cg.beginShape();
  cg.vertex(0, 0);
  cg.vertex(cg.width, 0);
  cg.vertex(cg.width, cg.height);
  cg.vertex(0, cg.height);
  cg.beginContour();
  cg.vertex(MARGIN, MARGIN);
  cg.vertex(MARGIN, cg.height - MARGIN);
  cg.vertex(cg.width - MARGIN, cg.height - MARGIN);
  cg.vertex(cg.width - MARGIN, MARGIN);
  cg.endContour();
  cg.endShape(CLOSE);

  cg.stroke(0, 0, 0, 100);
  cg.strokeWeight(MARGIN/2);
  cg.noFill();
  cg.rect(MARGIN, MARGIN, cg.width - MARGIN * 2, cg.height - MARGIN * 2);
}

function doSquiggle(x, y) {
  let thisColor = HELPER.shuffleArray(pallet.hsl)[0];
  let flip = HELPER.rollADie(6);
  let imgId = floor(map(noise(x, y), 0, 1, 0, squiggles.length));
  let thisImage = squiggles[imgId];

  cg.push();
  cg.translate(x - (thisImage.width / 2), y - (thisImage.height / 2));

  let thisScale = map(noise(x, y), 0, 1, 0.1, 1.75);
  cg.scale(thisScale);

  cg.rotate(radians(map(noise(x, y), 0, 1, -90, 90)));

  if (!CONFIG.coloring_book) {
    cg.tint(
      thisColor.h,
      thisColor.s,
      thisColor.l,
      100
    );
  }
  switch (flip) {
    case (1):
      TRANSFORM.imgRotatePi(thisImage, x, y);
      break;
    case (2):
      TRANSFORM.imgRotateHalfPi(thisImage, x, y);
      break;
    case (3):
      TRANSFORM.imgRotateHalfPiCc(thisImage, x, y);
      break;
    case (4):
      TRANSFORM.imageFlipV(thisImage, x, y);
      break;
    case (5):
      TRANSFORM.imageFlipH(thisImage, x, y);
      break;
    default:
      tint(0, 0, 100, 100);
      cg.image(thisImage, x, y);
      break;
  };


  cg.pop();

}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {

  if (key === 's') {
    save(saveFileName());
  }
}
