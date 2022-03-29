const helper = new Helpers();
const colorClass = new Colors();
const canvasWidth = 800;
const canvasHeight = 800;
let pixelD = 1;
let cols = 5;
let rows = 5;
let cW = canvasWidth / cols;
let cH = canvasHeight / rows;
let data;
let cells = [];
let extraLargeCells = [];
let colorList;
let hexColors;
let pallet = [];
let saveId = helper.makeid(10);
let saveCount = 0;

function preload() {
    data = loadJSON("../../data/palettes.json");

}

function setup() {
    createCanvas(cols * cW, rows * cH);
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
        for (var i = 0; i < cells.length; i++) {
            cells[i].used = false;
        }

        for (var i = 0; i < extraLargeCells.length; i++) {
            extraLargeCells[i].used = false;
        }

        redraw();
    }
    if (key === 's') {
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

function draw() {
    noLoop();
    let generateCells = (new Cells(cols, rows, cW, cH)).populateCells(true, 10, 3);
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
}

function doCell(cell) {

    cell.used = true;
    let randomizedPallet = helper.shuffleArray([...pallet]);
    let fc = randomizedPallet[0];
    fill(fc.h, fc.s, fc.l, 100);
    randomizedPallet.shift();
    let cellClass = new FillCells(cell, randomizedPallet);
    let randCell = helper.rollADie(6);

    noStroke();
    if (helper.flipACoin()) {
        rect(cell.x, cell.y, cell.w, cell.h);
    } else {
        let pixelWidthVar = random([1, 2, 4, 8])
        cellClass.pixelated(int(cols * pixelWidthVar), int(rows * pixelWidthVar));
    }

    switch (randCell) {
        case 1:
            cellClass.triangle();
            break;
        case 2:
            cellClass.target();
            break;
        case 3:
            cellClass.diceRoll();
            break;
        case 4:
            cellClass.corner();
            break;
        case 5:
            cellClass.or(fc);
            break;
        case 6:
            cellClass.equal();
            break;
         // case 7:
         //     cellClass.arc();
         //    break;

        }
}
