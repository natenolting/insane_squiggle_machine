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
const DEBUG = false;
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

function setupCells() {
    let e, s, c;

    settings.cells = [];
    settings.splits = [];
    settings.enlarges = [];
    settings.fullCells = [];


    let baseCells = _.sortBy(new Cells(settings.cols, settings.rows, settings.cellWidth, settings.cellHeight).populateCells(false)[0], ['row', 'col']);
    for (const element of baseCells) {

        let c = element;

        let splitOrEnlarge = randomizerRollADie(settings.modifyOutOf);

        if (splitOrEnlarge === settings.enlargement.chance) {
            // enlarge
            let enlargementRange = helper.range(settings.enlargement.low, settings.enlargement.high);
            let enlargementBy = enlargementRange[round(map(getRandomizer(), 0, 1, 0, enlargementRange.length - 1))];
            let newEnl = new Cell(0, 0, c.x, c.y, c.w * enlargementBy, c.h * enlargementBy, false, settings.enlarges.length + 1);

            let addEnl = true;
            for (e = 0; e < settings.enlarges.length; e++) {
                let enl = settings.enlarges[e];
                if (collideRectRect(enl.x, enl.y, enl.w, enl.h, newEnl.x, newEnl.y, newEnl.w, newEnl.h)) {
                    addEnl = false;
                    break;
                }
            }
            if (addEnl && c.x + c.w * enlargementBy < settings.cols * settings.cellWidth && c.y + c.h * enlargementBy < settings.rows * settings.cellHeight) {
                settings.enlarges.push(newEnl);
                continue;
            }

        }

        if (splitOrEnlarge === settings.split.chance) {
            // split
            let splitRange = helper.range(settings.split.low, settings.split.high);
            let splitBy = splitRange[round(map(getRandomizer(), 0, 1, 0, splitRange.length - 1))];
            let splitW = c.w / splitBy;
            let splitH = c.h / splitBy;
            for (let sc = 0; sc < c.w; sc += splitW) {
                for (let sr = 0; sr < c.h; sr += splitH) {
                    let spCell = new Cell(0, 0, c.x + sc, c.y + sr, splitW, splitH, 0, settings.splits.length + 1);
                    let addSplit = true;
                    for (e = 0; e < settings.enlarges.length; e++) {
                        let enl = settings.enlarges[e];
                        if (collideRectRect(enl.x + 1, enl.y + 1, enl.w - 2, enl.h - 2, spCell.x, spCell.y, spCell.w, spCell.h)) {
                            addSplit = false;
                            break;
                        }
                    }
                    if (addSplit) {
                        settings.splits.push(spCell);
                    }

                }
            }

        }

        let addCell = true
        // check if the cell collides with any of the
        // large cells. If it does then skip it.
        for (e = 0; e < settings.enlarges.length; e++) {
            let enl = settings.enlarges[e];
            if (collidePointRect(c.cX, c.cY, enl.x, enl.y, enl.w, enl.h)) {
                addCell = false;
                break;
            }
        }
        // check if the cell collides with any of the
        // small cells. If it does then skip it.
        for (s = 0; s < settings.splits.length; s++) {
            let spl = settings.splits[s];
            if (collidePointRect(spl.cX, spl.cY, c.x, c.y, c.w, c.h)) {
                addCell = false;
                break;
            }
        }

        if (addCell) {
            settings.cells.push(c);
        }
    }
    for (const element of settings.enlarges) {
        c = element;
        if (randomizerRollADie(settings.modifyOutOf) === settings.split.chance) {

            // split the large cell into smaller Cells
            let splitByRange = helper.range(settings.split.low, settings.split.high)
            let splitBy = splitByRange[round(map(getRandomizer(), 0, 1, 0, splitByRange.length - 1))];
            let splitW = c.w / splitBy;
            let splitH = c.h / splitBy;
            for (let sc = 0; sc < c.w; sc += splitW) {
                for (let sr = 0; sr < c.h; sr += splitH) {
                    settings.splits.push(new Cell(0, 0, c.x + sc, c.y + sr, splitW, splitH, 0, settings.splits.length + 1));
                }
            }
            settings.splits = _.filter(settings.splits, function (o) {
                return o.index !== c.index;
            })
        }
    }
    // background large cells to fill in any blank space
    let fullCellAmount;
    if (settings.canvasWidth > settings.canvasHeight) {
        fullCellAmount = floor((settings.canvasWidth - (settings.margin * 2)) / (settings.canvasHeight - (settings.margin * 2)));
        settings.fullCells = (new Cells(fullCellAmount, 1, settings.canvasHeight, settings.canvasHeight).populateCells(false)[0]);
        for (const element of settings.fullCells) {
            element.x += (settings.canvasWidth % settings.canvasHeight) / 2
        }
    } else {
        fullCellAmount = floor((settings.canvasHeight - (settings.margin * 2)) / (settings.canvasWidth - (settings.margin * 2)));
        settings.fullCells = (new Cells(1, fullCellAmount, settings.canvasWidth, settings.canvasWidth).populateCells(false)[0]);
        for (const element of settings.fullCells) {
            element.y += (settings.canvasHeight % settings.canvasWidth) / 2
        }
    }

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
    settings.canvasWidth = pos.w;
    settings.canvasHeight = pos.h;
    settings.cellWidth = pos.w / cfs;
    settings.cellHeight = pos.h / cfs;
    settings.cols = cfs;
    settings.rows = cfs;
    settings.colRowAverage = helper.average([settings.cols, settings.rows]);
    settings.margin = setupMargin();
    settings.pixelDensityLow = 12
    settings.pixelDensityHigh = 24
    settings.pixelDensity = floor(map(getRandomizer(), 0, 1, settings.pixelDensityLow, settings.pixelDensityHigh));
    settings.isoMaxMultiplier = floor(map(settings.pixelDensity, settings.pixelDensityLow, settings.pixelDensityHigh, 5, 8));
    settings.isoMaxDirections = round(map(getRandomizer(), 0, 1, 1, 7));

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

    // prep cells
    setupCells();
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

function verticalGradient(cell, colors) {

    let pixelColorLerp;
    let lerpPercent;
    for (let y = 0; y < floor(cell.h / 2); y++) {
        lerpPercent = y / (cell.h / 2);
        pixelColorLerp = lerpColor(colors[0], colors[1], lerpPercent);
        cG.stroke(pixelColorLerp);
        cG.strokeWeight(2);
        cG.line(cell.x, cell.y + y, cell.x + cell.w, cell.y + y);
    }
    for (let y = 0; y < floor(cell.h / 2); y++) {
        lerpPercent = y / (cell.h / 2);
        pixelColorLerp = lerpColor(colors[1], colors[2], lerpPercent);
        cG.stroke(pixelColorLerp);
        cG.strokeWeight(2);
        cG.line(cell.x, cell.y + cell.h / 2 + y, cell.x + cell.w, cell.y + cell.h / 2 + y);
    }

}

// build gradeint from left to right
function horizontalGradient(cell, colors) {

    let pixelColorLerp;
    let lerpPercent;
    for (let x = 0; x < floor(cell.w / 2); x++) {
        lerpPercent = x / (cell.w / 2);
        pixelColorLerp = lerpColor(colors[0], colors[1], lerpPercent);
        cG.stroke(pixelColorLerp);
        cG.strokeWeight(2);
        cG.line(cell.x + x, cell.y, cell.x + x, cell.y + cell.h);
    }
    for (let x = 0; x < floor(cell.w / 2); x++) {
        lerpPercent = x / (cell.w / 2);
        pixelColorLerp = lerpColor(colors[1], colors[2], lerpPercent);
        cG.stroke(pixelColorLerp);
        cG.strokeWeight(2);
        cG.line(cell.x + cell.w / 2 + x, cell.y, cell.x + cell.w / 2 + x, cell.y + cell.h);
    }

}

function drawCells(allCells, colorSet) {

    //console.log(`Total Cells: ${allCells.length}`);

    //let used = 0;
    for (const element of allCells) {
        let c = element;

        // shuffle the color set
        let cS = helper.shuffleArray(colorSet);

        // roll to get which direction we're going to spred to (or don't)
        let roll = randomizerRollADie(5);
        roll = 1
        switch (roll) {
            case 1:
                // spred north
                if (c.y - c.h > 0) {
                    c.y = c.y - c.h;
                    c.h = c.h * 2;
                }
                break;
            case 2:
                // spred south
                if (c.y + c.h * 2 < cG.height) {
                    c.h = c.h * 2
                }
                break;
            case 3:
                // spred east
                if (c.x - c.w > 0) {
                    c.x = c.x - c.w;
                    c.w = c.w * 2;
                }
                break;
            case 4:
                // spred west
                if (c.x + c.w * 2 < cG.width) {
                    c.w = c.w * 2;
                }
                break;
            default:

        }

        cG.noStroke();
        let rollForFill = randomizerRollADie(4);
        switch (rollForFill) {
            case 1:
                horizontalGradient(c, cS);
                break;
            case 2:
                verticalGradient(c, cS);
                break;
            case 3:
                cG.fill(floor(map(getRandomizer(), 0, 1, 0, cS.length)));
                cG.rect(c.x, c.y, c.w, c.h)
            case 4:
                cG.fill(0, 0, 0, 1);
                cG.rect(c.x, c.y, c.w, c.h)
            default:
        }

        //used++;
    }
//console.log(`Total Cells Used: ${used}`);
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
    cG.blendMode(BLEND)
    colorSet = [];

    for (const element of pallet.rgb) {
        let c1 = pallet.rgb[colorIndex];
        let color1 = color(c1[0], c1[1], c1[2], 1)
        colorSet.push(color1)
        incrementColorIndex()
    }

    verticalGradient(settings.fullCells[0], colorSet);

    drawCells(settings.enlarges, colorSet);
    drawCells(settings.cells, colorSet);
    drawCells(settings.splits, colorSet);

    if (USE_ISOMETRIC) {

        let pixelPositions = [];
        cG.loadPixels();
        for (var y = 0; y < cG.height; y += settings.pixelDensity) {
            for (var x = 0; x < cG.width; x += settings.pixelDensity) {

                let index = (x + y * cG.width) * 4;
                let r = cG.pixels[index];
                let g = cG.pixels[index + 1];
                let b = cG.pixels[index + 2];
                let a = cG.pixels[index + 3];
                let averageColor = helper.mean([r, g, b]);
                pixelPositions.push(
                    {
                        "position": createVector(x, y),
                        "red": r,
                        "green": g,
                        "blue": b,
                        "average": averageColor,
                    }
                );
            }
        }
        cG.updatePixels();
        if (randomzerCoinFlip()) {
            verticalGradient(settings.fullCells[0], colorSet);
        } else {
            horizontalGradient(settings.fullCells[0], colorSet);
        }

        cG.fill(255, 255, 255, .25);
        cG.rect(0, 0, cG.width, cG.height);

        cG.noStroke();

        let allowedDirections = [];
        for (var r = 0; r <= settings.isoMaxDirections; r++) {
            if (randomizerRollADie(10) < 8) {
                allowedDirections.push(round(map(getRandomizer(), 0, 1, 1, 7)));
            }
        }

        for (const element of pixelPositions) {

            let p = element;
            if (p.average === 0) {
                if (randomizerRollADie(20) === 20) {
                    let blackReplace = colorSet[floor(map(getRandomizer(), 0, 1, 0, colorSet.length))];
                    p = {
                        "position": p.position,
                        "red": red(blackReplace),
                        "green": green(blackReplace),
                        "blue": blue(blackReplace),
                        "average": helper.mean([red(blackReplace), green(blackReplace), blue(blackReplace)]),
                    }
                } else {
                    continue;
                }
            }

            if(config.boost === 'dark') {
              p.average = 255 - p.average;
            }

            let isosSideWidth = map(p.average, 0, 100, 1, settings.isoMaxMultiplier);
            let isosSizeMultipler = map(p.average, 0, 255, 1, settings.isoMaxMultiplier);
            let isoLengthMultipler = map(p.average, 0, 255, 1, settings.isoMaxMultiplier);


            cG.noStroke();
            let iso = new Isometric(
                p.position.x,
                p.position.y,
                isosSideWidth,
                isosSideWidth * SIDE_HEIGHT_MULTIPLIER,
                isosSizeMultipler
            );
            let directionRoll = allowedDirections[floor(map(getRandomizer(), 0, 1, 0, allowedDirections.length))];

            iso.pickDirection(directionRoll, isoLengthMultipler);


            let lerpAmount = getRandomizer();
            if ([1, 2, 6, 7].includes(directionRoll)) {
                //console.log('slim vertical', lerpAmount, iso);
                iso.d = p5.Vector.lerp(iso.c, iso.d, lerpAmount);
                iso.e = p5.Vector.lerp(iso.g, iso.e, lerpAmount);
                iso.f = p5.Vector.lerp(iso.a, iso.f, lerpAmount);
            }

            if ([3, 5].includes(directionRoll)) {
                iso.c = p5.Vector.lerp(iso.g, iso.c, lerpAmount);
                iso.d = p5.Vector.lerp(iso.e, iso.d, lerpAmount);
                iso.b = p5.Vector.lerp(iso.a, iso.b, lerpAmount);
            }

            if (directionRoll === 4) {
                iso.d = p5.Vector.lerp(iso.c, iso.d, lerpAmount);
                iso.e = p5.Vector.lerp(iso.g, iso.e, lerpAmount);
                iso.f = p5.Vector.lerp(iso.a, iso.f, lerpAmount);

            }

            if (vectorsAreInsideBounds(iso)) {

                cG.fill(
                    p.red * settings.faceLightness.top,
                    p.green * settings.faceLightness.top,
                    p.blue * settings.faceLightness.top,
                    1
                );
                // build the top
                cG.beginShape();
                cG.vertex(iso.g.x, iso.g.y);
                cG.vertex(iso.c.x, iso.c.y);
                cG.vertex(iso.d.x, iso.d.y);
                cG.vertex(iso.e.x, iso.e.y);
                cG.endShape(CLOSE)

                cG.fill(
                    p.red * settings.faceLightness.left,
                    p.green * settings.faceLightness.left,
                    p.blue * settings.faceLightness.left,
                    1
                );
                // iso.buildLeftFace();
                cG.beginShape();
                cG.vertex(iso.a.x, iso.a.y);
                cG.vertex(iso.b.x, iso.b.y);
                cG.vertex(iso.c.x, iso.c.y);
                cG.vertex(iso.g.x, iso.g.y);
                cG.endShape(CLOSE)

                cG.fill(
                    p.red * settings.faceLightness.right,
                    p.green * settings.faceLightness.right,
                    p.blue * settings.faceLightness.right,
                    1
                );
                //iso.buildRightFace();
                cG.beginShape();
                cG.vertex(iso.a.x, iso.a.y);
                cG.vertex(iso.g.x, iso.g.y);
                cG.vertex(iso.e.x, iso.e.y);
                cG.vertex(iso.f.x, iso.f.y);
                cG.endShape(CLOSE)
            }

        }


    }

    image(cG, 0, 0, pos.cW, pos.cH);

    fxpreview();
};

window.keyPressed = () => {

    if (key === "s") {
        save(saveFileName());
    }
}
