import "./p5.min.js";

const colors = new Colors();
const helper = new Helpers();
const X_SMALL = 'tightest';
const SMALL = 'tight';
const MEDUIM = 'middle';
const LARGE = 'loose';
const X_LARGE = 'loosest';
const SIDE_HEIGHT_MULTIPLIER = 28/49;
const PX_DENSITY = 4;
const NOISE_SEED = (fxrand() * 100_000) >> 0
const PALLET_ID = Math.floor(fxrand() * 4200);
const DEBUG = false;

const config = {
    noiseSeed: NOISE_SEED,
    /** number of rows & columns */
    cells: getCellSizeString(fxrand()),
    pallet: PALLET_ID,

};


function getCellSizeString(value) {
    if (value <= .2) {
        return X_SMALL
    }
    if (value <= .4) {
        return SMALL
    }
    if (value <= .6) {
        return MEDUIM
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
    switch (string) {
        case X_LARGE:
            c = 50
            break;
        case LARGE:
            c = 75
            break;
        case MEDUIM:
            c = 100
            break;
        case SMALL:
            c = 125
            break;
        case X_SMALL:
            c = 150
            break;
    }
    return c;
}

const pos = {
    /** width */
    w: null,
    /** height */
    h: null,
    /** size */
    s: null,
    /** left */
    l: null,
    /** top */
    t: null,
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

let palletData;
let settingsData;
let settings;
let pallets;
let cells;
let used;

function setupPosition() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w > h) {
        pos.w = h;
        pos.h = h;
    } else {
        pos.w = w;
        pos.h = w;
    }
    pos.s = Math.min(window.innerWidth, window.innerHeight);
    pos.t = 0;
    pos.l = 0;
}

