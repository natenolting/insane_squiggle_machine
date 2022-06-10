// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const PROJECT_WIDTH = 3000;
const PROJECT_HEIGHT = 3000;
const COLUMNS = 25;
const ROWS = 25;
const DO_MARGIN = true;
const MARGIN = PROJECT_WIDTH * .03;
const CELL_WIDTH = PROJECT_WIDTH / COLUMNS;
const CELL_HEIGHT = PROJECT_HEIGHT / ROWS;
const HELPER = new Helpers();
const COLORS = new Colors();
const TRANSFORM = new Transform();
const BW_OR_MONO = fxrand();


const CONFIG = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    rainbow: BW_OR_MONO >.15 && BW_OR_MONO < .16 ? true : false,

    /** is this monochrome? **/
    monochrome: BW_OR_MONO < .15 ? true : false,

    /** is this monochrome? **/
    coloring_book: BW_OR_MONO > .85 ? true : false,

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

window.preload = () => {

  palletData = loadJSON("./data/palettes.json");

  for (let i = 1; i <= 56; i++) {
    squiggles.push(loadImage(`./images/squiggles/set-16/${i}-fs8.png`));
  }

}

window.setup = () => {
  setupPosition();
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
  console.log(CONFIG);
  noLoop();

  cg.background(0, 0, 100, 100);

  if (!CONFIG.coloring_book) {
    // give the canvas a muted background
    let bgColor = HELPER.shuffleArray(pallet.hsl)[0];
    cg.fill(bgColor.h, bgColor.s, bgColor.l, 10);
    cg.rect(0,0,cg.width, cg.height);
  }

  cg.stroke(0, 0, 0, 100);
  cg.noFill();

  cells = (new Cells(COLUMNS, ROWS, CELL_WIDTH, CELL_HEIGHT)).populateCells(false)[0];
  let randCells;
  randCells = HELPER.shuffleArray(cells);
  let loopLength = randCells.length * map(CONFIG.density, 0, 1, 0.5, 0.8);

  for (var i = 0; i < loopLength; i++) {
    let c = randCells[i];
    doSquiggle(c.cX, c.cY);

}

  // create margin
  if(DO_MARGIN) {
    doMargin();
  }
  cg.filter(BLUR, 1);
  //cg.filter(INVERT);
  image(cg, 0, 0, pos.cW, pos.cH);
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
  //thisImage.resize(originalSquiggleWidths[imgId] * thisScale, 0);

  cg.rotate(radians(map(noise(x, y), 0, 1, -45, 45)));

  if (!CONFIG.coloring_book) {
    cg.tint(thisColor.h, thisColor.s, thisColor.l, 100);
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
