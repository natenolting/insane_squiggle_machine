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

const COLOR = new Colors();
const HELPER = new Helpers();
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

function mapScale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const CONFIG = {
    noiseSeed: (getRandomizer() * 100_000) >> 0,

    /** number of rows & columns */
    cells: getCellSizeString(getRandomizer()),

    /** noise scale  */
    noiseScale: 0.5 + getRandomizer() * 24,

    pallet: Math.floor(mapScale(fxrand(), 0, 1, 0, 4260)),

    boost: Math.round(fxrand()) ? 'dark' : 'light',

};


const pos = {};
let palletData;
let pallets = [];
let pallet = {}
let settingsData;
let settings;
let saveCount = 0;
let saveId = HELPER.makeid(10);
let colorIndex = 0;
let colorSet = [];
let cg;

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
    if (value <= .9) {
        return X_LARGE
    }
}

function getCellsFromString(string) {
    let c;
    let base = BASE_CELLS_PER_SIDE;
    switch (string) {
        case X_LARGE:
            c = base;
            break;
        case LARGE:
            c = base * 1.5;
            break;
        case MEDIUM:
            c = base * 2;
            break;
        case SMALL:
            c = base * 2.5;
            break;
        case X_SMALL:
            c = base * 3;
            break;
    }
    return floor(c);
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
            let enlargementRange = HELPER.range(settings.enlargement.low, settings.enlargement.high);
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
            let splitRange = HELPER.range(settings.split.low, settings.split.high);
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
            let splitByRange = HELPER.range(settings.split.low, settings.split.high)
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
    let cfs = getCellsFromString(CONFIG.cells)
    // prep settings object
    settings = settingsData.settings;
    settings.canvasWidth = pos.w;
    settings.canvasHeight = pos.h;
    settings.cellWidth = pos.w / cfs;
    settings.cellHeight = pos.h / cfs;
    settings.cols = cfs;
    settings.rows = cfs;
    settings.colRowAverage = HELPER.average([settings.cols, settings.rows]);
    settings.margin = setupMargin();
    settings.circular = true;
    settings.pixelDensityLow = 12
    settings.pixelDensityHigh = 24
    settings.pixelDensity = floor(map(getRandomizer(), 0, 1, settings.pixelDensityLow, settings.pixelDensityHigh));
    settings.isoMaxMultiplier = floor(map(settings.pixelDensity, settings.pixelDensityLow, settings.pixelDensityHigh, 5, 8));
    settings.isoMaxDirections = round(map(getRandomizer(), 0, 1, 1, 7));

}