function setupPallet() {
    // setup colors
    pallets = palletData.pallets;
    pallet.i = PALLET_ID;
    pallet.h = pallets[pallet.i];
    for (const element of pallet.h) {
        pallet.rgb.push(colors.HEXtoRGB(element));
        let rgb = pallet.rgb[pallet.rgb.length - 1];
        pallet.hsl.push(colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
    }
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

function setupSettings() {


    settings = settingsData.settings;
    settings.config = config;
    settings.cellsPerSide = getCellsFromString(config.cells);
    settings.cellWidth = pos.w / settings.cellsPerSide;
    settings.cellHeight = pos.h / settings.cellsPerSide;
    settings.columns = settings.cellsPerSide;
    settings.rows = settings.cellsPerSide;
    settings.margin = setupMargin();
    settings.iterations = setupIterations();
    settings.sizeVariation = setupSizeAndLengthVariation();
    settings.lengthVariation = setupSizeAndLengthVariation();
    settings.cubeSideWidth = setupCubeSideWidth();
    settings.cubeSideHeight = setupCubeSideWidth() * SIDE_HEIGHT_MULTIPLIER;
    settings.rollBetween = setupRollBetween();
    settings.pallet = pallet;
    settings.backgroundOffset = backgroundOffset(config.cells);
    if (DEBUG) {
      console.log(settings);
    }
}

function setupCubeSideWidth() {
    return helper.mean([settings.cellWidth, settings.cellHeight])
}

function setupSizeAndLengthVariation() {
    let variations = helper.rollADie(20);
    let output = [];
    for (let i = 0; i < variations; i++) {
        output.push(helper.rollADie(20));
    }

    return output;
}

function setupIterations() {
    return floor(map(fxrand(), 0, 1, 500, 1000));
}

function setupMargin() {
    return floor(helper.mean([settings.cellWidth, settings.cellHeight]) * 3);
}

function setupRollBetween() {
    let directionsVertical = [1, 6, 7];
    let directionDiagonal = [2, 3, 4, 5];
    let numDirections = 7;
    let outputDirections = [];
    for (let i = 0; i < numDirections; i++) {

      let vertIndex = floor(map(fxrand(), 0, 1, 0, directionsVertical.length));
      outputDirections.push(directionsVertical[vertIndex]);

      let diagIndex = floor(map(fxrand(), 0, 1, 0, directionDiagonal.length));
      outputDirections.push(directionDiagonal[diagIndex]);

    }
    return outputDirections;
}

function setupCells() {
    let cellIndex = 0;
    cells = [];
    for (var y = 0; y < settings.rows; y++) {
      for (var x = 0; x < settings.columns; x++) {
        cells.push(new Cell(y, x, settings.cellWidth * x, settings.cellHeight * y, settings.cellWidth, settings.cellHeight, false, cellIndex));
        cellIndex++;
      }
    }
}


function init() {
    setupPosition();
    setupPallet();
    setupSettings();
    setupCells();
    initUsed();
}

function backgroundOffset(string) {
  let c;
  switch (string) {
      case X_LARGE:
          c = 6
          break;
      case LARGE:
          c = 4
          break;
      case MEDUIM:
          c = 3
          break;
      case SMALL:
          c = 3.25
          break;
      case X_SMALL:
          c = 2.75
          break;
  }
  return c;
}


window.$fxhashFeatures = {
    ...config,
};

window.preload = () => {
    palletData = loadJSON("./palettes.json");
    settingsData = loadJSON("./settings.json");
}

window.setup = () => {
    noiseSeed(config.noiseSeed);
    colorMode(RGB, 255, 255, 255, 1);
    init();
    createCanvas(pos.w, pos.h);
    pixelDensity(PX_DENSITY);
};
let thisColorIndex = 0;
let sizeOfShapeIndex = 0;
let rollIndex = 0;
let lengthIndex = 0;


function initUsed()
{
    used = {
        "pallet": [],
        "size": [],
        "roll": [],
        "length": [],
        "isos": 0,
    };
}

function createBackground() {
    fill(255, 255, 255, 1);
    rect(0, 0, pos.w, pos.h);
    noStroke();
    for(const element of cells) {

        if (element.index % settings.backgroundOffset === 0 && element.row > 1 && element.col > 0 && element.row < settings.rows - 1 && element.col < settings.columns - 1) {

            let newcolor = pallet.rgb[thisColorIndex];

            let smallIso = new Isometric(element.cX, element.y + element.h, element.w, element.h * SIDE_HEIGHT_MULTIPLIER, 1);
            fill(
                newcolor[0] * settings.faceLightness.top,
                newcolor[1] * settings.faceLightness.top,
                newcolor[2] * settings.faceLightness.top,
                settings.opacity
            );
            smallIso.buildTopFace();

            fill(
                newcolor[0] * settings.faceLightness.left,
                newcolor[1] * settings.faceLightness.left,
                newcolor[2] * settings.faceLightness.left,
                settings.opacity
            );
            smallIso.buildLeftFace();

            fill(
                newcolor[0] * settings.faceLightness.right,
                newcolor[1] * settings.faceLightness.right,
                newcolor[2] * settings.faceLightness.right,
                settings.opacity
            );
            smallIso.buildRightFace();
        }
        if (thisColorIndex >= pallet.rgb.length - 1) {
            thisColorIndex = 0;
        } else {
            thisColorIndex++;
        }

    }
    // overlay on background
    fill(255, 255, 255, .92);
    rect(0, 0, pos.w, pos.h);
}

function createForeground() {

    let cellIndex = helper.rollADie(cells.length - 1);

    let startingPoint = cells[cellIndex];

    if (thisColorIndex >= pallet.rgb.length - 1) {
        thisColorIndex = 0;
    } else {
        thisColorIndex++;
    }
    let thisColor = pallet.rgb[thisColorIndex];
    used.pallet.push(thisColorIndex);

    let sizeOfShape = settings.sizeVariation[sizeOfShapeIndex];
    used.size.push(sizeOfShape);

    let roll = settings.rollBetween[rollIndex];
    used.roll.push(roll);

    let length = settings.lengthVariation[lengthIndex];
    used.length.push(length);

    let iso = new Isometric(startingPoint.cX, startingPoint.cY, settings.cubeSideWidth, settings.cubeSideHeight, sizeOfShape);
    iso.pickDirection(roll, length);

    if (vectorsAreInsideBounds(iso)) {
        used.isos++;

        fill(
            thisColor[0] * settings.faceLightness.top,
            thisColor[1] * settings.faceLightness.top,
            thisColor[2] * settings.faceLightness.top,
            settings.opacity
        );
        iso.buildTopFace();

        fill(
            thisColor[0] * settings.faceLightness.left,
            thisColor[1] * settings.faceLightness.left,
            thisColor[2] * settings.faceLightness.left,
            settings.opacity
        );
        iso.buildLeftFace();

        fill(
            thisColor[0] * settings.faceLightness.right,
            thisColor[1] * settings.faceLightness.right,
            thisColor[2] * settings.faceLightness.right,
            settings.opacity
        );
        iso.buildRightFace();
    }
    thisColorIndex++;
    sizeOfShapeIndex++;
    rollIndex++;
    lengthIndex++;
    let oldIso = iso;
    for (let i = settings.iterations; i > 0; i--) {
        // starting point "g" seems to give the best result
        startingPoint = {x: oldIso.g.x, y: oldIso.g.y};
        if (rollIndex >= settings.rollBetween.length - 1) {
            rollIndex = 0;
        } else {
            rollIndex++;
        }
        roll = settings.rollBetween[rollIndex];
        used.roll.push(roll);

        let newIso = new Isometric(
            startingPoint.x,
            startingPoint.y,
            settings.cubeSideWidth,
            settings.cubeSideHeight,
            sizeOfShape
        );
        if(lengthIndex >= settings.lengthVariation.length - 1) {
            lengthIndex = 0;
        } else {
            lengthIndex++;
        }
        length = settings.lengthVariation[lengthIndex];
        used.length.push(length);

        newIso.pickDirection(roll, length);

        // if we hit a wall reset the starting point/size
        if (!vectorsAreInsideBounds(newIso)) {

            cellIndex = helper.rollADie(cells.length - 1);

            startingPoint = cells[cellIndex];

            if(sizeOfShapeIndex >= settings.sizeVariation.length - 1) {
                sizeOfShapeIndex = 0;
            } else {
                sizeOfShapeIndex++;
            }

            sizeOfShape = settings.sizeVariation[sizeOfShapeIndex];
            used.size.push(sizeOfShape);
            oldIso = new Isometric(
                startingPoint.cX,
                startingPoint.cY,
                settings.cubeSideWidth,
                settings.cubeSideHeight,
                sizeOfShape
            );
            // pick a new color
            if (thisColorIndex >= pallet.rgb.length - 1) {
                thisColorIndex = 0;
            } else {
                thisColorIndex++;
            }
            thisColor = pallet.rgb[thisColorIndex];
            used.pallet.push(thisColorIndex);
            continue;
        }
        used.isos++;
        fill(
            thisColor[0] * settings.faceLightness.top,
            thisColor[1] * settings.faceLightness.top,
            thisColor[2] * settings.faceLightness.top,
            settings.opacity
        );
        newIso.buildTopFace();

        fill(
            thisColor[0] * settings.faceLightness.left,
            thisColor[1] * settings.faceLightness.left,
            thisColor[2] * settings.faceLightness.left,
            settings.opacity
        );
        newIso.buildLeftFace();

        fill(
            thisColor[0] * settings.faceLightness.right,
            thisColor[1] * settings.faceLightness.right,
            thisColor[2] * settings.faceLightness.right,
            settings.opacity
        );
        newIso.buildRightFace();

        oldIso = newIso;

    }
}

window.draw = () => {
    noStroke();
    // create background
    createBackground();
    // create foreground shapes
    createForeground();
    if (DEBUG) {
        console.log('Isometrics used before reset:', used.isos);
    }
    let limitRetries = 10;
    let retries = 0;
    while(used.isos < 25) {
        erase();
        rect(0, 0, pos.w, pos.h);
        noErase();
        init();
        createBackground();
        createForeground();
        retries++;
        if(retries >= limitRetries) {
            break;
        }
    }

    if (DEBUG) {
      console.log('Isometrics used:', used.isos);
      console.log('pallet index used:', _.uniq(used.pallet).sort(function (a, b) {
          return a - b;
      }));
      console.log('sizes used:', _.uniq(used.size).sort(function (a, b) {
          return a - b;
      }));
      console.log('rolls used:', _.uniq(used.roll).sort(function (a, b) {
          return a - b;
      }));
      console.log('lengths used:', _.uniq(used.length).sort(function (a, b) {
          return a - b;
      }));
    }
    noLoop();
    fxpreview();
}
let saveCount = 0;
function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.jpg`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {
    if (key === "s") {
        save(saveFileName());
    }
}
