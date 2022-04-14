const helper = new Helpers();
const colorClass = new Colors();
const pixelD = 1;
const cols = 5;
const rows = 5;
const cW = 350;
const cH = 350;
const canvasWidth = cols * cW;
const canvasHeight = rows * cH;
let data;
let cells = [];
let extraLargeCells = [];
let colorList;
let hexColors;
let pallet = [];
let saveId = helper.makeid(10);
let saveCount = 0;
let pallets;

function preload() {
    data = loadJSON("../../data/palettes.json");

}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    colorMode(HSL, 359, 100, 100, 100);
    pixelDensity(pixelD);
    pallets = data.palettes;
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
    colorList = [];
    pallet = [];
    for (const item of hexColors) {
        let rgb = colorClass.HEXtoRGB(item);
        colorList.push(rgb);
        let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        pallet.push(hsl);
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

    doDither();

}

function doDither() {
  // set black and white

  let bwLoops = ceil(random(5,10));
  let bwHalf = ceil(bwLoops/2);
  let blacks = [];
  let oldPixels = [];
  let caught = [];
  for (var loop = 0; loop < bwLoops; loop++) {

    let bwX = random(canvasWidth);
    let bwY = random(canvasHeight);
    let bwW = canvasWidth * random(0.05, 0.25);
    // console.log(bwX, bwY, bwW);
    // continue;

    loadPixels();
    for (var y = 0; y < canvasHeight; y+=bwLoops) {
      for (var x = 0; x < canvasWidth; x+=bwLoops) {
        let index = (x + y * canvasWidth) * 4;
        if (caught.indexOf(index) >= 0) {
          continue;
        }
        let red   = pixels[index];
        let green = pixels[index + 1];
        let blue  = pixels[index + 2];
        let average = helper.mean([red, green, blue]);
        let bw = average <= 255/2 ? 0 : 255
        if (bw !== 0) {
          continue;
        }
        let distFromCenter = dist(bwX, bwY, x, y);

        if(distFromCenter < bwW) {
          if (bw === 0) {
            blacks.push(createVector(x, y));
            caught.push(index);
          }
        }

      }
    }
    updatePixels();
  }



  for (var i = 0; i < blacks.length; i+=bwHalf) {
    let bgColor = random(pallet);
    fill(bgColor.h, bgColor.s, bgColor.l, 100);
    noStroke();
    ellipse(blacks[i].x, blacks[i].y, cW * 0.015, cH * 0.015);

  }
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

    let rollInitialFill = helper.rollADie(2);
    switch (rollInitialFill) {
        case 1:
            cellClass.cG.rect(0, 0, cGCell.w, cGCell.h);
            break;
        case 2:
            let pixelWidthVar = random([2, 4, 8])
            cellClass.pixelated(int(cols * pixelWidthVar), int(rows * pixelWidthVar));
            break;
          }

    cellClass.target(random(helper.range(4, 10)));
    image(cellClass.cG, cell.x, cell.y, cell.w, cell.h);
}
