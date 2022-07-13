import "./p5.min.js";
import "./p5.collide2d.min.js";

const COLOR = new Colors();
const HELPER = new Helpers();
const DEBUG = false;
const ENLARGED_CANVAS_WIDTH = 2048;
const ENLARGED_CANVAS_HEIGHT = 2048;
const CANVAS_WIDTH_MULTIPLIER = 1
const CANVAS_HEIGHT_MULTIPLIER = 1
const USE_ISOMETRIC = true;
const SIDE_HEIGHT_MULTIPLIER = 28 / 49;
const BASE_CELLS_PER_SIDE = 30;
const TRANSPARENT = false;
const X_SMALL = 'tightest';
const SMALL = 'tight';
const MEDIUM = 'middle';
const LARGE = 'loose';
const X_LARGE = 'loosest';

const config = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    /** number of rows & columns */
    cells: getCellSizeString(fxrand()),

    /** noise scale  */
    noiseScale: 0.5 + fxrand() * 24,

    pallet: "",

};

const pallet = {
  pallet: [],
  black: null,
  white: null,
}


const pos = {};
let palletData;
let pallets;
//let settingsData;
let settings;
let saveCount = 0;
let saveId = HELPER.makeid(10);
let colorIndex = 0;
let colorSet = [];
let cG;
let squiggles = [];

function getCellSizeString(value) {
    if (value <= .2) {
        return X_SMALL
    }
    if (value <= .4) {
        return SMALL
    }
    if (value <= .6) {
        return MEDIUM
    }
    if (value <= .8) {
        return LARGE
    }
    if (value <= 1) {
        return X_LARGE
    }
}

function getCellsFromString(string) {
    let c;
    let base = BASE_CELLS_PER_SIDE;
    switch (string) {
        case X_LARGE:
            c = base
            break;
        case LARGE:
            c = base * 1.5
            break;
        case MEDIUM:
            c = base * 2
            break;
        case SMALL:
            c = base * 2.5
            break;
        case X_SMALL:
            c = base * 3
            break;
    }
    return c;
}



function setupPosition() {
    let cW = window.innerWidth;
    let cH = window.innerHeight;

    if (cW > cH) {
        pos.cW = cH;
        pos.cH = cH;
    } else {
        pos.cW = cW;
        pos.cH = cW;
    }

    let w = ENLARGED_CANVAS_WIDTH;
    let h = ENLARGED_CANVAS_HEIGHT;
    if (w > h) {
        pos.w = h;
        pos.h = h;
    } else {
        pos.w = w;
        pos.h = w;
    }
    pos.w = w * CANVAS_WIDTH_MULTIPLIER;
    pos.h = h * CANVAS_HEIGHT_MULTIPLIER;
    pos.t = 0;
    pos.l = 0;
}

function setupSettings() {
    let cfs = getCellsFromString(config.cells)
    // prep settings object
    //settings = settingsData.settings;
    settings = {};
    settings.canvasWidth = pos.w;
    settings.canvasHeight = pos.h;
    settings.cellWidth = pos.w / cfs;
    settings.cellHeight = pos.h / cfs;
    settings.cols = cfs;
    settings.rows = cfs;
    settings.margin = setupMargin();
    settings.cells = (new Cells(settings.cols, settings.rows, settings.cellWidth, settings.cellHeight)).populateCells(false)[0];
}


function setupMargin() {
    return floor(HELPER.mean([pos.w * .03, pos.h * .03]));
}

function incrementColorIndex() {
    colorIndex++
    if (colorIndex >= pallet.rgb.length - 1) {
        colorIndex = 0;
    }
}

function setupPallet() {

  pallet.black = color(0);
  pallet.white = color(255);
  pallet.blue = color(0, 0, 255);
  pallet.green = color(0, 255, 0);
  pallet.red = color(255, 0, 0);
  pallet.yellow = color(255, 255, 0);
  pallet.oranges = [];
  pallet.purples = [];
  pallet.grays = [];
  pallet.greens = [];
  pallet.blues = [];
  setupOranges();
  setupPurples();
  setupGrays();
  setupGreens();
  setupBlues();
  console.log(pallet);

}

