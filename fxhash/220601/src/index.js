import "./p5.min.js";
const helper = new Helpers();
const colors = new Colors();

// get all random values from one location
const RANDOMIZER_INCREMENT = fxrand();
let randomizer = RANDOMIZER_INCREMENT;
function getRandomizer() {
    randomizer += RANDOMIZER_INCREMENT;
    if (randomizer >= 1) {
        randomizer = fxrand();
    }
    return randomizer;
}

// flip a coin but more like toggle on and off
let currentRandomizerCoinFlip = Boolean(Math.round(getRandomizer()));

function randomzerCoinFlip() {
    currentRandomizerCoinFlip = !currentRandomizerCoinFlip;
    return currentRandomizerCoinFlip;
};

// randomize a roll between 1 and x
function randomizerRollADie(roll) {
    return round(map(getRandomizer(), 0, 1, 1, roll));
}

const ENLARGED_CANVAS_WIDTH = 3000;
const ENLARGED_CANVAS_HEIGHT = 3000;
const CANVAS_WIDTH_MULTIPLIER = 1;
const CANVAS_HEIGHT_MULTIPLIER = 1;
const TRANSPARENT = false;
const PALLET_ID = Math.floor(getRandomizer() * 4200);
const SIDE_HEIGHT_MULTIPLIER = 28 / 49;
const DEBUG = false;
const MEDIUM_COLOR = .80;
const DARK_COLOR = .60;
const SETTING = {
  margin: 1,
  factor: 1,
};
let img;
let sImg;
let sIW, sIH;
let canvasWidth;
let canvasHeight;
let cells = [];
let saveId = helper.makeid(10);
let saveCount = 0;
let cg;
let palletData;
let pallets;

const POS = {
    /** width */
    w: null,
    /** height */
    h: null,
    /** left */
    l: null,
    /** top */
    t: null,
};

const PALLET = {
    // pallet index
    i: null,
    // pallet hex colors
    h: [],
    // pallet rgb colors
    rgb: [],
    // pallet hsl colors
    hsl: [],
}

function setupPosition() {
    let cW = window.innerWidth;
    let cH = window.innerHeight;

    if (cW > cH) {
        POS.cW = cH;
        POS.cH = cH;
    } else {
        POS.cW = cW;
        POS.cH = cW;
    }

    let w = ENLARGED_CANVAS_WIDTH;
    let h = ENLARGED_CANVAS_WIDTH;
    if (w > h) {
        POS.w = h;
        POS.h = h;
    } else {
        POS.w = w;
        POS.h = w;
    }
    POS.w = w * CANVAS_WIDTH_MULTIPLIER;
    POS.h = h * CANVAS_HEIGHT_MULTIPLIER;
    POS.t = 0;
    POS.l = 0;

    if (DEBUG) {
        console.log(POS);
    }
}
const BOOST = Math.round(getRandomizer() * 1000);
const CONFIG = {
    noiseSeed: (getRandomizer() * 100_000) >> 0,
    boost: BOOST <= 500 ? 'dark' : 'light'
};

const IMAGE_LIST = [
  './images/Adolphe_Millot_papillons_A.jpg',
  './images/Adolphe_Millot_papillons_B.jpg',
  './images/Abhandlungen_der_Senckenbergischen_Naturforschenden_Gesellschaft_butterflies-1884.jpg',
];
window.preload = () => {

    img = loadImage(IMAGE_LIST[floor(map(getRandomizer(), 0, 1, 0, IMAGE_LIST.length - 1))]);
    palletData = loadJSON("./palettes.json");
}

window.$fxhashFeatures = {
    ...CONFIG,
};

function setupMargin() {
  SETTING.margin = round(helper.mean([POS.w, POS.h]) * .0125);
}

function setupFactor() {
  //SETTING.factor = map(getRandomizer(), 0, 1, POS.w * 0.001, POS.w * 0.005);
  SETTING.factor = map(getRandomizer(), 0, 1, 9, 18);
}

