const helper = new Helpers();
const colorClass = new Colors();
let pixelD;
let cols;
let rows;
let cW;
let cH;
let canvasWidth;
let canvasHeight;
let palletData;
let settings;
let settingsData;
let cells = [];
let extraLargeCells = [];
let hexColors;
let pallet = [];
let saveId = helper.makeid(10);
let saveCount = 0;
let pallets;


function preload() {
    palletData = loadJSON("../../data/palettes.json");
    settingsData = loadJSON("./settings.json");
}

function setup() {


    pallets = palletData.palettes;
    settings = settingsData.settings;
    if (settings.colorMode === 'HSL') {
        colorMode(HSL, 359, 100, 100, 100);
    } else if(settings.colorMode === 'RGB') {
        colorMode(RGB, 255, 255, 255, 1);
    }
    cols = settings.columns;
    rows = settings.rows;
    cW = settings.cellWidth;
    cH = settings.cellHeight;
    canvasWidth = cols * cW;
    canvasHeight = rows * cH;
    createCanvas(canvasWidth, canvasHeight);
    pixelDensity(settings.pixelDensity);
}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

function keyPressed() {
    if (key === 'Enter') {
        for (const item of cells) {
            item.used = false;
        }

        for (const item of extraLargeCells) {
            item.used = false;
        }

        redraw();
    }
    if (key === 's') {
        save(saveFileName());
    }
    if (key === "g") {
        // generate stack of images
        for (let i = 0; i < 10; i++) {
            clear();
            redraw();
            save(saveFileName());
        }

        return false;
    }
}

function draw() {
    noLoop();
    let generateCells = (new Cells(cols, rows, cW, cH)).populateCells(true, 10, 4);
    cells = generateCells[0];
    extraLargeCells = generateCells[1];

    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    pallet = [];
    for (const item of hexColors) {
        let rgb = colorClass.HEXtoRGB(item);
        if (settings.colorMode === 'HSL') {
            let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
            pallet.push(hsl);
        } else if(settings.colorMode === 'RGB') {
            pallet.push({r: rgb[0], g: rgb[0], b: rgb[2]});
        }

    }


    let bgColor = random(pallet);
    background(bgColor.h, bgColor.s, bgColor.l, 100);


    cells.forEach(item => {
        if (item.used === true) {
            return;
        }

        doCell(item);
    });

    extraLargeCells.forEach(item => {
        if (item.used === true) {
            return;
        }

        doCell(item);
    });



}

function doCell(cell) {
    cell.used = true;
    let randomizedPallet = helper.shuffleArray([...pallet]);
    let fc = randomizedPallet[0];

    randomizedPallet.shift();
    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let cellClass = new FillCells(cG, cGCell, randomizedPallet);
    cellClass.cG.colorMode(HSL, 359, 100, 100, 100);
    cellClass.cG.fill(fc.h, fc.s, fc.l, 100);
    cellClass.cG.noStroke();

    let rollInitialFill = helper.rollADie(3);
    let pixelWidthVar;
    if(settings.pixelFillRange.length === 2) {
      pixelWidthVar = random(helper.range(settings.pixelFillRange[0], settings.pixelFillRange[1]))
    } else {
      pixelWidthVar = random(settings.pixelFillRange)
    }
    switch (rollInitialFill) {
        case 1:
            cellClass.cG.rect(0, 0, cGCell.w, cGCell.h);
            break;
        case 2:
            cellClass.pixelated(int(cols * pixelWidthVar), int(rows * pixelWidthVar), 'circle');
            break;
        case 3:
            cellClass.pixelated(int(cols * pixelWidthVar), int(rows * pixelWidthVar));
            break;
          }
    let rollForFill = helper.rollADie(3);
    let fillRange;
    if (settings.cellFillRange.length === 2) {
      fillRange = random(helper.range(settings.cellFillRange[0], settings.cellFillRange[1]));
    } else {
      fillRange = random(settings.cellFillRange);
    }


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
    }

    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}
