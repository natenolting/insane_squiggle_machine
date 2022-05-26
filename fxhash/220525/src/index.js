import "./p5.min.js";

const colors = new Colors();
const helper = new Helpers();
const X_SMALL = 'tightest';
const SMALL = 'tight';
const MEDUIM = 'middle';
const LARGE = 'loose';
const X_LARGE = 'loosest';
const PX_DENSITY = 1;
const NOISE_SEED = (fxrand() * 100_000) >> 0
const PALLET_ID = Math.floor(fxrand() * 4200);
const CANVAS_WIDTH_MULTIPLIER = 1
const CANVAS_HEIGHT_MULTIPLIER = 1
const SIDE_HEIGHT_MULTIPLIER = 28 / 49;
const TRANSPARENT = false;
const DEBUG = true;
const BASE_CELLS_PER_SIDE = 15;
const BASE_CANVAS_WIDTH = 800;
const BASE_CANVAS_HEIGHT = 800;
const ENLARGED_CANVAS_WIDTH = 2500
const ENLARGED_CANVAS_HEIGHT = 2500
const BASE_RAMP = 0.0005;
const USE_ISOMETRIC = true
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
    let base = BASE_CELLS_PER_SIDE;
    switch (string) {
        case X_LARGE:
            c = base
            break;
        case LARGE:
            c = base * 2
            break;
        case MEDUIM:
            c = base * 3
            break;
        case SMALL:
            c = base * 4
            break;
        case X_SMALL:
            c = base * 5
            break;
    }
    return c;
}