function setupPallet() {

    pallets = palletData.pallets;
    let palletId = PALLET_ID;
    // setup color
    PALLET.h = pallets[palletId];

    PALLET.i = palletId;
    PALLET.rgb = [];
    PALLET.hsl = [];
    let colorAverages = [];
    for (const element of PALLET.h) {
        PALLET.rgb.push(colors.HEXtoRGB(element));
        let rgb = PALLET.rgb[PALLET.rgb.length - 1];
        colorAverages.push(helper.mean(rgb))
        PALLET.hsl.push(colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
    }

    while (helper.mean(colorAverages) < 90) {
        if (palletId > pallets.length - 1) {
            palletId = 0;
        }
        PALLET.i = palletId;
        PALLET.h = pallets[PALLET.i];
        PALLET.rgb = [];
        PALLET.hsl = [];
        colorAverages = [];
        for (const element of PALLET.h) {
            PALLET.rgb.push(colors.HEXtoRGB(element));
            let rgb = PALLET.rgb[PALLET.rgb.length - 1];
            colorAverages.push(helper.mean(rgb))
            PALLET.hsl.push(colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
        }
        palletId++;

    }
}

function init() {
  setupPosition();
  setupMargin();
  setupFactor();
  setupPallet();
}

window.setup = () => {
    init();
    pixelDensity(1);
    colorMode(RGB, 255, 255, 255, 1);
    noiseSeed(CONFIG.noiseSeed)
    canvasWidth = POS.cW;
    canvasHeight = POS.cH;
    createCanvas(canvasWidth, canvasHeight);
    cg = createGraphics(POS.w, POS.h);
    cg.colorMode(RGB, 255, 255, 255, 1);
    if(DEBUG) {
      console.log(SETTING, CONFIG);
    }
}

function isoIsInsideBounds(iso, m = 10) {
    return iso.a.x >= m + randomizerRollADie(m * 2) && iso.a.y >= m + randomizerRollADie(m * 2) && iso.a.x <= POS.w - m - randomizerRollADie(m * 2) && iso.a.y <= POS.h - m - randomizerRollADie(m * 2) &&
        iso.b.x >= m + randomizerRollADie(m * 2) && iso.b.y >= m + randomizerRollADie(m * 2) && iso.b.x <= POS.w - m - randomizerRollADie(m * 2) && iso.b.y <= POS.h - m - randomizerRollADie(m * 2) &&
        iso.c.x >= m + randomizerRollADie(m * 2) && iso.c.y >= m + randomizerRollADie(m * 2) && iso.c.x <= POS.w - m - randomizerRollADie(m * 2) && iso.c.y <= POS.h - m - randomizerRollADie(m * 2) &&
        iso.d.x >= m + randomizerRollADie(m * 2) && iso.d.y >= m + randomizerRollADie(m * 2) && iso.d.x <= POS.w - m - randomizerRollADie(m * 2) && iso.d.y <= POS.h - m - randomizerRollADie(m * 2) &&
        iso.e.x >= m + randomizerRollADie(m * 2) && iso.e.y >= m + randomizerRollADie(m * 2) && iso.e.x <= POS.w - m - randomizerRollADie(m * 2) && iso.e.y <= POS.h - m - randomizerRollADie(m * 2) &&
        iso.f.x >= m + randomizerRollADie(m * 2) && iso.f.y >= m + randomizerRollADie(m * 2) && iso.f.x <= POS.w - m - randomizerRollADie(m * 2) && iso.f.y <= POS.h - m - randomizerRollADie(m * 2) &&
        iso.g.x >= m + randomizerRollADie(m * 2) && iso.g.y >= m + randomizerRollADie(m * 2) && iso.g.x <= POS.w - m - randomizerRollADie(m * 2) && iso.g.y <= POS.h - m - randomizerRollADie(m * 2)
}

function backgroundInsideBounds(vectors, m = 10) {

    return vectors.a.x >= m + randomizerRollADie(m * 2) && vectors.a.y >= m + randomizerRollADie(m * 2) && vectors.a.x <= POS.w - m - randomizerRollADie(m * 2) && vectors.a.y <= POS.h - m - randomizerRollADie(m * 2) &&
        vectors.b.x >= m + randomizerRollADie(m * 2) && vectors.b.y >= m + randomizerRollADie(m * 2) && vectors.b.x <= POS.w - m - randomizerRollADie(m * 2) && vectors.b.y <= POS.h - m - randomizerRollADie(m * 2) &&
        vectors.c.x >= m + randomizerRollADie(m * 2) && vectors.c.y >= m + randomizerRollADie(m * 2) && vectors.c.x <= POS.w - m - randomizerRollADie(m * 2) && vectors.c.y <= POS.h - m - randomizerRollADie(m * 2) &&
        vectors.d.x >= m + randomizerRollADie(m * 2) && vectors.d.y >= m + randomizerRollADie(m * 2) && vectors.d.x <= POS.w - m - randomizerRollADie(m * 2) && vectors.d.y <= POS.h - m - randomizerRollADie(m * 2)
}

window.windowResized = () => {

};

window.draw = () => {

    let bgColor = color(235, 233, 186, 1);

    noLoop();
    if (!TRANSPARENT) {
      cg.fill(bgColor);
      cg.noStroke();
      cg.rect(0, 0, cg.width, cg.height);
    }
    let imgFactor;
    let vertOffset = 0;
    let horizOffset = 0;
    if (img.width < cg.width) {
      imgFactor = cg.width / img.width;
      vertOffset = (img.height * imgFactor - cg.height) / 2;
    } else {
      imgFactor = cg.height / img.height;
      horizOffset = (img.width * imgFactor - cg.width) / 2;
    }

    cg.image(img, -horizOffset, -vertOffset, img.width * imgFactor, img.height * imgFactor)
    let sImgWidth = cg.width / SETTING.factor;
    let sImgHeight = cg.height / SETTING.factor;

    // get a crop of the image
    let crop = cg.get(
      map(getRandomizer(), 0, 1, 0, cg.width - sImgWidth),
      map(getRandomizer(), 0, 1, 0, cg.height - sImgHeight),
      sImgWidth,
      sImgHeight
    );

    cg.rect(0, 0, cg.width, cg.height);
    cg.image(crop, 0, 0, sImgWidth, sImgHeight);
    sImg = createImage(int(sImgWidth), int(sImgHeight));
    sImg.copy(crop, 0, 0, crop.width, crop.height, 0, 0, sImgWidth, sImgHeight);

    sImg.loadPixels();

    let cellIndex = 0;
    let colorAverages = {r: [], g: [], b: []}
    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {
            let index = (x + y * sImg.width) * 4;
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            let c = new Cell(x, y, x, y, 1, 1, false, cellIndex);
            c.fill = [r, g, b];
            cells.push(c);
            cellIndex++;
            colorAverages.r.push(r);
            colorAverages.g.push(g);
            colorAverages.b.push(b);

    }
}
bgColor = color(floor(helper.mean(colorAverages.r)), floor(helper.mean(colorAverages.g)), floor(helper.mean(colorAverages.b)), 1);
if (!TRANSPARENT) {
  // fill with the average color from the pixel loop above
  cg.fill(bgColor);
  cg.rect(0,0,cg.width, cg.height);
} else {
  cg.loadPixels();
  for (let x = 0; x < cg.width; x++) {
      for (let y = 0; y < cg.height; y++) {
        let index = (x + y * cg.width) * 4;
        cg.pixels[index + 3] = 0
      }
    }
    cg.updatePixels();
}

//build the background
if (!TRANSPARENT) {
  for (let c of cells) {
  let offset = POS.w / sImg.width;
  let x1 = c.x * offset;
  let y1 = c.y * offset;
  let x2 = x1 + c.w * offset
  let y2 = y1 + c.h * offset

  let bgVectors = {
    a: createVector(x1, y1),
    b: createVector(x2, y1),
    c: createVector(x2, y2),
    d: createVector(x1, y2), 
}

  if (backgroundInsideBounds(bgVectors, SETTING.margin * 1.5)) {
          cg.fill(c.fill[0], c.fill[1], c.fill[2], 1);
          cg.rect(c.x * offset, c.y * offset, c.w * offset, c.h * offset);

      }

}
}
let used  = 0;
for (let c of cells) {

        if (helper.rollADie(6) === 6) {
          continue;
        }
        let x1 = c.x * SETTING.factor;
        let y1 = c.y * SETTING.factor;
        let x2 = x1 + c.w * SETTING.factor
        let y2 = y1 + c.h * SETTING.factor
        let colorAverage = helper.mean(c.fill);
        cg.fill(c.fill[0], c.fill[1], c.fill[2], 1);
        cg.noStroke();

        let iso = new Isometric(
            x1 + ((x2 - x1) * noise(x1, y1)),
            y2,
            (x2 - x1) / 2,
            ((x2 - x1) / 2) * SIDE_HEIGHT_MULTIPLIER,
            5 * noise(x1, y1)
        );
        let dirPercent = noise(x1 * c.index, y2 * c.index);
        let direction = 1;
        if (dirPercent < .45) {
          direction = 6;
        } else if (dirPercent > .65) {
          direction = 7;
        }

        if(CONFIG.boost === 'dark') {
          colorAverage = 255 - colorAverage;
        }

        iso.pickDirection(direction, map(colorAverage, 0, 255, 1, 8));
        if (isoIsInsideBounds(iso, SETTING.margin * .75)) {
          used++;

            let xDiviation = (iso.a.x - iso.b.x) * noise(c.index) * 1.75;
            if (helper.isEven(c.index)) {
              xDiviation = xDiviation * -1;
            }

            if(direction === 1) {
              xDiviation = xDiviation/4;
            }

            let yDiviation = noise(c.index);



            //do faces
            cg.fill(c.fill[0] * MEDIUM_COLOR, c.fill[1] * MEDIUM_COLOR, c.fill[2] * MEDIUM_COLOR, 1);
            // top face
            cg.beginShape();
            cg.vertex(iso.g.x,iso.g.y);
            cg.vertex(iso.c.x,iso.c.y);
            cg.vertex(iso.d.x,iso.d.y);
            cg.vertex(iso.e.x,iso.e.y);
            cg.endShape(CLOSE);



            cg.fill(c.fill[0], c.fill[1], c.fill[2], 1);
            cg.beginShape();
            cg.vertex(iso.a.x,iso.a.y);
            cg.vertex(iso.b.x,iso.b.y);
            cg.quadraticVertex(iso.c.x + xDiviation, lerp(iso.c.y, iso.b.y, yDiviation), iso.c.x,iso.c.y);
            cg.vertex(iso.c.x,iso.c.y);
            cg.vertex(iso.g.x,iso.g.y);
            cg.quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.a.x,iso.a.y);
            cg.endShape(CLOSE);

            //iso.buildLeftFace();
            cg.fill(c.fill[0] * DARK_COLOR, c.fill[1] * DARK_COLOR, c.fill[2] * DARK_COLOR, 1);

            cg.beginShape();
            cg.vertex(iso.a.x,iso.a.y);
            cg.quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.g.x ,iso.g.y);
            cg.vertex(iso.e.x,iso.e.y);
            cg.quadraticVertex(iso.e.x + xDiviation, lerp(iso.f.y, iso.e.y, yDiviation), iso.f.x ,iso.f.y);
            cg.endShape(CLOSE);
            //iso.buildTopFace();

            //iso.buildRightFace();

            // do border
            cg.noFill()
            cg.stroke(red(bgColor), green(bgColor), blue(bgColor), .25);
            cg.strokeWeight((x2 - x1) / 2 * .1);
            cg.strokeJoin(ROUND);

            // top face
            cg.beginShape();
            cg.vertex(iso.g.x,iso.g.y);
            cg.vertex(iso.c.x,iso.c.y);
            cg.vertex(iso.d.x,iso.d.y);
            cg.vertex(iso.e.x,iso.e.y);
            cg.endShape(CLOSE);

            cg.beginShape();
            cg.vertex(iso.a.x,iso.a.y);
            cg.vertex(iso.b.x,iso.b.y);
            cg.quadraticVertex(iso.c.x + xDiviation, lerp(iso.c.y, iso.b.y, yDiviation), iso.c.x,iso.c.y);
            cg.vertex(iso.c.x,iso.c.y);
            cg.vertex(iso.g.x,iso.g.y);
            cg.quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.a.x,iso.a.y);
            cg.endShape(CLOSE);

            cg.beginShape();
            cg.vertex(iso.a.x,iso.a.y);
            cg.quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.g.x ,iso.g.y);
            cg.vertex(iso.e.x,iso.e.y);
            cg.quadraticVertex(iso.e.x + xDiviation, lerp(iso.f.y, iso.e.y, yDiviation), iso.f.x ,iso.f.y);
            cg.endShape(CLOSE);
        }

    }


    image(cg, 0, 0, POS.cW, POS.cH);
    fxpreview();
    return;



}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.${TRANSPARENT ? 'png' : 'jpg'}`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {

    if (key === 's') {
        save(saveFileName());
    }

}