function vectorsAreInsideBounds(iso, circlular = false) {
    let modifier;

    if (circlular) {
      modifier = map(fxrand(), 0, 1, settings.margin * .25, settings.margin + settings.margin * .25);
      let fromCenter = cg.width/2;
      let distance = fromCenter - settings.margin * 2.125;
      let randDist = distance + modifier;
      return dist(fromCenter, fromCenter, iso.a.x, iso.a.y) < randDist &&
          dist(fromCenter, fromCenter, iso.b.x, iso.b.y) < randDist &&
          dist(fromCenter, fromCenter, iso.c.x, iso.c.y) < randDist &&
          dist(fromCenter, fromCenter, iso.d.x, iso.d.y) < randDist &&
          dist(fromCenter, fromCenter, iso.e.x, iso.e.y) < randDist &&
          dist(fromCenter, fromCenter, iso.f.x, iso.f.y) < randDist &&
          dist(fromCenter, fromCenter, iso.g.x, iso.g.y) < randDist
    } else {

      modifier = map(fxrand(), 0, 1, settings.margin * .1, settings.margin * .5);
      let randMargin = settings.margin + modifier;
      return iso.a.x > randMargin && iso.a.y > randMargin && iso.a.x < pos.w - randMargin && iso.a.y < pos.h - randMargin &&
        iso.b.x > randMargin && iso.b.y > randMargin && iso.b.x < pos.w - randMargin && iso.b.y < pos.h - randMargin &&
        iso.c.x > randMargin && iso.c.y > randMargin && iso.c.x < pos.w - randMargin && iso.c.y < pos.h - randMargin &&
        iso.d.x > randMargin && iso.d.y > randMargin && iso.d.x < pos.w - randMargin && iso.d.y < pos.h - randMargin &&
        iso.e.x > randMargin && iso.e.y > randMargin && iso.e.x < pos.w - randMargin && iso.e.y < pos.h - randMargin &&
        iso.f.x > randMargin && iso.f.y > randMargin && iso.f.x < pos.w - randMargin && iso.f.y < pos.h - randMargin &&
        iso.g.x > randMargin && iso.g.y > randMargin && iso.g.x < pos.w - randMargin && iso.g.y < pos.h - randMargin
      }
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


    pallet.h = pallets[CONFIG.pallet];
    pallet.i = CONFIG.pallet;
    pallet.rgb = [];
    pallet.hsl = [];

    for (let p = 0; p < pallet.h.length; p++) {

        let c1 = COLOR.HEXtoRGB(pallet.h[p]);
        pallet.rgb.push(c1);
        let rgb = pallet.rgb[pallet.rgb.length - 1];
        pallet.hsl.push(COLOR.RGBtoHSL(rgb[0], rgb[1], rgb[2]));

        let cc1 = color(c1[0], c1[1], c1[2]);
        let c2;
        if (p + 1 === pallet.h.length) {
            c2 = COLOR.HEXtoRGB(pallet.h[0]);
        } else {
            c2 = COLOR.HEXtoRGB(pallet.h[p + 1]);
        }
        let cc2 = color(c2[0], c2[1], c2[2]);
        for (var amt = .2; amt < 1; amt += .2) {
            let cc3 = lerpColor(cc1, cc2, amt);
            pallet.rgb.push(cc3.levels);
            rgb = pallet.rgb[pallet.rgb.length - 1];
            pallet.hsl.push(COLOR.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
        }


    }
}

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.${TRANSPARENT ? 'png' : 'jpg'}`;
    saveCount++;
    return fileName;
}

function init() {
    pallets = palletData.pallets;
    noiseSeed(CONFIG.noiseSeed);
    setupPosition();
    setupSettings();
    setupPallet();

    frameRate(CONFIG.frameRate);

    // prep cells
    setupCells();
    if (DEBUG) {
        console.log(CONFIG, settings, pallet, pos);
    }

}

window.preload = () => {
    palletData = loadJSON("./palettes.json");
    settingsData = loadJSON("./settings.json");
}

window.$fxhashFeatures = {
    ...CONFIG,
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
        cg.stroke(pixelColorLerp);
        cg.strokeWeight(2);
        cg.line(cell.x, cell.y + y, cell.x + cell.w, cell.y + y);
    }
    for (let y = 0; y < floor(cell.h / 2); y++) {
        lerpPercent = y / (cell.h / 2);
        pixelColorLerp = lerpColor(colors[1], colors[2], lerpPercent);
        cg.stroke(pixelColorLerp);
        cg.strokeWeight(2);
        cg.line(cell.x, cell.y + cell.h / 2 + y, cell.x + cell.w, cell.y + cell.h / 2 + y);
    }

}

// build gradeint from left to right
function horizontalGradient(cell, colors) {

    let pixelColorLerp;
    let lerpPercent;
    for (let x = 0; x < floor(cell.w / 2); x++) {
        lerpPercent = x / (cell.w / 2);
        pixelColorLerp = lerpColor(colors[0], colors[1], lerpPercent);
        cg.stroke(pixelColorLerp);
        cg.strokeWeight(2);
        cg.line(cell.x + x, cell.y, cell.x + x, cell.y + cell.h);
    }
    for (let x = 0; x < floor(cell.w / 2); x++) {
        lerpPercent = x / (cell.w / 2);
        pixelColorLerp = lerpColor(colors[1], colors[2], lerpPercent);
        cg.stroke(pixelColorLerp);
        cg.strokeWeight(2);
        cg.line(cell.x + cell.w / 2 + x, cell.y, cell.x + cell.w / 2 + x, cell.y + cell.h);
    }

}

function drawCells(allCells, colorSet) {

    //console.log(`Total Cells: ${allCells.length}`);

    //let used = 0;
    for (const element of allCells) {
        let c = element;

        // shuffle the color set
        let cS = HELPER.shuffleArray(colorSet);

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
                if (c.y + c.h * 2 < cg.height) {
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
                if (c.x + c.w * 2 < cg.width) {
                    c.w = c.w * 2;
                }
                break;
            default:

        }

        cg.noStroke();
        let rollForFill = randomizerRollADie(5);
        rollForFill = 5;
        switch (rollForFill) {
            case 1:
                horizontalGradient(c, cS);
                break;
            case 2:
                verticalGradient(c, cS);
                break;
            case 3:
                cg.fill(floor(map(getRandomizer(), 0, 1, 0, cS.length)));
                cg.rect(c.x, c.y, c.w, c.h)
                break;
            case 4:
                cg.fill(0, 0, 0, 1);
                cg.rect(c.x, c.y, c.w, c.h)
                break;
            case 5:
                drawEllipseGradient(c);
                break;
            default:
        }
    }
}

function generatePill(shapeW, shapeH) {
    let pill = (new VectorShape(0, shapeW, 0, shapeH)).pill();
    return pill;

}


function drawEllipseGradient(cell) {

    let posX = floor(cell.x);
    let posY = floor(cell.y);
    let shapeW = floor(cell.w);
    let shapeH = floor(cell.h);
    let rColor = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    let rColor2 = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    let rColor3 = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];

    let c1 = color(rColor[0], rColor[1], rColor[2]);
    let c2 = color(rColor2[0], rColor2[1], rColor2[2]);
    let c3 = color(rColor3[0], rColor3[1], rColor3[2]);

    // shape
    let cgs = createGraphics(shapeW, shapeH);


    // mask
    let cgm = createGraphics(shapeW, shapeH);


    cgs.colorMode(RGB, 255, 255, 255, 1);
    cgm.colorMode(RGB, 255, 255, 255, 1);
    cgs.fill(rColor[0], rColor[1], rColor[2], 1);
    cgs.noStroke();

    let pill = generatePill(shapeW, shapeH);

    cgs.beginShape();
    for (const element of pill) {
        let v = element;
        cgs.vertex(v.x, v.y);
    }
    cgs.endShape(CLOSE);

    cgs.loadPixels();
    cgm.loadPixels();
    let px;
    let py;
    for (px = 0; px < cgs.width; px++) {
        for (py = 0; py < cgs.height; py++) {
            let index = (px + py * cgs.width) * 4;
            cgm.pixels[index] = 255;
            cgm.pixels[index + 1] = 255;
            cgm.pixels[index + 2] = 255;
            cgm.pixels[index + 3] = cgs.pixels[index + 3];
        }
    }
    cgm.updatePixels();

    for (py = 0; py < cgs.height; py++) {
        let lp = py / cgs.height;
        let cl = lerpColor(c1, c2, lp);
        cgs.fill(cl);
        cgs.rect(0, py, cgs.width, 1);
    }

    let c4;
    if (HELPER.flipACoin()) {
        c4 = color(255, 255, 255);
    } else {
        c4 = color(0, 0, 0);
    }
    c4.setAlpha(0);
    for (px = 0; px < cgs.width; px++) {
        let lp = px / cgs.width;
        let cl = lerpColor(c3, c4, lp);
        cgs.fill(cl);
        cgs.rect(px, 0, 1, cgs.height);
    }


    let masked;
    (masked = cgs.get()).mask(cgm);


    cg.image(masked, posX, posY, cgs.width, cgs.height);

}

window.draw = () => {
    noLoop();

    background(255, 255, 255, 1);
    fill(255, 255, 255, 1);
    noStroke();
    rect(0, 0, pos.cW, pos.cH)

    cg = createGraphics(pos.w, pos.h);
    cg.colorMode(RGB, 255, 255, 255, 1);
    cg.background(255, 255, 255, 1);
    cg.pixelDensity(1);
    cg.blendMode(BLEND)
    colorSet = [];

    for (const element of pallet.rgb) {
        let c1 = pallet.rgb[colorIndex];
        let color1 = color(c1[0], c1[1], c1[2], 1)
        colorSet.push(color1)
        incrementColorIndex()
    }

    verticalGradient(settings.fullCells[0], colorSet);
    let centralEllipseOffset = 0;
    if (settings.enlarges.length + settings.cells.length + settings.splits.length === 0) {
        drawEllipseGradient({
            x: settings.margin,
            y: settings.margin,
            w: cg.width - settings.margin * 2,
            h: cg.height - settings.margin * 2
        });
        centralEllipseOffset = floor(map(fxrand(), 0, 1, 1, 10));
        drawEllipseGradient({
            x: settings.margin * centralEllipseOffset,
            y: settings.margin * centralEllipseOffset,
            w: cg.width - settings.margin * centralEllipseOffset * 2,
            h: cg.height - settings.margin * centralEllipseOffset * 2
        });
        centralEllipseOffset = floor(map(fxrand(), 0, 1, 10, 20));
        drawEllipseGradient({
            x: settings.margin * centralEllipseOffset,
            y: settings.margin * centralEllipseOffset,
            w: cg.width - settings.margin * centralEllipseOffset * 2,
            h: cg.height - settings.margin * centralEllipseOffset * 2
        });
        centralEllipseOffset = floor(map(fxrand(), 0, 1, 20, 40));
        drawEllipseGradient({
            x: settings.margin * centralEllipseOffset,
            y: settings.margin * centralEllipseOffset,
            w: cg.width - settings.margin * centralEllipseOffset * 2,
            h: cg.height - settings.margin * centralEllipseOffset * 2
        });
    } else {
        drawCells(settings.enlarges, colorSet);
        drawCells(settings.cells, colorSet);
        drawCells(settings.splits, colorSet);
    }
    if (USE_ISOMETRIC) {

        let pixelPositions = [];
        cg.loadPixels();
        for (var y = 0; y < cg.height; y += settings.pixelDensity) {
            for (var x = 0; x < cg.width; x += settings.pixelDensity) {

                let index = (x + y * cg.width) * 4;
                let r = cg.pixels[index];
                let g = cg.pixels[index + 1];
                let b = cg.pixels[index + 2];
                let a = cg.pixels[index + 3];
                let averageColor = HELPER.mean([r, g, b]);
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
        cg.updatePixels();
        if (randomzerCoinFlip()) {
            verticalGradient(settings.fullCells[0], colorSet);
        } else {
            horizontalGradient(settings.fullCells[0], colorSet);
        }

        cg.fill(255, 255, 255, .25);
        cg.rect(0, 0, cg.width, cg.height);

        cg.noStroke();

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
                        "average": HELPER.mean([red(blackReplace), green(blackReplace), blue(blackReplace)]),
                    }
                } else {
                    continue;
                }
            }

            if (CONFIG.boost === 'dark') {
                p.average = 255 - p.average;
            }

            let isosSideWidth = map(p.average, 0, 100, 1, settings.isoMaxMultiplier);
            let isosSizeMultipler = map(p.average, 0, 255, 1, settings.isoMaxMultiplier);
            let isoLengthMultipler = map(p.average, 0, 255, 1, settings.isoMaxMultiplier);


            cg.noStroke();
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




            if (settings.circular && vectorsAreInsideBounds(iso) && HELPER.rollADie(4) === 4) {

                cg.stroke(p.red, p.green, p.blue, map(fxrand(), 0, 1, 0.25, 0.50));
                cg.noFill();
                cg.strokeWeight(round(map(fxrand(), 0, 1, 1, 3)));

                // build the top
                cg.beginShape();
                cg.vertex(iso.g.x, iso.g.y);
                cg.vertex(iso.c.x, iso.c.y);
                cg.vertex(iso.d.x, iso.d.y);
                cg.vertex(iso.e.x, iso.e.y);
                cg.endShape(CLOSE)

                // iso.buildLeftFace();
                cg.beginShape();
                cg.vertex(iso.a.x, iso.a.y);
                cg.vertex(iso.b.x, iso.b.y);
                cg.vertex(iso.c.x, iso.c.y);
                cg.vertex(iso.g.x, iso.g.y);
                cg.endShape(CLOSE)

                //iso.buildRightFace();
                cg.beginShape();
                cg.vertex(iso.a.x, iso.a.y);
                cg.vertex(iso.g.x, iso.g.y);
                cg.vertex(iso.e.x, iso.e.y);
                cg.vertex(iso.f.x, iso.f.y);
                cg.endShape(CLOSE)
            }

            if (vectorsAreInsideBounds(iso, settings.circular)) {
                cg.noStroke();
                cg.fill(
                    p.red * settings.faceLightness.top,
                    p.green * settings.faceLightness.top,
                    p.blue * settings.faceLightness.top,
                    1
                );
                // build the top
                cg.beginShape();
                cg.vertex(iso.g.x, iso.g.y);
                cg.vertex(iso.c.x, iso.c.y);
                cg.vertex(iso.d.x, iso.d.y);
                cg.vertex(iso.e.x, iso.e.y);
                cg.endShape(CLOSE)

                cg.fill(
                    p.red * settings.faceLightness.left,
                    p.green * settings.faceLightness.left,
                    p.blue * settings.faceLightness.left,
                    1
                );
                // iso.buildLeftFace();
                cg.beginShape();
                cg.vertex(iso.a.x, iso.a.y);
                cg.vertex(iso.b.x, iso.b.y);
                cg.vertex(iso.c.x, iso.c.y);
                cg.vertex(iso.g.x, iso.g.y);
                cg.endShape(CLOSE)

                cg.fill(
                    p.red * settings.faceLightness.right,
                    p.green * settings.faceLightness.right,
                    p.blue * settings.faceLightness.right,
                    1
                );
                //iso.buildRightFace();
                cg.beginShape();
                cg.vertex(iso.a.x, iso.a.y);
                cg.vertex(iso.g.x, iso.g.y);
                cg.vertex(iso.e.x, iso.e.y);
                cg.vertex(iso.f.x, iso.f.y);
                cg.endShape(CLOSE)
            }

        }


    }

    let dots = [];
    for (let x = 0; x < cg.width; x++) {
        for (let y = 0; y < cg.height; y++) {
            if (HELPER.rollADie(15) === 15) {
                dots.push(createVector(x, y));
            }
        }
    }
    cg.noStroke();


    cg.blendMode(OVERLAY);

    cg.noFill();
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        cg.strokeWeight(1);
        if (HELPER.flipACoin()) {
            cg.stroke(0, 0, 0, .75);
        } else {
            cg.stroke(255, 255, 255, .75);
        }
        cg.point(dot.x, dot.y);
    }

    image(cg, 0, 0, pos.cW, pos.cH);

    fxpreview();
};

window.keyPressed = () => {

    if (key === "s") {
        save(saveFileName());
    }
}