const pos = {
    /** width */
    w: null,
    /** height */
    h: null,
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
let cells = [];
let colorIndex = 0;

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
    let h = ENLARGED_CANVAS_WIDTH;
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

    if (DEBUG) {
        console.log(pos);
    }

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

function setupSettings() {


    settings = settingsData.settings;
    settings.config = config;
    settings.cellsPerSide = getCellsFromString(config.cells);
    settings.cellWidth = pos.w / (settings.cellsPerSide * CANVAS_WIDTH_MULTIPLIER);
    settings.cellHeight = pos.h / (settings.cellsPerSide * CANVAS_HEIGHT_MULTIPLIER);
    settings.columns = settings.cellsPerSide * CANVAS_WIDTH_MULTIPLIER;
    settings.rows = settings.cellsPerSide * CANVAS_HEIGHT_MULTIPLIER;
    settings.margin = setupMargin();
    settings.pallet = pallet;
    settings.pixelDensityLow = 20
    settings.pixelDensityHigh = 30
    settings.pixelDensity = floor(map(fxrand(), 0, 1, settings.pixelDensityLow, settings.pixelDensityHigh));
    settings.isoMaxMultiplier = floor(map(settings.pixelDensity, settings.pixelDensityLow, settings.pixelDensityHigh, 5, 8));
    if (DEBUG) {
        console.log(settings);
    }
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

function setupMargin() {
    return floor(helper.mean([settings.cellWidth, settings.cellHeight]));
}

function init() {
    setupPosition();
    setupPallet();
    setupSettings();
    setupCells();
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
    createCanvas(pos.cW, pos.cH);
    pixelDensity(PX_DENSITY);
};

function incrimentColorIndex() {
    colorIndex++
    if (colorIndex >= pallet.rgb.length - 1) {
        colorIndex = 0;
    }
}

window.draw = () => {
    noLoop();
    fill(255, 255, 255, 1);
    noStroke();
    rect(0, 0, pos.cW, pos.cH)


    let cG = createGraphics(pos.w, pos.h);

    cG.colorMode(RGB, 255, 255, 255, 1);
    cG.pixelDensity(PX_DENSITY);
    // randomize the starting colorIndex
    colorIndex = floor(map(fxrand(), 0, 1, 0, pallet.rgb.length));
    //cG.fill(255, 255, 255, 1);
    cG.noStroke();
    cG.rect(0, 0, pos.w, pos.h)

    cG.angleMode(DEGREES);
    cG.push();
    let roll = helper.rollADie(10);
    roll = 1
    switch (roll) {
        case 5:
            cG.translate(pos.w, 0);
            cG.rotate(90)
            break;
        case 6:
            cG.translate(0, pos.h);
            cG.rotate(-90)
            break;
        case 9:
            cG.translate(-pos.w / 1.783, pos.h / 2);
            cG.rotate(-45)
            cG.scale(1.5);
            break;
        case 10:
            cG.translate(pos.w / 2.00, -pos.h / 1.783);
            cG.rotate(45)
            cG.scale(1.5);
            break;
        default:

    }

    let horizon = cG.createVector(0, pos.h / 2);
    // get three colors used for gradient
    let colorSet = [];
    for (let i = 0; i < 5; i++) {
        let c1 = pallet.rgb[colorIndex];
        let color1 = color(c1[0], c1[1], c1[2], 1)
        colorSet.push(color1)
        incrimentColorIndex()
    }

    let border = [];
    for (let i = 0; i < settings.columns / 2; i++) {
        let x = settings.cellWidth * i;
        let y = settings.cellHeight * i;
        let w = pos.w - ((settings.cellWidth * i) * 2);
        let h = dist(0, y, 0, horizon.y);
        let ramp = BASE_RAMP;
        for (var t = 0; t < h; t++) {
            let tlerpPercent = t / h + ramp;
            let cLerp = lerpColor(colorSet[0], colorSet[1], tlerpPercent);
            cG.noFill();
            cG.strokeWeight(1.5)
            cG.stroke(cLerp);
            cG.line(x, y + t, x + w, y + t);
            ramp+= BASE_RAMP
        }

        border.push({"x": x, "y": y, "h": h, "w": w})
    }

    for (let i = 0; i < settings.columns / 2; i++) {
        let x = settings.cellWidth * i;
        let y = settings.cellHeight * i + horizon.y - 1;
        let w = pos.w - ((settings.cellWidth * i) * 2);
        let h = dist(0, y, 0, pos.h);
        let ramp = BASE_RAMP;
        for (let t = 0; t < h; t++) {
            let tlerpPercent = t / h - ramp;
            let cLerp = cG.lerpColor(colorSet[1], colorSet[2], tlerpPercent);
            cG.noFill();
            cG.strokeWeight(1.5)
            cG.stroke(cLerp);
            cG.line(x, horizon.y + t, x + w, horizon.y + t);
            ramp+= BASE_RAMP;
        }
    }

    for (var i = 0; i < border.length; i++) {
      let b = border[i];
      let c = colorSet[3];
      c.setAlpha(0.05);
      cG.stroke(c);
      cG.strokeWeight(1);
      cG.blendMode(MULTIPLY);
      cG.beginShape();
      cG.vertex(b.x, b.y + b.h);
      cG.vertex(b.x, b.y);
      cG.vertex(b.x + b.w, b.y);
      cG.vertex(b.x + b.w, b.y + b.h);
      cG.vertex(b.x + b.w, b.y + b.h * 2);
      cG.vertex(b.x, b.y + b.h * 2);
      cG.endShape(CLOSE);
    }

    let c = colorSet[3];
    let lastBorder = border[border.length-1];
    c.setAlpha(0.05);
    cG.stroke(c);
    cG.strokeWeight(1);
    cG.blendMode(MULTIPLY);
    cG.line(0, 0, lastBorder.x, lastBorder.y);
    cG.line(pos.w, 0, lastBorder.x + lastBorder.w, lastBorder.y);
    cG.line(pos.w, pos.h, lastBorder.x + lastBorder.w, lastBorder.y + lastBorder.h * 2);
    cG.line(0, pos.h, lastBorder.x, lastBorder.y + lastBorder.h * 2)



    cG.blendMode(BLEND);
    cG.pop();
    if(USE_ISOMETRIC) {

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

    for (var i = 0; i < pixelPositions.length; i++) {

        let p = pixelPositions[i];

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

        iso.pickDirection(ceil(map(fxrand(), 0, 1, 1, 7)), isoLengthMultipler);

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

  image(cG,0,0,pos.cW,pos.cH);

}
let saveCount = 0;
let saveId = helper.makeid(10);

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.${TRANSPARENT ? 'png' : 'jpeg'}`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {
    if (key === "s") {
        save(saveFileName());
    }
}
