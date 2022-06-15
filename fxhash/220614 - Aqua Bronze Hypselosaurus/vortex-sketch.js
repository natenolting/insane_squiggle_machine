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
  monochrome: BW_OR_MONO < .05 ? true : false,

  /** is this monochrome? **/
  coloring_book: BW_OR_MONO > .99 ? true : false,

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
let loopLength = 1;
let loops = 0;
let lastColorIndex = 0;
let lastImageIndex = 0;
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

  let imagesMax = 120;
  let imageIndexes = HELPER.shuffleArray(range(1, imagesMax)).slice(0, Math.ceil(imagesMax / 2));
  // console.log(imageIndexes);

  for (let i = 0; i < imageIndexes.length; i++) {
    squiggles.push(loadImage(`./images/squiggles/set-18/${imageIndexes[i]}.png`));
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
  console.log(CONFIG);
  cg.background(0, 0, 100, 100);

  if (!CONFIG.coloring_book) {
    // give the canvas a muted background
    let bgColor = HELPER.shuffleArray(pallet.hsl)[lastColorIndex];
    cg.fill(bgColor.h, bgColor.s, bgColor.l, 10);
    cg.rect(0,0,cg.width, cg.height);
  }

  loopLength = floor(map(CONFIG.density, 0, 1, 12, 24));

  cg.stroke(0, 0, 0, 100);
  cg.noFill();
  image(cg, 0, 0, pos.cW, pos.cH);
  cg.clear();

}

window.windowResized = () => {}

window.draw = () => {

  doSquiggle(cg.width/2, cg.height/2);

  cg.filter(BLUR, 1);

  // create margin
    if(DO_MARGIN) {
      doMargin();
    }

  image(cg, 0, 0, pos.cW, pos.cH);

  cg.clear();
  loops++;
  console.log(loopLength, loops);
  if(loops === loopLength) {

    noLoop();
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

function getRandPalletIndex(rand = null) {
  if (!rand) {
    rand = fxrand();
  }
  return floor(map(rand, 0, 1, 0, pallet.hsl.length));
}

function getRandImageIndex(rand = null) {
  if (!rand) {
    rand = fxrand();
  }

  return  floor(map(rand, 0, 1, 0, squiggles.length));
}

function doSquiggle(x, y) {
  let startRadian, endRadian, offsetRadian;
  let thisColorIndex = getRandPalletIndex();
  if(lastColorIndex === thisColorIndex) {
      while(lastColorIndex === thisColorIndex) {
        //console.log('found same as last color index');
        thisColorIndex = getRandPalletIndex();
      }
  }
  lastColorIndex = thisColorIndex
  let thisColor = pallet.hsl[thisColorIndex];

  let thisImageIndex = getRandImageIndex(noise(x, y));

  if(lastImageIndex === thisImageIndex) {
    while(lastImageIndex === thisImageIndex) {
      //console.log('found same as last image index');
      thisImageIndex = getRandImageIndex();
    }
  }
  lastImageIndex = thisImageIndex;
  let thisImage = squiggles[thisImageIndex];

  cg.push();
  cg.translate(x, y);

  let thisScale = map(fxrand(), 0, 1, 0.125, 1);
  cg.scale(thisScale);

  cg.rotate(radians(map(fxrand(), 0, 1, -90, 90)));
  if (!CONFIG.coloring_book) {
    cg.tint(thisColor.h, thisColor.s, thisColor.l, 100);
  }


  startRadian = map(fxrand(), 0, 1, -90, -70)
  endRadian = map(fxrand(), 0, 1, 70, 90)

  offsetRadian = floor(map(CONFIG.density, 0, 1, .5, 30));
  offsetCenter = map(fxrand(), 0, 1, 0, cg.width / 2);
  for (var i = startRadian; i <= endRadian; i+=offsetRadian) {
    cg.translate(-offsetCenter, -offsetCenter);
    cg.rotate(radians(i));
    cg.translate(offsetCenter, offsetCenter);
    cg.image(thisImage, 0, 0);
  }

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
