import "./p5.min.js";

const COLOR = new Colors();
const HELPER = new Helpers();
// 16x20 300 dpi
const CANVAS_SMALL = 4800;
const CANVAS_LARGE = 6000;
const X_SMALL = 'tightest';
const SMALL = 'tight';
const MEDIUM = 'middle';
const LARGE = 'loose';
const X_LARGE = 'loosest';
const SIDE_HEIGHT_MULTIPLIER = 28 / 49;
const PX_DENSITY = 1;
const NOISE_SEED = (fxrand() * 100_000) >> 0
const PALLET_ID = Math.floor(fxrand() * 4200);
const TRANSPARENT = false;
const DEBUG = false;
const RETRY_LIMIT = 30;
const MIN_NON_WHITE = 0.40; 

const CONFIG = {
    noiseSeed: NOISE_SEED,
    /** number of rows & columns */
    cells: getCellSizeString(fxrand()),
    /** color pallet */
    pallet: PALLET_ID,
    /** canvas orientation, 0 is landscape, 1 is portrait */
    orientation: Math.round(fxrand()),
    /** density setting */
    density: fxrand(),
};

function getCellSizeString(value) {
    if (value > 0 && value <= .15) {
        return X_SMALL
    }
    if (value > .15 && value <= .35) {
        return SMALL
    }
    if (value > .35 && value <= .55) {
        return MEDIUM
    }
    if (value > .55 && value <= .85) {
        return LARGE
    }
    if (value > .85) {
        return X_LARGE
    }
}

function getCellsFromString(string) {
    let c;
    let base = 100;
    switch (string) {
        case X_LARGE:
            c = Math.floor(base * .75)
            break;
        case LARGE:
            c = Math.floor(base * 1.5)
            break;
        case MEDIUM:
            c = Math.floor(base * 2.25)
            break;
        case SMALL:
            c = Math.floor(base * 3)
            break;
        case X_SMALL:
            c = Math.floor(base * 3.75)
            break;
    }
    return c;
}

const POS = {};

const pallet = {}

let palletData;
let settingsData;
let settings;
let pallets;
let cells;
let used;
let cg;
let nonWhitePixels;

function setupPosition() {

    let w, h;
    if (CONFIG.orientation) {
        h = window.innerHeight;
        w = CANVAS_SMALL * (window.innerHeight / CANVAS_LARGE);
        POS.w = CANVAS_SMALL;
        POS.h = CANVAS_LARGE;
    } else {
        w = window.innerWidth;
        h = CANVAS_SMALL * (window.innerWidth / CANVAS_LARGE);

        if (h > window.innerHeight) {
            let p = window.innerHeight / h;
            h = window.innerHeight;
            w = w * p;

        }
        POS.w = CANVAS_LARGE;
        POS.h = CANVAS_SMALL;
    }

    POS.cW = w;
    POS.cH = h;
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
        let amt;
        for (amt = .2; amt < 1; amt += .2) {
            let cc3 = lerpColor(cc1, cc2, amt);
            pallet.rgb.push(cc3.levels);
            rgb = pallet.rgb[pallet.rgb.length - 1];
            pallet.hsl.push(COLOR.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
        }
    }
}

function vectorsAreInsideBounds(iso, margin) {
    let deviation = map(CONFIG.density, 0, 1, margin * .1, margin * 1.5);
    let randMargin = margin + deviation;
    return iso.a.x > randMargin && iso.a.y > randMargin && iso.a.x < POS.w - randMargin && iso.a.y < POS.h - randMargin &&
        iso.b.x > randMargin && iso.b.y > randMargin && iso.b.x < POS.w - randMargin && iso.b.y < POS.h - randMargin &&
        iso.c.x > randMargin && iso.c.y > randMargin && iso.c.x < POS.w - randMargin && iso.c.y < POS.h - randMargin &&
        iso.d.x > randMargin && iso.d.y > randMargin && iso.d.x < POS.w - randMargin && iso.d.y < POS.h - randMargin &&
        iso.e.x > randMargin && iso.e.y > randMargin && iso.e.x < POS.w - randMargin && iso.e.y < POS.h - randMargin &&
        iso.f.x > randMargin && iso.f.y > randMargin && iso.f.x < POS.w - randMargin && iso.f.y < POS.h - randMargin &&
        iso.g.x > randMargin && iso.g.y > randMargin && iso.g.x < POS.w - randMargin && iso.g.y < POS.h - randMargin
}

