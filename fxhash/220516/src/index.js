import "./p5.min.js";
import "./p5.collide2d.min.js";

const colors = new Colors();
const helper = new Helpers();

function getCellSizeString(value) {
  if (value < .2) { return "small" }
  if (value < .4) { return "medium" }
  if (value < .6) { return "large" }
  if (value < 1) { return "xlarge" }
}

function getCellsFromString(string) {
  let c;
  switch (string) {
    case "small":
      c = round(map(fxrand(), 0, 1, 16, 21))
      break;
    case "medium":
      c = round(map(fxrand(), 0, 1, 11, 16))
      break;
    case "large":
      c = round(map(fxrand(), 0, 1, 6, 11))
      break;
    case "xlarge":
      c = round(map(fxrand(), 0, 1, 2, 6))
      break;
    default:
      c = (3 + fxrand() * 10) >> 0;

  }
  return c;
}

const config = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    /** number of rows & columns */
    cells: getCellSizeString(fxrand()),

    /** noise scale  */
    noiseScale: 0.5 + fxrand() * 24,
};

window.$fxhashFeatures = {
    ...config,
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

let palletData;
let settingsData;
let settings;
let saveCount = 0;
let saveId = helper.makeid(10);


function setupCells() {
    let e, s, c;

    settings.cells = [];
    settings.splits = [];
    settings.enlarges = [];
    settings.fullCells = [];


    let baseCells = _.sortBy(new Cells(settings.cols, settings.rows, settings.cellWidth, settings.cellHeight).populateCells(false)[0], ['row', 'col']);
    for (const element of baseCells) {

        let c = element;

        let splitOrEnlarge = helper.rollADie(settings.modifyOutOf);

        if (splitOrEnlarge === settings.enlargement.chance) {
            // enlarge
            let enlargementRange = helper.range(settings.enlargement.low, settings.enlargement.high);
            let enlargementBy = enlargementRange[round(map(fxrand(), 0, 1, 0, enlargementRange.length - 1))];
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
            let splitBy = splitRange[round(map(fxrand(), 0, 1, 0, splitRange.length - 1))];
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
    for (let i = 0; i < settings.enlarges.length; i++) {
        c = settings.enlarges[i];
        if (helper.rollADie(settings.modifyOutOf) === settings.split.chance) {

            // split the large cell into smaller Cells
            let splitByRange = helper.range(settings.split.low, settings.split.high)
            let splitBy = splitByRange[round(map(fxrand(), 0, 1, 0, splitByRange.length - 1))];
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
        for (var i = 0; i < settings.fullCells.length; i++) {
            settings.fullCells[i].x += (settings.canvasWidth % settings.canvasHeight) / 2
        }
    } else {
        fullCellAmount = floor((settings.canvasHeight - (settings.margin * 2)) / (settings.canvasWidth - (settings.margin * 2)));
        settings.fullCells = (new Cells(1, fullCellAmount, settings.canvasWidth, settings.canvasWidth).populateCells(false)[0]);
        for (var i = 0; i < settings.fullCells.length; i++) {
            settings.fullCells[i].y += (settings.canvasHeight % settings.canvasWidth) / 2
        }
    }

}

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
  // pos.w = window.innerWidth;
  // pos.h = window.innerHeight;
  pos.s = Math.min(window.innerWidth, window.innerHeight);
  // pos.t = (pos.h - pos.s) / 2;
  // pos.l = (pos.w - pos.s) / 2;
  pos.t = 0;
  pos.l = 0;
}

function setupSettings() {
  let cfs = getCellsFromString(config.cells)
  // prep settings object
  settings = settingsData.settings;
  settings.canvasWidth = pos.s;
  settings.canvasHeight = pos.s;
  settings.cellWidth = pos.s / cfs;
  settings.cellHeight = pos.s / cfs;
  settings.cols = cfs;
  settings.rows = cfs;
  settings.colRowAverage = helper.average([settings.cols, settings.rows]);
}

function setupPallet() {
  // setup colors
  let pallets = palletData.pallets;
  pallet.i = floor(map(fxrand(), 0, 1, 0, pallets.length - 1));
  pallet.h = pallets[pallet.i];
  for (var i = 0; i < pallet.h.length; i++) {
      let h = pallet.h[i];
      pallet.rgb.push(colors.HEXtoRGB(h));
      let rgb = pallet.rgb[pallet.rgb.length - 1];
      pallet.hsl.push(colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }
}

function doBackground(cell, opacity = 100) {
    cell.used = true;
    let fc = pallet.hsl[0];
    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let cellClass = new FillCells(cG, cGCell, pallet.hsl, opacity);
    cellClass.cG.colorMode(HSL, 359, 100, 100, 100);
    cellClass.cG.noStroke();
    cellClass.cG.fill(fc.h, fc.s, fc.l, cellClass.opacity);

    let pixelWidthVar, pixelWidthRange;
    if (settings.pixelFillRange.length === 2) {
        pixelWidthRange = helper.range(settings.pixelFillRange[0], settings.pixelFillRange[1]);
    } else {
        pixelWidthRange = settings.pixelFillRange;

    }
    pixelWidthVar = pixelWidthRange[round(map(fxrand(),0,1,0, pixelWidthRange.length - 1))];

    let rollInitialFill = helper.rollADie(3);
    switch (rollInitialFill) {
        case 1:
            cellClass.cG.rect(0, 0, cGCell.w, cGCell.h);
            break;
        case 2:
            cellClass.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar), 'circle');
            break;
        case 3:
            cellClass.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar));
            break;
    }

    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}

