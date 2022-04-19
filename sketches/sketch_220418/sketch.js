const cc = new Colors();
const helper = new Helpers();

const cW = 32;
const cH = 32;
const cols = 25;
const rows = 25;
const pDensity = 2;
const mountainPeaks = 50;
const mountainRanges = 60;

const canvasWidth = cW * cols;
const canvasHeight = cH * rows;

const saveId = helper.makeid(10);
let saveCount = 0;
let colorList;
let hexColors;
let pallet = [];
let cells;
let fCells;
let pallets;

function preload() {
    data = loadJSON("../../data/palettes.json");

}

function setup() {
    colorMode(RGB, 255, 255, 255, 1);
    pixelDensity(pDensity);
    createCanvas(canvasWidth, canvasHeight);
    pallets = data.palettes;
}

function draw() {
    let i;
    noLoop();

    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    colorList = [];
    pallet = [];
    for (const item of hexColors) {
        let rgb = cc.HEXtoRGB(item);
        pallet.push(rgb);
    }

    cells = (new Cells(cols, rows, cW, cH)).populateCells(false)[0];

    // reverse the cells array and  remove the outer row/col
    fCells = _.remove(_.reverse(cells), function (o) {
        return o.col > 0
            && o.col < cols - 1
            && o.row > 0
            && o.row < rows - 1
    });

    let mountainRangeGroups = [];
    for (let mr = 0; mr < mountainRanges; mr++) {
        let mountainRange = [createVector(0, canvasHeight)];
        let inMountain = [];
        let mountainPeak = [];
        let mountainRangeFill = random(pallet);
        let mountainHeightLimit = mr / mountainPeaks / 2;

        // create the mountain range
        for (i = 1; i < mountainPeaks; i++) {

            mountainRange.push(
              createVector(
                random(canvasWidth * ((i - 1) / mountainPeaks), canvasWidth * (i / mountainPeaks)),
                random(cH + canvasHeight * mountainHeightLimit, canvasHeight ))
              );
        }
        mountainRange.push(createVector(canvasWidth, canvasHeight));

        // loop over each row and column
        for (let x = rows; x >= 0; x--) {
            for (let y = cols; y >= 0; y--) {
                let thisCell = _.find(fCells, {'col': x, 'row': y});

                if (thisCell !== undefined) {
                    thisCell.fill = mountainRangeFill;
                    let cellInMountain = helper.pointInPoly(mountainRange, createVector(thisCell.cX, thisCell.cY));
                    if (cellInMountain) {
                        inMountain.push(thisCell);
                    }
                    let cellOnNextRow = _.find(fCells, {'col': x, 'row': y + 1});
                    if (
                        cellOnNextRow !== undefined
                        && !cellInMountain
                        && helper.pointInPoly(mountainRange, createVector(cellOnNextRow.cX, cellOnNextRow.cY))
                    ) {
                        mountainPeak.push(thisCell);
                    }
                }

            }
        }

        mountainRangeGroups.push({mountain: inMountain, peaks: mountainPeak})

    }
    let tints = [];
    for (let mrg = 0; mrg < mountainRanges; mrg++) {
        tints.push((mrg + 1) / mountainRanges / 2);
    }
    let tintsRev = _.reverse(tints);
    let mountainColor = random(pallet);

    noStroke()
    fill(
      mountainColor[0] + (256 * (tintsRev[0]/2)),
      mountainColor[1] + (256 * (tintsRev[0]/2)),
      mountainColor[2] + (256 * (tintsRev[0]/2)),
      1);
    rect(1, 1, canvasWidth - 2, canvasHeight - 2);

    for (let mrg = 0; mrg < mountainRanges; mrg++) {
        let inMountain = mountainRangeGroups[mrg].mountain;
        let mountainPeak = mountainRangeGroups[mrg].peaks;
        let g = createGraphics(canvasWidth, canvasHeight);
        let red = mountainColor[0] + (256 * tintsRev[mrg]);
        let green = mountainColor[1] + (256 * tintsRev[mrg]);
        let blue = mountainColor[2] + (256 * tintsRev[mrg]);
        g.colorMode(RGB, 255, 255, 255, 1);
        g.noStroke();

        for (i = 0; i < inMountain.length; i++) {
            let c = inMountain[i];
            g.fill(red, green, blue, 1);
            g.rect(c.x, c.y, c.w, c.h);
            g.noStroke();
        }

        for (i = 0; i < mountainPeak.length; i++) {
            let c = mountainPeak[i];
            //let below = _.find(inMountain, {'col': c.col, 'row': c.row + 1})
            g.fill(red, green, blue, 1);
            g.arc(c.cX, c.y + c.h, c.w, c.h, PI, 0);

        }

        image(g, 0, 0, canvasHeight, canvasWidth);
    }

}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

function keyPressed() {
    if (key === 'Enter') {
        let i;
        for (i = 0; i < cells.length; i++) {
            cells[i].used = false;
        }

        for (i = 0; i < fCells.length; i++) {
            fCells[i].used = false;
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