function setupSettings() {

    settings = settingsData.settings;
    settings.config = CONFIG;
    settings.cellsPerSideW = Math.floor(getCellsFromString(CONFIG.cells));
    settings.cellsPerSideH = Math.floor(settings.cellsPerSideW * (POS.h / POS.w))
    settings.cellWidth = POS.w / settings.cellsPerSideW;
    settings.cellHeight = POS.h / settings.cellsPerSideH;
    settings.columns = settings.cellsPerSideW;
    settings.rows = settings.cellsPerSideH;
    settings.forgroundMargin = setupMargin(5);
    settings.backgroundMargin = setupMargin(2);
    settings.iterations = setupIterations();
    settings.sizeVariation = setupSizeAndLengthVariation(0.2, map(CONFIG.density, 0, 1, 0.3, 35));
    settings.lengthVariation = setupSizeAndLengthVariation(1, map(CONFIG.density, 0, 1, 5, 50));
    settings.cubeSideWidth = settings.cellWidth;
    settings.cubeSideHeight = settings.cellHeight * SIDE_HEIGHT_MULTIPLIER;
    settings.rollBetween = setupRollBetween();
    settings.pallet = pallet;

    settings.backgroundColor = setupBackgroundColor();

    if (DEBUG) {
        console.log(settings);
    }
}

function setupBackgroundColor() {

    let c = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    return color(c[0], c[1], c[2], 1);
}

function setupSizeAndLengthVariation(low, high) {
    let variations = HELPER.rollADie(500);
    let output = [];
    for (let i = 0; i < variations; i++) {
        output.push(map(fxrand(), 0, 1, low, HELPER.rollADie(Math.round(high))));
    }

    return output;
}

function setupIterations() {
    return floor(
        map(
            CONFIG.density,
            0,
            1,
            1000,
            2500
        )
    );
}

function setupMargin(offset = 4) {

    return Math.floor(HELPER.mean([POS.w, POS.h]) * offset * .006);
}

function setupRollBetween() {
    let directionsVertical = [1, 6, 7];
    let directionDiagonal = [2, 3, 4, 5];
    let numDirections = 100;
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
    pallets = palletData.pallets;
    setupPosition();
    setupPallet();
    setupSettings();
    setupCells();
    initUsed();
}

window.$fxhashFeatures = {
    ...CONFIG,
};

window.preload = () => {
    palletData = loadJSON("./palettes.json");
    settingsData = loadJSON("./settings.json");
}

window.setup = () => {
    noiseSeed(CONFIG.noiseSeed);
    colorMode(RGB, 255, 255, 255, 1);
    init();
    createCanvas(POS.cW, POS.cH);
    pixelDensity(PX_DENSITY);
};
let thisColorIndex = 0;
let sizeOfShapeIndex = 0;
let rollIndex = 0;
let lengthIndex = 0;


function initUsed() {
    used = {
        "pallet": [],
        "size": [],
        "roll": [],
        "length": [],
    };
}

