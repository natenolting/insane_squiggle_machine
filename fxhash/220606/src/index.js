import "./p5.min.js";
import "./p5.collide2d.min.js";

const COLORS = new Colors();
const HELPER = new Helpers();

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
const BW_OR_MONO = fxrand();
const CONFIG = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    /** is this monochrome? **/
    monochrome: BW_OR_MONO < .15 ? true : false,

    /** is this monochrome? **/
    black_and_white: BW_OR_MONO > .85 ? true : false,

    /** number of rows & columns */
    cells: getCellSizeString(fxrand())
};

window.$fxhashFeatures = {
    ...CONFIG,
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
let saveId = HELPER.makeid(10);


function setupCells() {
    let e, s, c;

    settings.cells = [];
    settings.splits = [];
    settings.enlarges = [];
    settings.fullCells = [];


    let baseCells = _.sortBy(new Cells(settings.cols, settings.rows, settings.cellWidth, settings.cellHeight).populateCells(false)[0], ['row', 'col']);
    for (const element of baseCells) {

        let c = element;

        let splitOrEnlarge = HELPER.rollADie(settings.modifyOutOf);

        if (splitOrEnlarge === settings.enlargement.chance) {
            // enlarge
            let enlargementRange = HELPER.range(settings.enlargement.low, settings.enlargement.high);
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
            let splitRange = HELPER.range(settings.split.low, settings.split.high);
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
        if (HELPER.rollADie(settings.modifyOutOf) === settings.split.chance) {

            // split the large cell into smaller Cells
            let splitByRange = HELPER.range(settings.split.low, settings.split.high)
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
  let cfs = getCellsFromString(CONFIG.cells)
  // prep settings object
  settings = settingsData.settings;
  settings.canvasWidth = pos.s;
  settings.canvasHeight = pos.s;
  settings.cellWidth = pos.s / cfs;
  settings.cellHeight = pos.s / cfs;
  settings.cols = cfs;
  settings.rows = cfs;
  settings.colRowAverage = HELPER.average([settings.cols, settings.rows]);
}

function setupPallet() {
  // setup colors
  let pallets = palletData.pallets;

  if(CONFIG.black_and_white) {
    pallet.i = 0;
    pallet.h = ['000000', 'ffffff'];
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

function setupPalletRGAndHSL()
{
  pallet.rgb = [];
  pallet.hsl = [];
  for (var i = 0; i < pallet.h.length; i++) {
      let h = pallet.h[i];
      pallet.rgb.push(COLORS.HEXtoRGB(h));
      let rgb = pallet.rgb[pallet.rgb.length - 1];
      pallet.hsl.push(COLORS.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }
}

function doBackground(cell, opacity = 100) {
    cell.used = true;
    let fc = pallet.hsl[0];
    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let fillCell = new FillCells(cG, cGCell, pallet.hsl, opacity);
    fillCell.cG.colorMode(HSL, 359, 100, 100, 100);
    fillCell.cG.noStroke();
    fillCell.cG.fill(fc.h, fc.s, fc.l, fillCell.opacity);

    let pixelWidthVar, pixelWidthRange;
    if (settings.pixelFillRange.length === 2) {
        pixelWidthRange = HELPER.range(settings.pixelFillRange[0], settings.pixelFillRange[1]);
    } else {
        pixelWidthRange = settings.pixelFillRange;

    }
    pixelWidthVar = pixelWidthRange[round(map(fxrand(),0,1,0, pixelWidthRange.length - 1))];

    let rollInitialFill = HELPER.rollADie(4);

    switch (rollInitialFill) {
        case 1:
            fillCell.cG.rect(0, 0, cGCell.w, cGCell.h);
            break;
        case 2:
            fillCell.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar), 'circle');
            break;
        case 3:
            fillCell.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar), 'diamond');
            break;
        case 4:
            fillCell.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar));
            break;
    }

    image(fillCell.cG, cell.x, cell.y, cell.w, cell.h);
}

function doCell(cell, opacity = 100) {
    let randomizedPallet = HELPER.shuffleArray([...pallet.hsl]);
    let bgFill = randomizedPallet[0];

    if (randomizedPallet.length > 2) {
    randomizedPallet.shift();
    }
    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let fillCell = new FillCells(cG, cGCell, randomizedPallet, opacity);
    fillCell.cG.colorMode(HSL, 359, 100, 100, 100);
    fillCell.cG.noStroke();
    fillCell.cG.fill(0, 0, 0, fillCell.opacity);

    //let rollForFill = 6;
    let fillRange, fillRangeRange;
    if (settings.cellFillRange.length === 2) {
        fillRangeRange = HELPER.range(settings.cellFillRange[0], settings.cellFillRange[1]);
    } else {
        fillRangeRange = settings.cellFillRange;
    }
    fillRange = fillRangeRange[round(map(fxrand(), 0, 1, 0, fillRangeRange.length - 1))];

    let pixelWidthVar, pixelWidthRange;
    if (settings.pixelFillRange.length === 2) {
        pixelWidthRange = HELPER.range(settings.pixelFillRange[0], settings.pixelFillRange[1]);
    } else {
        pixelWidthRange = settings.pixelFillRange;

    }
    pixelWidthVar = pixelWidthRange[round(map(fxrand(),0,1,0, pixelWidthRange.length - 1))];

    let rollForFill = HELPER.rollADie(8);
    switch (rollForFill) {
        case 1:
            fillCell.target(fillRange);
            break;
        case 2:
            fillCell.diamond(fillRange);
            break;
        case 3:
            fillCell.square(fillRange);
            break;
        case 4:
            fillCell.cheerio();
            break;
        case 5:
            fillCell.cross(fillRange);
            break;
        case 6:
            fillCell.times(fillRange);
            break;
        case 7:
            if (CONFIG.cells === 'large' || CONFIG.cells === 'xlarge') {
              fillCell.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar), 'circle');
            } else {
              fillCell.target(fillRange);
            }
            break;
        case 8:
            if (CONFIG.cells === 'large' || CONFIG.cells === 'xlarge') {
              fillCell.pixelated(int(settings.colRowAverage * pixelWidthVar), int(settings.colRowAverage * pixelWidthVar), 'diamond');
            } else {
              fillCell.cheerio();
            }
            break;
    }

    image(fillCell.cG, cell.x, cell.y, cell.w, cell.h);
}

function init() {
    noiseSeed(CONFIG.noiseSeed);

    setupPosition();
    setupSettings();

    setupPallet();

    pixelDensity(4);

    // prep cells
    setupCells();


}

window.preload = () => {
    palletData = loadJSON("./palettes.json");
    settingsData = loadJSON("./settings.json");
}

window.setup = () => {
    init();
    colorMode(HSL, 359, 100, 100, 100);
    createCanvas(pos.w, pos.h);
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

    // one in one hundred chance of doing a big spot in the middle
    let bbRoll = HELPER.rollADie(100);
    if (bbRoll === 100) {
      let bb = new Cell(0, 0, settings.cellWidth, settings.cellHeight, settings.canvasWidth - settings.cellWidth * 2, settings.canvasHeight - settings.cellHeight * 2, false, 0);
      doCell(bb);
    }

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