function setupOranges() {
  let oCg = createGraphics(100,100);
  oCg.colorMode(RGB, 255, 255, 255, 1);
  oCg.blendMode(BLEND);
  for (var i = 0; i < 75; i++) {
    oCg.fill(255);
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.red), green(pallet.red), blue(pallet.red), 1);
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.yellow), green(pallet.yellow), blue(pallet.yellow), map(fxrand(), 0, 1, 0.125, .75));
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.green), green(pallet.green), blue(pallet.green), map(fxrand(), 0, 1, 0, 0.05));
    oCg.rect(0,0,100,100);
    if (HELPER.flipACoin()) {
        oCg.fill(255,255,255,map(fxrand(), 0, 1, 0, 0.125));
    } else {
        oCg.fill(0,0,0,map(fxrand(), 0, 1, 0, 0.05));
    }
    oCg.rect(0,0,100,100);
    let p = oCg.get(50,50);
    pallet.oranges.push(color(p[0], p[1], p[2]));
    oCg.clear();
  }
}

function setupPurples() {
  let oCg = createGraphics(100,100);
  oCg.colorMode(RGB, 255, 255, 255, 1);
  oCg.blendMode(BLEND);
  for (var i = 0; i < 75; i++) {
    oCg.fill(255);
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.blue), green(pallet.blue), blue(pallet.blue), 1);
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.red), green(pallet.red), blue(pallet.red), map(fxrand(), 0, 1, 0.25, .5));
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.yellow), green(pallet.yellow), blue(pallet.yellow), map(fxrand(), 0, 1, 0, 0.05));
    oCg.rect(0,0,100,100);
    if (HELPER.flipACoin()) {
        oCg.fill(255,255,255,map(fxrand(), 0, 1, 0, 0.25));
    } else {
        oCg.fill(0,0,0,map(fxrand(), 0, 1, 0, 0.25));
    }

    oCg.rect(0,0,100,100);
    let p = oCg.get(50,50);
    pallet.purples.push(color(p[0], p[1], p[2]));
    oCg.clear();
  }
}

function setupGrays() {
  let oCg = createGraphics(100,100);
  oCg.colorMode(RGB, 255, 255, 255, 1);
  oCg.blendMode(BLEND);
  for (var i = 0; i < 75; i++) {
    oCg.fill(floor(map(fxrand(), 0, 1, 0, 255)));
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.blue), green(pallet.blue), blue(pallet.blue), map(fxrand(), 0, 1, 0, 0.05));
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.green), green(pallet.green), blue(pallet.green), map(fxrand(), 0, 1, 0, 0.05));
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.red), green(pallet.red), blue(pallet.red), map(fxrand(), 0, 1, 0, 0.05));
    oCg.rect(0,0,100,100);

    let p = oCg.get(50,50);
    pallet.grays.push(color(p[0], p[1], p[2]));
    oCg.clear();
  }
}

function setupGreens() {
  let oCg = createGraphics(100,100);
  oCg.colorMode(RGB, 255, 255, 255, 1);
  oCg.blendMode(BLEND);
  for (var i = 0; i < 75; i++) {
    oCg.fill(pallet.green);
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.blue), green(pallet.blue), blue(pallet.blue), map(fxrand(), 0, 1, 0.125, 0.5));
    oCg.rect(0,0,100,100);
    oCg.fill(red(pallet.yellow), green(pallet.yellow), blue(pallet.yellow), map(fxrand(), 0, 1, 0.125, 0.25));
    oCg.rect(0,0,100,100);
    if (HELPER.flipACoin()) {
        oCg.fill(255,255,255,map(fxrand(), 0, 1, 0, 0.25));
    } else {
        oCg.fill(0,0,0,map(fxrand(), 0, 1, 0, 0.25));
    }
    oCg.rect(0,0,100,100);

    let p = oCg.get(50,50);
    pallet.greens.push(color(p[0], p[1], p[2]));
    oCg.clear();
  }
}