function createBackground() {
    if (TRANSPARENT) {
        return
    }
    let bg = createGraphics(cg.width, cg.height);
    bg.colorMode(RGB, 255, 255, 255, 1);
    bg.pixelDensity(PX_DENSITY);
    bg.noStroke();
    bg.fill(settings.backgroundColor);
    bg.rect(0, 0, cg.width, cg.height);
    let thisColor = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    let roll = settings.rollBetween[HELPER.rollADie(settings.rollBetween.length) - 1];
    let randCells = HELPER.shuffleArray(cells).slice(0, Math.floor(cells.length/3));
    for (let i = 0; i < randCells.length; i++) {
        let c = randCells[i];
        let sizeOfShape = settings.sizeVariation[HELPER.rollADie(settings.sizeVariation.length) - 1];
        let length = settings.lengthVariation[HELPER.rollADie(settings.lengthVariation.length) - 1];
        let iso = new Isometric(c.x, c.y, settings.cubeSideWidth, settings.cubeSideHeight, sizeOfShape);
        iso.pickDirection(roll, length);
        bg.strokeWeight(3);
        bg.fill(settings.backgroundColor);

        if (vectorsAreInsideBounds(iso, settings.backgroundMargin)) {
            bg.stroke(
                thisColor[0],
                thisColor[1],
                thisColor[2],
                1
            );
            // Top Face
            bg.beginShape();
            bg.vertex(iso.g.x, iso.g.y);
            bg.vertex(iso.c.x, iso.c.y);
            bg.vertex(iso.d.x, iso.d.y);
            bg.vertex(iso.e.x, iso.e.y);
            bg.vertex(iso.g.x, iso.g.y);
            bg.endShape(CLOSE);

            // Left Face
            bg.beginShape();
            bg.vertex(iso.a.x, iso.a.y);
            bg.vertex(iso.b.x, iso.b.y);
            bg.vertex(iso.c.x, iso.c.y);
            bg.vertex(iso.g.x, iso.g.y);
            bg.vertex(iso.a.x, iso.a.y);
            bg.endShape(CLOSE);

            // Right Face
            bg.beginShape();
            bg.vertex(iso.a.x, iso.a.y);
            bg.vertex(iso.g.x, iso.g.y);
            bg.vertex(iso.e.x, iso.e.y);
            bg.vertex(iso.f.x, iso.f.y);
            bg.vertex(iso.a.x, iso.a.y);
            bg.endShape(CLOSE);

        }

    }
    settings.backgroundColor.setAlpha(.8);
    bg.fill(settings.backgroundColor);
    settings.backgroundColor.setAlpha(1);
    bg.rect(0, 0, bg.width, bg.height);

    return bg;

}

function fillTopFace(thisColor, str=false) {
    cg.fill(
        thisColor[0] * settings.faceLightness.top,
        thisColor[1] * settings.faceLightness.top,
        thisColor[2] * settings.faceLightness.top,
        settings.opacity
    );
    if(str) {
        cg.stroke(
            thisColor[0] * settings.faceLightness.top,
            thisColor[1] * settings.faceLightness.top,
            thisColor[2] * settings.faceLightness.top,
            settings.opacity
        );
    }

}

function fillLeftFace(thisColor, str=false) {
    cg.fill(
        thisColor[0] * settings.faceLightness.left,
        thisColor[1] * settings.faceLightness.left,
        thisColor[2] * settings.faceLightness.left,
        settings.opacity
    );
    if(str) {
        cg.stroke(
            thisColor[0] * settings.faceLightness.left,
            thisColor[1] * settings.faceLightness.left,
            thisColor[2] * settings.faceLightness.left,
            settings.opacity
        );
    }
}
function fillRightFace(thisColor, str=false) {
    cg.fill(
        thisColor[0] * settings.faceLightness.right,
        thisColor[1] * settings.faceLightness.right,
        thisColor[2] * settings.faceLightness.right,
        settings.opacity
    );
    if(str) {
        cg.stroke(
            thisColor[0] * settings.faceLightness.right,
            thisColor[1] * settings.faceLightness.right,
            thisColor[2] * settings.faceLightness.right,
            settings.opacity
        );
    }
}

