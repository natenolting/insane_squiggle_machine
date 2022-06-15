// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const PROJECT_WIDTH = 3000;
const PROJECT_HEIGHT = 3000;
const COLUMNS = 25;
const ROWS = 25;
const DO_MARGIN = false;
const MARGIN = PROJECT_WIDTH * .04;
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
let lastImageIndex = null;
let lastColorIndex = null;
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
  let imageIndexes = HELPER.shuffleArray(range(1, imagesMax)).slice(0, Math.ceil(imagesMax / 3));

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
  cg = createGraphics(pos.w - (DO_MARGIN ? MARGIN * 2 : 0), pos.h - (DO_MARGIN ? MARGIN * 2 : 0));
  if (DO_MARGIN) {
    cg.translate(MARGIN, MARGIN);
  }
  cg.colorMode(HSL, 359, 100, 100, 100);
  TRANSFORM.cg = cg;
}

window.windowResized = () => {}

window.draw = () => {
  noLoop();

  cg.background(0, 0, 100, 100);
  let randColors = HELPER.shuffleArray(pallet.hsl);
  let bgColor1 = color(randColors[0].h, randColors[0].s, randColors[0].l, 30);
  let bgColor2 = color(randColors[1].h, randColors[1].s, randColors[1].l, 30);


  if (!CONFIG.coloring_book) {
    // give the canvas a muted background
    for (var i = 1; i <= cg.height; i++) {
      let lerpAmount = i/cg.height;
      let bgColor3 = lerpColor(bgColor1, bgColor2, lerpAmount);
      cg.stroke(bgColor3);
      cg.strokeWeight(1);
      cg.noFill()
      cg.line(0, i, cg.width, i);
      cg.noStroke();

    }
  }

  let moundRowsDensity = floor(map(CONFIG.density, 0, 1, 250, 1000));

  for (var i = 0; i < moundRowsDensity; i++) {
    let x = map(fxrand(), 0, 1, 0, cg.width)
    let y = map(i, 0, moundRowsDensity, 0, cg.height)
    doMound(
      map(fxrand(), 0, 1, 0, cg.width),
      map(i, 0, moundRowsDensity, 0, cg.height),
      map(i, 0, moundRowsDensity, .125, map(noise(x, y), 0, 1, .125, .875))
    );
  }

  cg.filter(BLUR, 1);

  image(cg, 0, 0, pos.cW, pos.cH);
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

function doMound(x, y, s = 1) {

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

  let newCg = createGraphics(thisImage.width * s + 100, thisImage.height * s + 100);
  newCg.translate(50, 50);
  let newTransform = new Transform();
  let flip = HELPER.rollADie(3);
  let rotation = map(fxrand(), 0, 1, -5, 5);
  newTransform.cg = newCg;
  newCg.scale(s);
  newCg.rotate(radians(rotation));
  switch (flip) {
    case 1:
        newTransform.imageFlipH(thisImage, 0, 0);
      break;
    case 2:
      newCg.rotate(radians(180));
      newCg.translate(-thisImage.width, -thisImage.height);
      newCg.image(thisImage, 0, 0);
      break;
    default:
      newCg.image(thisImage, 0, 0);
      break;

  }

  // if outside the margin then return
  if (x < MARGIN || x + newCg.width > cg.width - MARGIN || y - newCg.height < MARGIN || y > cg.height - MARGIN) {
    return;
  }
  if (!CONFIG.coloring_book) {
    let shadowScale = 1.05
    let shadowCg = createGraphics(newCg.width * shadowScale, newCg.height * shadowScale);
    shadowCg.translate(50 * shadowScale, 50 * shadowScale);
    let shadowTransform = new Transform();
    shadowTransform.cg = shadowCg;
    shadowCg.scale(s * shadowScale);
    shadowCg.rotate(radians(rotation));
    shadowCg.tint(0, 0, 0, 50);

    switch (flip) {
      case 1:
          shadowTransform.imageFlipH(thisImage, 0, 0);
        break;
      case 2:
        shadowCg.rotate(radians(180));
        shadowCg.translate(-thisImage.width, -thisImage.height);
        shadowCg.image(thisImage, 0, 0);
        break;
      default:
        shadowCg.image(thisImage, 0, 0);
        break;
      }

    cg.image(shadowCg, x - 50 * shadowScale, y - shadowCg.height - 50 * shadowScale);
  }

  cg.image(newCg, x - 50, y - newCg.height - 50);


  if (!CONFIG.coloring_book) {
    cg.tint(thisColor.h, thisColor.s, thisColor.l, 100);
  }

}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.jpg`;
  saveCount++;
  return fileName;
}

function keyPressed() {

  if (key === 's') {
    save(saveFileName());
  }
  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 25; i++) {
        clear();
        redraw();
        save(saveFileName());
    }

    return false;
  }
}
