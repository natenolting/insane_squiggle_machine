const helper = new Helpers();
const colors = new Colors();
let palletData;
let settingsData;
let settings;
let pallets;
let pallet;
let margin;
let canvasWidth;
let canvasHeight;
let pixelD;
let cols;
let rows;
let cellWidth;
let cellHeight;
let cells = [];
let fullCells = [];
let splits = [];
let enlarges = [];
let modifyChance;
let splitsLow;
let splitsHigh;
let splitChance;
let enlargementLow;
let enlargementHigh;
let enlargmentChance;
let saveId = helper.makeid(10);
let saveCount = 0;
let colRowAverage;
let loops;

function preload() {
    palletData = loadJSON("../../data/20220408_palettes.json");
    settingsData = loadJSON("./settings.json");
}

function setup() {
    settings = settingsData.settings;
    margin = settings.margin;

    pixelD = 4;

    cols = settings.columns;
    rows = settings.rows;
    cellWidth = settings.cellWidth;
    cellHeight = settings.cellHeight;

    canvasWidth = cols * cellWidth + margin * 2;
    canvasHeight = rows * cellHeight + margin * 2;

    modifyChance = settings.modifyOutOf;
    splitsLow = settings.split.low;
    splitsHigh = settings.split.high;
    splitChance = settings.split.chance;

    enlargementLow = settings.enlargement.low;
    enlargementHigh = settings.enlargement.high;
    enlargmentChance = settings.split.chance;

    colRowAverage = helper.average([cols, rows]);

    loops = settings.loops;

    createCanvas(canvasWidth, canvasHeight);
    colorMode(HSL, 359, 100, 100, 100);
    pixelDensity(pixelD);
    //pallets = palletData.pallets;
    pallets = [['#ffffff', '#000000']];

}

setupCells = function () {
    let e;
    splits = [];
    enlarges = [];
    cells = [];
    let baseCells = _.sortBy(new Cells(cols, rows, cellWidth, cellHeight).populateCells(false)[0], ['row', 'col']);
    for (const element of baseCells) {

        let c = element;

        let splitOrEnlarge = helper.rollADie(modifyChance);

        if (splitOrEnlarge === enlargmentChance) {
            // enlarge
            let enlargementBy = random(helper.range(enlargementLow, enlargementHigh));
            let newEnl = new Cell(0, 0, c.x, c.y, c.w * enlargementBy, c.h * enlargementBy, false, enlarges.length + 1);

            let addEnl = true;
            for (e = 0; e < enlarges.length; e++) {
                let enl = enlarges[e];
                if (collideRectRect(enl.x, enl.y, enl.w, enl.h, newEnl.x, newEnl.y, newEnl.w, newEnl.h)) {
                    addEnl = false;
                    break;
                }
            }
            if (addEnl && c.x + c.w * enlargementBy < cols * cellWidth && c.y + c.h * enlargementBy < rows * cellHeight) {
                enlarges.push(newEnl);
                continue;
            }

        }

        if (splitOrEnlarge === splitChance) {
            // split
            let splitBy = random(helper.range(splitsLow, splitsHigh));
            let splitW = c.w / splitBy;
            let splitH = c.h / splitBy;
            for (let sc = 0; sc < c.w; sc += splitW) {
                for (let sr = 0; sr < c.h; sr += splitH) {
                    let spCell = new Cell(0, 0, c.x + sc, c.y + sr, splitW, splitH, 0, splits.length + 1);
                    let addSplit = true;
                    for (e = 0; e < enlarges.length; e++) {
                        let enl = enlarges[e];
                        if (collideRectRect(enl.x + 1, enl.y + 1, enl.w - 2, enl.h - 2, spCell.x, spCell.y, spCell.w, spCell.h)) {
                            addSplit = false;
                            break;
                        }
                    }
                    if (addSplit) {
                        splits.push(spCell);
                    }

                }
            }

        }

        let addCell = true
        // check if the cell collides with any of the
        // large cells. If it does then skip it.
        for (e = 0; e < enlarges.length; e++) {
            let enl = enlarges[e];
            if (collidePointRect(c.cX, c.cY, enl.x, enl.y, enl.w, enl.h)) {
                addCell = false;
                break;
            }
        }
        // check if the cell collides with any of the
        // small cells. If it does then skip it.
        for (s = 0; s < splits.length; s++) {
            let spl = splits[s];
            if (collidePointRect(spl.cX, spl.cY, c.x, c.y, c.w, c.h)) {
                addCell = false;
                break;
            }
        }

        if (addCell) {
            cells.push(c);
        }
    }
    for (let i = 0; i < enlarges.length; i++) {
        c = enlarges[i];
        if (helper.rollADie(modifyChance) === splitChance) {

            // split the large cell into smaller Cells
            let splitBy = random(helper.range(splitsLow, splitsHigh));
            let splitW = c.w / splitBy;
            let splitH = c.h / splitBy;
            for (let sc = 0; sc < c.w; sc += splitW) {
                for (let sr = 0; sr < c.h; sr += splitH) {
                    splits.push(new Cell(0, 0, c.x + sc, c.y + sr, splitW, splitH, 0, splits.length + 1));
                }
            }
            enlarges = _.filter(enlarges, function (o) {
                return o.index !== c.index;
            })
        }
    }
    // background large cells to fill in any blank space
    let fullCellAmount;
    if (canvasWidth > canvasHeight) {
      fullCellAmount = floor((canvasWidth - (margin * 2)) / (canvasHeight - (margin * 2)));
      fullCells = (new Cells(fullCellAmount, 1, canvasHeight, canvasHeight).populateCells(false)[0]);
      for (var i = 0; i < fullCells.length; i++) {
        fullCells[i].x+= (canvasWidth % canvasHeight) / 2
      }
    } else {
        fullCellAmount = floor((canvasHeight - (margin * 2)) / (canvasWidth - (margin * 2)));
        fullCells = (new Cells(1, fullCellAmount, canvasWidth, canvasWidth).populateCells(false)[0]);
        for (var i = 0; i < fullCells.length; i++) {
          fullCells[i].y+= (canvasHeight % canvasWidth) / 2
        }
    }

}