function createForeground() {

    let startingPoint, cellIndex;


    cellIndex = HELPER.rollADie(cells.length - 1);

    startingPoint = cells[cellIndex];


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

    let iso = new Isometric(
        startingPoint.x,
        startingPoint.y,
        settings.cubeSideWidth,
        settings.cubeSideHeight,
        sizeOfShape
    );
    iso.pickDirection(roll, length);
    cg.strokeWeight(1);

    // if the current is not in bounds then try a smaller length first
    if (!vectorsAreInsideBounds(iso, settings.forgroundMargin)) {
        iso = new Isometric(
            startingPoint.x,
            startingPoint.y,
            settings.cubeSideWidth,
            settings.cubeSideHeight,
            sizeOfShape
        );
        iso.pickDirection(roll, length / 2);
    }

    if (vectorsAreInsideBounds(iso, settings.forgroundMargin)) {


        // Top Face
        fillTopFace(thisColor, true);
        cg.beginShape();
        cg.vertex(iso.g.x, iso.g.y);
        cg.vertex(iso.c.x, iso.c.y);
        cg.vertex(iso.d.x, iso.d.y);
        cg.vertex(iso.e.x, iso.e.y);
        cg.vertex(iso.g.x, iso.g.y);
        cg.endShape(CLOSE);


        // Left Face
        fillLeftFace(thisColor, true);
        cg.beginShape();
        cg.vertex(iso.a.x, iso.a.y);
        cg.vertex(iso.b.x, iso.b.y);
        cg.vertex(iso.c.x, iso.c.y);
        cg.vertex(iso.g.x, iso.g.y);
        cg.vertex(iso.a.x, iso.a.y);
        cg.endShape(CLOSE);

        fillRightFace(thisColor, true);
        cg.beginShape();
        cg.vertex(iso.a.x, iso.a.y);
        cg.vertex(iso.g.x, iso.g.y);
        cg.vertex(iso.e.x, iso.e.y);
        cg.vertex(iso.f.x, iso.f.y);
        cg.vertex(iso.a.x, iso.a.y);
        cg.endShape(CLOSE);
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
        if (lengthIndex >= settings.lengthVariation.length - 1) {
            lengthIndex = 0;
        } else {
            lengthIndex++;
        }
        length = settings.lengthVariation[lengthIndex];
        used.length.push(length);

        newIso.pickDirection(roll, length);

        if (!vectorsAreInsideBounds(newIso, settings.forgroundMargin)) {
            newIso = new Isometric(
                startingPoint.x,
                startingPoint.y,
                settings.cubeSideWidth,
                settings.cubeSideHeight,
                sizeOfShape
            );
            newIso.pickDirection(roll, length / 2);
        }

        // if we hit a wall reset the starting point/size
        if (!vectorsAreInsideBounds(newIso, settings.forgroundMargin)) {


            cellIndex = HELPER.rollADie(cells.length - 1);
            startingPoint = cells[cellIndex];


            if (sizeOfShapeIndex >= settings.sizeVariation.length - 1) {
                sizeOfShapeIndex = 0;
            } else {
                sizeOfShapeIndex++;
            }

            sizeOfShape = settings.sizeVariation[sizeOfShapeIndex];
            used.size.push(sizeOfShape);
            oldIso = new Isometric(
                startingPoint.x,
                startingPoint.y,
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

        // Top Face
        fillTopFace(thisColor, true);
        cg.beginShape();
        cg.vertex(newIso.g.x, newIso.g.y);
        cg.vertex(newIso.c.x, newIso.c.y);
        cg.vertex(newIso.d.x, newIso.d.y);
        cg.vertex(newIso.e.x, newIso.e.y);
        cg.vertex(newIso.g.x, newIso.g.y);
        cg.endShape(CLOSE);


        // Left Face
        fillLeftFace(thisColor, true);
        cg.beginShape();
        cg.vertex(newIso.a.x, newIso.a.y);
        cg.vertex(newIso.b.x, newIso.b.y);
        cg.vertex(newIso.c.x, newIso.c.y);
        cg.vertex(newIso.g.x, newIso.g.y);
        cg.vertex(newIso.a.x, newIso.a.y);
        cg.endShape(CLOSE);

        // Right Face
        fillRightFace(thisColor, true);
        cg.beginShape();
        cg.vertex(newIso.a.x, newIso.a.y);
        cg.vertex(newIso.g.x, newIso.g.y);
        cg.vertex(newIso.e.x, newIso.e.y);
        cg.vertex(newIso.f.x, newIso.f.y);
        cg.vertex(newIso.a.x, newIso.a.y);
        cg.endShape(CLOSE);

        oldIso = newIso;

    }
}

function createTexture() {
    let dots = [];
    let i;
    for (let x = 0; x < cg.width; x += 4) {
        for (let y = 0; y < cg.height; y += 4) {
            if (HELPER.rollADie(3) === 3) {
                dots.push(createVector(x, y));
            }
        }
    }
    cg.noStroke();

    cg.blendMode(OVERLAY);

    cg.noFill();
    for (i = 0; i < dots.length; i++) {
        let dot = dots[i];
        cg.strokeWeight(1);
        if (HELPER.flipACoin()) {
            cg.stroke(0, 0, 0, .25);
        } else {
            cg.stroke(255, 255, 255, .25);
        }
        cg.point(dot.x, dot.y);
    }
}

window.draw = () => {
    noLoop();
    cg = createGraphics(POS.w, POS.h);
    cg.colorMode(RGB, 255, 255, 255, 1);
    cg.pixelDensity(PX_DENSITY);

    // create foreground shapes
    createForeground();

    // Analyze the scene and check how much white space there is.
    // If it's over x% then add more pipes.
    nonWhitePixels = 0;
    let tempCg = createGraphics(cg.width * .1, cg.height * .1);
    tempCg.colorMode(RGB, 255, 255, 255, 1);
    tempCg.pixelDensity(PX_DENSITY);

    tempCg.image(cg, 0, 0, tempCg.width, tempCg.height);
    tempCg.loadPixels();
    for (let fy = 0; fy < tempCg.height; fy++) {
        for (let fx = 0; fx < tempCg.width; fx++) {

            if (tempCg.get(fx, fy)[3] === 255) {
                nonWhitePixels++;
            }
        }
    }
    if (DEBUG) {

        console.log(`first non-white: ${nonWhitePixels} (${nonWhitePixels / (tempCg.width * tempCg.height)})`);
    }

    for (let retries = 0; retries < RETRY_LIMIT; retries++) {

        if (nonWhitePixels > 0 && (nonWhitePixels / (tempCg.width * tempCg.height)) > MIN_NON_WHITE) {
            break;
        }

        nonWhitePixels = 0;
        tempCg.loadPixels();

        for (let sy = 0; sy < tempCg.height; sy++) {
            for (let sx = 0; sx < tempCg.width; sx++) {
                if (tempCg.get(sx, sy)[3] === 255) {
                    nonWhitePixels++;
                }
            }
        }

        if (DEBUG) {
            console.log(nonWhitePixels / (tempCg.width * tempCg.height));
        }
        if ((nonWhitePixels / (tempCg.width * tempCg.height)) < MIN_NON_WHITE) {
            if (DEBUG) {
                console.log('ADDED MORE PIPES');
            }
            createForeground();
            tempCg.image(cg, 0, 0, tempCg.width, tempCg.height);
        }
    }

    tempCg = createGraphics(cg.width, cg.height);
    tempCg.colorMode(RGB, 255, 255, 255, 1);
    tempCg.pixelDensity(PX_DENSITY);
    tempCg.image(cg, 0, 0, cg.width, cg.height);

    let bg = createBackground();
    cg.image(bg, 0, 0, cg.width, cg.height);
    cg.image(tempCg, 0, 0, cg.width, cg.height);
    //createTexture();


    //createTexture();
    image(cg, 0, 0, POS.cW, POS.cH);
    fxpreview();
}

let saveCount = 0;
let saveId = HELPER.makeid(10);

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {
    if (key === "s") {
        save(saveFileName());
    }
    if (key === "t") {
        createCanvas(POS.cW, POS.cH);
        image(cg, 0, 0, POS.cW, POS.cH);
    }
    if (key === "f") {
        createCanvas(POS.w, POS.h);
        image(cg, 0, 0, POS.w, POS.h);
    }
    if (key === "p") {
        createCanvas(POS.w / 2, POS.h / 2);
        image(cg, 0, 0, POS.w / 2, POS.h / 2);
    }

}
