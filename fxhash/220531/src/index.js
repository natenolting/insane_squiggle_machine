import "./p5.min.js";
import "./p5.collide2d.min.js";

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

const colors = new Colors();
const helper = new Helpers();
const DEBUG = true;
const ENLARGED_CANVAS_WIDTH = 3000;
const ENLARGED_CANVAS_HEIGHT = 3000;
const CANVAS_WIDTH_MULTIPLIER = 1
const CANVAS_HEIGHT_MULTIPLIER = 1
const PALLET_ID = Math.floor(getRandomizer() * 4200);
const USE_ISOMETRIC = true;
const SIDE_HEIGHT_MULTIPLIER = 28 / 49;
const BASE_CELLS_PER_SIDE = 15;
const TRANSPARENT = false;
const X_SMALL = 'tightest';
const SMALL = 'tight';
const MEDIUM = 'middle';
const LARGE = 'loose';
const X_LARGE = 'loosest';
const COLORS_RAINDOW = ['ff0000', 'ffa500', 'ffff00', '008000', '0000ff', '4b0082', 'ee82ee'];
const COLORS_BLACK_WHITE = ['000000', 'aaaaaa', 'bbbbbb', 'cccccc', 'dddddd', 'eeeeee', 'ffffff'];
const COLORS_MINECRAFT = ['f9ffff',
    '9c9d97',
    '474f52',
    '1d1c21',
    'ffd83d',
    'f9801d',
    'b02e26',
    '825432',
    '80c71f',
    '5d7c15',
    '3ab3da',
    '169c9d',
    '3c44a9',
    'f38caa',
    'c64fbd',
    '8932b7',
];


const SPECIAL_PALLET_PICKER = Math.round(getRandomizer() * 1000);

function getPalletString() {
    switch (SPECIAL_PALLET_PICKER) {
        case 100:
            return 'RAINBOW';
            break;
        case 200:
            return 'BLACK_WHITE';
            break;
        case 300:
            return 'MINECRAFT';
            break;
        default:
            return 'RANDOM';
    }
}

const config = {
    noiseSeed: (getRandomizer() * 100_000) >> 0,

    /** number of rows & columns */
    cells: getCellSizeString(getRandomizer()),

    /** noise scale  */
    noiseScale: 0.5 + getRandomizer() * 24,

    pallet: getPalletString(),

    boost: SPECIAL_PALLET_PICKER <= 500 ? 'dark' : 'light'

};

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
const secondaryPallet = {
    // pallet index
    i: null,
    // pallet hex colors
    h: [],
    // pallet rgb colors
    rgb: [],
    // pallet hsl colors
    hsl: [],
}
const pos = {};
let palletData;
let pallets;
let settingsData;
let settings;
let saveCount = 0;
let saveId = helper.makeid(10);
let colorIndex = 0;
let colorSet = [];
let cG;

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
            c = base * .5
            break;
        case MEDIUM:
            c = base * 1.5
            break;
        case SMALL:
            c = base * 2
            break;
        case X_SMALL:
            c = base * 2.5
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
    settings = settingsData.settings;
    settings.canvasWidth = pos.cW
    settings.canvasHeight = pos.cH
    settings.margin = setupMargin();

}

function vectorsAreInsideBounds(iso) {
    return iso.a.x > settings.margin && iso.a.y > settings.margin && iso.a.x < pos.w - settings.margin && iso.a.y < pos.h - settings.margin &&
        iso.b.x > settings.margin && iso.b.y > settings.margin && iso.b.x < pos.w - settings.margin && iso.b.y < pos.h - settings.margin &&
        iso.c.x > settings.margin && iso.c.y > settings.margin && iso.c.x < pos.w - settings.margin && iso.c.y < pos.h - settings.margin &&
        iso.d.x > settings.margin && iso.d.y > settings.margin && iso.d.x < pos.w - settings.margin && iso.d.y < pos.h - settings.margin &&
        iso.e.x > settings.margin && iso.e.y > settings.margin && iso.e.x < pos.w - settings.margin && iso.e.y < pos.h - settings.margin &&
        iso.f.x > settings.margin && iso.f.y > settings.margin && iso.f.x < pos.w - settings.margin && iso.f.y < pos.h - settings.margin &&
        iso.g.x > settings.margin && iso.g.y > settings.margin && iso.g.x < pos.w - settings.margin && iso.g.y < pos.h - settings.margin
}

function setupMargin() {
    return floor(helper.mean([pos.w * .03, pos.h * .03]));
}

function incrementColorIndex() {
    colorIndex++
    if (colorIndex >= pallet.rgb.length - 1) {
        colorIndex = 0;
    }
}

function setupPallet() {


    let palletId = PALLET_ID;
    pallets = palletData.pallets;
    // any "special" pallets
    switch (config.pallet) {
        case 'RAINBOW':
            pallet.h = COLORS_RAINDOW;
            break;
        case 'BLACK_WHITE':
            pallet.h = COLORS_BLACK_WHITE;
            break;
        case 'MINECRAFT':
            pallet.h = COLORS_MINECRAFT;
            break;
        default:
            pallet.h = pallets[palletId];
    }

    // setup colors

    pallet.i = palletId;
    pallet.rgb = [];
    pallet.hsl = [];
    let colorAverages = [];
    for (const element of pallet.h) {
        pallet.rgb.push(colors.HEXtoRGB(element));
        let rgb = pallet.rgb[pallet.rgb.length - 1];
        colorAverages.push(helper.mean(rgb))
        pallet.hsl.push(colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
    }

    while (helper.mean(colorAverages) < 90) {
        if (palletId > pallets.length - 1) {
            palletId = 0;
        }
        pallet.i = palletId;
        pallet.h = pallets[pallet.i];
        pallet.rgb = [];
        pallet.hsl = [];
        colorAverages = [];
        for (const element of pallet.h) {
            pallet.rgb.push(colors.HEXtoRGB(element));
            let rgb = pallet.rgb[pallet.rgb.length - 1];
            colorAverages.push(helper.mean(rgb))
            pallet.hsl.push(colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
        }
        palletId++;
        //console.log(pallet, colorAverages, helper.mean(colorAverages))
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

    if (DEBUG) {
        console.log(config, settings, pallet, pos);
    }

}

window.preload = () => {
    palletData = loadJSON("./palettes.json");
    settingsData = loadJSON("./settings.json");
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


window.draw = () => {
    noLoop();

    background(255, 255, 255, 1);
    fill(255, 255, 255, 1);
    noStroke();
    rect(0, 0, pos.cW, pos.cH)

    let cg = createGraphics(pos.w, pos.h);
    cg.colorMode(RGB, 255, 255, 255, 1);
    cg.background(255, 255, 255, 1);
    cg.pixelDensity(1);
    cg.blendMode(BLEND)
    cg.fill(255, 255, 255, 1);
    cg.rect(0, 0, cg.width, cg.height);

    let startingPointX = floor(map(getRandomizer(), 0, 1, 0, cg.width));
    let startingPointY = floor(map(getRandomizer(), 0, 1, 0, cg.height));
    
    cg.fill(255, 0, 0, 1);
    cg.ellipse(startingPointX, startingPointY, 10);

    image(cg, 0, 0, pos.cW, pos.cH);
    fxpreview();
};

window.keyPressed = () => {

    if (key === "s") {
        save(saveFileName());
    }
}