function draw() {
    noLoop();
    console.log(canvasWidth, canvasHeight);
    hexColors = pallets[helper.rollADie(_.size(pallets) - 1)];
    while (hexColors === undefined) {
        hexColors = pallets[helper.rollADie(_.size(pallets) - 1)];
    }
    colorList = [];
    pallet = [];
    for (const element of hexColors) {
        let rgb = colors.HEXtoRGB(element);
        let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        pallet.push(hsl);
    }

    setupCells();
    fill(0, 0, 100, 100);
    noStroke();
    rect(0, 0, canvasWidth, canvasHeight);
    push();
    translate(margin, margin);


    noFill();
    noStroke();

    // background large cells to fill in any blank space
    _.forEach(fullCells, function (c) {
        doBackground(c);
        doCell(c);
    });

    let allCells = cells.concat(enlarges, splits);
    _.forEach(allCells, function (c) {
        doCell(c);
    });



    pop();



}

function doBackground(cell, opacity = 100) {
    cell.used = true;

    let fc = pallet[0];

    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let cellClass = new FillCells(cG, cGCell, pallet, opacity);
    cellClass.cG.colorMode(HSL, 359, 100, 100, 100);
    cellClass.cG.noStroke();
    cellClass.cG.fill(fc.h, fc.s, fc.l, cellClass.opacity);

    //cellClass.cG.blendMode(MULTIPLY);

    let pixelWidthVar;
    if (settings.pixelFillRange.length === 2) {
        pixelWidthVar = random(helper.range(settings.pixelFillRange[0], settings.pixelFillRange[1]))
    } else {
        pixelWidthVar = random(settings.pixelFillRange)
    }

    let rollInitialFill = helper.rollADie(3);
    switch (rollInitialFill) {
        case 1:
            cellClass.cG.rect(0, 0, cGCell.w, cGCell.h);
            break;
        case 2:
            cellClass.pixelated(int(colRowAverage * pixelWidthVar), int(colRowAverage * pixelWidthVar), 'circle');
            break;
        case 3:
            cellClass.pixelated(int(colRowAverage * pixelWidthVar), int(colRowAverage * pixelWidthVar));
            break;
    }

    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}

function doCell(cell, opacity = 100) {
    let randomizedPallet = helper.shuffleArray([...pallet]);
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
    let fillRange;
    if (settings.cellFillRange.length === 2) {
        fillRange = random(helper.range(settings.cellFillRange[0], settings.cellFillRange[1]));
    } else {
        fillRange = random(settings.cellFillRange);
    }
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


function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.jpg`;
    saveCount++;
    return fileName;
}

function keyPressed() {
    if (key === "r") {
        window.location.reload(false);
    }

    if (key === "Enter") {
        clear();
        redraw();
    }

    if (key === "s") {
        save(saveFileName());
    }

    if (key === "g") {
        // generate stack of images
        for (var i = 0; i < 10; i++) {
            clear();
            redraw();
            save(saveFileName());
        }

        return false;
    }
}
