const helper = new Helpers();
const colorClass = new Colors();
let pixelD;
let cols;
let rows;
let colRowAverage;
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
let cyan =    '00AEEF';
let magenta = 'EC008C';
let yellow =  'FFF200';
let black =   '000004';
let colorOpacity;
let layers;


function preload() {
    settingsData = loadJSON("./settings.json");
}

function setup() {
    pallets = [[cyan, magenta, yellow, black]];
    settings = settingsData.settings;
    colorMode(HSL, 359, 100, 100, 100);
    cols = settings.columns;
    rows = settings.rows;
    colRowAverage = helper.average([cols, rows]);
    layers = settings.layers;
    cW = settings.cellWidth;
    cH = settings.cellHeight;
    colorOpacity = settings.colorOpacity;
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


    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];

    pallet = [];
    for (const item of hexColors) {
        let rgb = colorClass.HEXtoRGB(item);
        let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        pallet.push(hsl);

    }

    background(0, 0, 100, 100);

    let generateCells = (new Cells(cols, rows, cW, cH)).populateCells(settings.largeCells.build, settings.largeCells.chance, settings.largeCells.multiplier);
    // cells = generateCells[0];
    // extraLargeCells = generateCells[1];
    //
    // cells.forEach(item => {
    //     doBackground(item, colorOpacity);
    // });
    //
    // extraLargeCells.forEach(item => {
    //     doBackground(item, colorOpacity);
    // });



    for (var i = 1; i <= layers; i++) {
      generateCells = (new Cells(cols, rows, cW, cH)).populateCells(settings.largeCells.build, settings.largeCells.chance, settings.largeCells.multiplier);
      cells = generateCells[0];
      extraLargeCells = generateCells[1];

      cells.forEach(item => {
          doCell(item, colorOpacity);
      });

      extraLargeCells.forEach(item => {
          doCell(item, colorOpacity);
      });
    }

}
function doBackground(cell, opacity=100) {
  cell.used = true;
  let randomizedPallet = helper.shuffleArray([...pallet]);
  let fc = randomizedPallet[0];

  randomizedPallet.shift();
  let cG = createGraphics(cell.w, cell.h);
  let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
  let cellClass = new FillCells(cG, cGCell, randomizedPallet, opacity);
  cellClass.cG.colorMode(HSL, 359, 100, 100, 100);
  cellClass.cG.noStroke();
  cellClass.cG.fill(fc.h, fc.s, fc.l, cellClass.opacity);
  //cellClass.cG.blendMode(MULTIPLY);
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
          cellClass.pixelated(int(colRowAverage * pixelWidthVar), int(colRowAverage * pixelWidthVar), 'circle');
          break;
      case 3:
          cellClass.pixelated(int(colRowAverage * pixelWidthVar), int(colRowAverage * pixelWidthVar));
          break;
        }

    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}


function doCell(cell, opacity=100) {
    let randomizedPallet = helper.shuffleArray([...pallet]);
    let fc = randomizedPallet[0];

    randomizedPallet.shift();
    let cG = createGraphics(cell.w, cell.h);
    let cGCell = new Cell(0, 0, 0, 0, cell.w, cell.h, cell.used, cell.index);
    let cellClass = new FillCells(cG, cGCell, randomizedPallet, opacity);
    cellClass.cG.colorMode(HSL, 359, 100, 100, 100);
    cellClass.cG.noStroke();
    //cellClass.cG.blendMode(MULTIPLY);
    cellClass.cG.fill(fc.h, fc.s, fc.l, cellClass.opacity);

    let rollForFill = helper.rollADie(4);
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
      case 4:
          cellClass.cheerio();
      break;
    }



    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}