function doCell(cell, opacity = 100) {
    let randomizedPallet = helper.shuffleArray([...pallet.hsl]);
    let bgFill = randomizedPallet[0];

    if (randomizedPallet.length > 2) {
    randomizedPallet.shift();
    }
    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let cellClass = new FillCells(cG, cGCell, randomizedPallet, opacity);
    cellClass.cG.colorMode(HSL, 359, 100, 100, 100);
    cellClass.cG.noStroke();
    cellClass.cG.fill(0, 0, 0, cellClass.opacity);

    //let rollForFill = 6;
    let fillRange, fillRangeRange;
    if (settings.cellFillRange.length === 2) {
        fillRangeRange = helper.range(settings.cellFillRange[0], settings.cellFillRange[1]);
    } else {
        fillRangeRange = settings.cellFillRange;
    }
    fillRange = fillRangeRange[round(map(fxrand(), 0, 1, 0, fillRangeRange.length - 1))]
    let rollForFill = helper.rollADie(6);
    switch (rollForFill) {
        case 1:
            cellClass.target(fillRange);
            break;
        case 2:
            cellClass.diamond(fillRange);
            break;
        case 3:
            cellClass.square(fillRange);
            break;
        case 4:
            cellClass.cheerio();
            break;
        case 5:
            cellClass.cross(fillRange);
            break;
        case 6:
            cellClass.times(fillRange);
            break;
    }

    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}

function init() {
    noiseSeed(config.noiseSeed);

    setupPosition();
    setupSettings();

    setupPallet();

    pixelDensity(4);

    frameRate(config.frameRate);

    // prep cells
    setupCells();

    colorMode(HSL, 359, 100, 100, 100);
    createCanvas(pos.w, pos.h);


    draw();
}

window.preload = () => {
    palletData = loadJSON("./palettes.json");
    settingsData = loadJSON("./settings.json");
}

window.setup = () => {
    init();
};

window.windowResized = () => {
  // clear();
  // init();
};

window.draw = () => {
    noLoop();
    background(0, 0, 100, 100);

    // top left of square
    translate(pos.l, pos.t);
    fill(0, 0, 100, 100);
    noStroke();
    rect(0, 0, pos.s, pos.s);

    // background large cells to fill in any blank space
    _.forEach(settings.fullCells, function (c) {
        doBackground(c);
        doCell(c);
    });

    let allCells = settings.cells.concat(settings.enlarges, settings.splits);
    _.forEach(allCells, function (c) {
        doCell(c);
    });

    fxpreview();
};

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.jpg`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {
    // if (key === "r") {
    //   clear();
    //   init();
    //   redraw();
    // }

    if (key === "s") {
        save(saveFileName());
    }
}