function setupBlues() {
  let oCg = createGraphics(100,100);
  oCg.colorMode(RGB, 255, 255, 255, 1);
  oCg.blendMode(BLEND);
  for (var i = 0; i < 75; i++) {
    oCg.fill(pallet.blue);
    oCg.rect(0,0,100,100);
    if (HELPER.flipACoin()) {
        oCg.fill(255,255,255,map(fxrand(), 0, 1, 0, 0.75));
    } else {
        oCg.fill(0,0,0,map(fxrand(), 0, 1, 0, 0.75));
    }
    oCg.rect(0,0,100,100);

    let p = oCg.get(50,50);
    pallet.blues.push(color(p[0], p[1], p[2]));
    oCg.clear();
  }
}

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.${TRANSPARENT ? 'png' : 'jpg'}`;
    saveCount++;
    return fileName;
}

function init() {
    noiseSeed(config.noiseSeed);
    setupPosition();
    setupSettings();
    setupPallet();

    frameRate(config.frameRate);

    // prep cells

    if (DEBUG) {
        console.log(config, settings, pallet, pos);
    }

}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

window.preload = () => {

}

window.$fxhashFeatures = {
    ...config,
};


window.setup = () => {
    init();
    pixelDensity(1);
    colorMode(RGB, 255, 255, 255, 1);
    createCanvas(pos.cW, pos.cH);
};

window.windowResized = () => {
    // clear();
    // init();
};

function generateSun(x, y, startSize=100) {
  let bandOffset = map(fxrand(), 0, 1, .25, .5);
  let numberOfBands = floor(map(fxrand(), 0, 1, 20, 30));
  let sun = createGraphics(cG.width, cG.height);
  sun.colorMode(RGB, 255, 255, 255, 1);
  sun.push();
  sun.translate(x, y);
  sun.noStroke();
  sun.fill(pallet.oranges[HELPER.rollADie(pallet.oranges.length) - 1]);
  let bgSize = HELPER.rollADie(numberOfBands + 1)
  sun.ellipse(0, 0, startSize + ((bgSize + bandOffset) * (startSize * bandOffset)), startSize + ((bgSize + bandOffset) * (startSize * bandOffset)));
  sun.noFill();
  sun.stroke(0);
  sun.strokeWeight(startSize * (bandOffset / 4));
  let offset = startSize + (startSize * bandOffset)


  for (var i = 0; i < numberOfBands; i++) {
    let ellipseW = offset + (i * (startSize * bandOffset));
    sun.stroke(pallet.oranges[HELPER.rollADie(pallet.oranges.length) - 1]);
    sun.rotate(map(fxrand(), 0, 1, 0, 360));
    sun.arc(0, 0, ellipseW, ellipseW, radians(map(fxrand(), 0, 1, 0, 135)), radians(map(fxrand(), 0, 1, 225, 360)));

}
  sun.pop();

  sun.loadPixels();
  let dots = [];
  for (var y = 0; y < sun.height; y++) {
    for (var x = 0; x < sun.width; x++) {
      let index = (x + y * sun.width) * 4;
      if(sun.pixels[index + 3] === 255 && HELPER.rollADie(3) === 3) {
        dots.push({x: x, y: y});
      }
    }
  }
  sun.updatePixels();
  sun.noStroke();
  sun.blendMode(OVERLAY);
  for (var i = 0; i < dots.length; i++) {
    if(HELPER.flipACoin()) {
      sun.fill(255, 255, 255, .75);
    } else {
      sun.fill(0, 0, 0, .75);
    }
    sun.ellipse(dots[i].x, dots[i].y, 1, 1);
  }
  sun.blendMode(BLEND);

  cG.image(sun, 0, 0, cG.width, cG.height);

}


window.draw = () => {
    noLoop();

    background(255, 255, 255, 1);
    fill(255, 255, 255, 1);
    noStroke();
    rect(0, 0, pos.cW, pos.cH)

    cG = createGraphics(pos.w, pos.h);
    cG.colorMode(RGB, 255, 255, 255, 1);
    cG.background(255, 255, 255, 1);
    cG.pixelDensity(1);
    cG.blendMode(BLEND);

    // for (var i = 0; i < settings.cells.length; i++) {
    //   let c = settings.cells[i];
    //   let orangeIndex = HELPER.rollADie(pallet.blues.length) - 1;
    //   //console.log(orangeIndex);
    //   cG.noStroke();
    //   cG.fill(pallet.blues[orangeIndex]);
    //   cG.strokeWeight(10);
    //   cG.rect(c.x, c.y, c.w, c.h);
    //
    // }
    generateSun(ENLARGED_CANVAS_WIDTH/2, ENLARGED_CANVAS_HEIGHT/2, 200)








    image(cG, 0, 0, pos.cW, pos.cH);

    fxpreview();
};

window.keyPressed = () => {

    if (key === "s") {
        save(saveFileName());
    }
}
