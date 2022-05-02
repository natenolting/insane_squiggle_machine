const helper = new Helpers();
const colors = new Colors();

let palletsData;
let settingsData;
let pallets;
let pallet;
let settings;
let cellWidth;
let cellHeight;
let columns;
let rows;
let cells;
let canvasWidth;
let canvasHeight;
let margin;
let transparent;
let gradientStrokeWidth;
let gradientTightness;

let saveId = helper.makeid(10);
let saveCount = 0;

function preload() {
    palletsData = loadJSON("../../data/20220408_palettes.json");
    settingsData = loadJSON("./settings.json");
}

function setup() {
  pixelDensity(1)
    pallets = palletsData.pallets;
    settings = settingsData.settings

    cellWidth = settings.cellWidth;
    cellHeight = settings.cellHeight;
    columns = settings.columns;
    rows = settings.rows;
    margin = settings.margin;

    canvasWidth = cellWidth * columns + (margin * 2);
    canvasHeight = cellHeight * rows + (margin * 2);

    gradientStrokeWidth = settings.gradient.strokeWidth;
    gradientTightness = settings.gradient.tightness;


    cells = (new Cells(columns, rows, cellWidth, cellHeight)).populateCells(false)[0];
    transparent = settings.transparent;
    colorMode(RGB, 255, 255, 255, 1);
    createCanvas(canvasWidth, canvasHeight);

}

function draw() {
    noLoop();
    if (!transparent) {
        noStroke();
        background(255, 255, 255, 1);
        fill(255, 255, 255, 1);
        rect(0, 0, canvasWidth, canvasHeight);
    }
    let hexColors = pallets[helper.rollADie(_.size(pallets) - 1)];
    pallet = [];
    for (const item of hexColors) {
        let rgb = colors.HEXtoRGB(item);
        pallet.push(rgb);
    }

    push();
    translate(margin, margin);

    // add a pallet to each cell
    _.forEach(cells, function (c) {
        c.fill = random(pallet);
    });

    for (var i = 0; i < cells.length; i++) {
        let thisCell = cells[i];
        let thisColor = thisCell.fill;
        // fill(thisColor[0], thisColor[1], thisColor[2], 100);
        // rect(thisCell.x, thisCell.y, thisCell.w, thisCell.h);
    }

    for (var i = 0; i < 10000; i++) {
        let index = ceil(random(cells.length - 1));

        helper.flipACoin()
            ? horizontalGradient(index, gradientTightness, gradientStrokeWidth)
            : verticalGradient(index, gradientTightness, gradientStrokeWidth);
        // availible = _.filter(cells, {'used': false});
        // console.log(availible);
    }

    // _.forEach(_.filter(cells, {'used': false}), function(e){
    //   let thisColor = e.fill;
    //   fill(thisColor[0], thisColor[1], thisColor[2], 100);
    //   noStroke();
    //   rect(e.x + gradientStrokeWidth, e.y + gradientStrokeWidth, e.w - gradientStrokeWidth * 2, e.h - gradientStrokeWidth * 2, gradientStrokeWidth * 2);
    // });


    pop();

}


function horizontalGradient(index, tightness = 0.01, strokeW = 1) {
    let randomCell = cells[index];
    let leftRandomIndex = _.findIndex(cells, {'row': randomCell.row, 'col': randomCell.col - 1});
    let rightRandomIndex = _.findIndex(cells, {'row': randomCell.row, 'col': randomCell.col + 1});

    let from, to, fromColor, toColor, lrpColor, leftRandomCell, rightRandomCell;
    if (
        !randomCell.used
        && (cells[leftRandomIndex] !== undefined && !cells[leftRandomIndex].used)
        && (cells[rightRandomIndex] !== undefined && !cells[rightRandomIndex].used)
    ) {
        let i;
        leftRandomCell = cells[leftRandomIndex];
        rightRandomCell = cells[rightRandomIndex];
        cells[index].used = true;
        cells[leftRandomIndex].used = true;
        cells[rightRandomIndex].used = true;

        // lerp from left to center of middle cell;
        for (i = 0; i < 1; i += tightness) {
            from = p5.Vector.lerp(
                createVector(leftRandomCell.x, leftRandomCell.y),
                createVector(randomCell.cX, randomCell.y),
                i
            );

            to = p5.Vector.lerp(
                createVector(leftRandomCell.x, leftRandomCell.y + leftRandomCell.h),
                createVector(randomCell.cX, randomCell.y + randomCell.h),
                i
            );

            fromColor = color(leftRandomCell.fill[0], leftRandomCell.fill[1], leftRandomCell.fill[2]);
            toColor = color(randomCell.fill[0], randomCell.fill[1], randomCell.fill[2]);
            lrpColor = lerpColor(fromColor, toColor, i);
            noFill();
            stroke(lrpColor);
            strokeCap(SQUARE);
            strokeWeight(strokeW);
            line(from.x, from.y, to.x, to.y);

        }
        for (i = 0; i < 1; i += tightness) {
            from = p5.Vector.lerp(
                createVector(randomCell.cX, randomCell.y),
                createVector(rightRandomCell.x + rightRandomCell.w, rightRandomCell.y),
                i
            );

            to = p5.Vector.lerp(
                createVector(randomCell.cX, randomCell.y + randomCell.h),
                createVector(rightRandomCell.x + rightRandomCell.w, rightRandomCell.y + rightRandomCell.h),
                i
            );
            fromColor = color(randomCell.fill[0], randomCell.fill[1], randomCell.fill[2]);
            toColor = color(rightRandomCell.fill[0], rightRandomCell.fill[1], rightRandomCell.fill[2]);

            lrpColor = lerpColor(fromColor, toColor, i);
            noFill();
            stroke(lrpColor);
            strokeCap(SQUARE);
            strokeWeight(strokeW);
            line(from.x, from.y, to.x, to.y);
        }
    }
}

function verticalGradient(index, tightness = 0.01, strokeW = 1) {
    let randomCell = cells[index];
    let belowRandomIndex = _.findIndex(cells, {'row': randomCell.row + 1, 'col': randomCell.col});
    let aboveRandomIndex = _.findIndex(cells, {'row': randomCell.row - 1, 'col': randomCell.col});
    let from, to, fromColor, toColor, lrpColor, aboveRandomCell, belowRandomCell;
    if (
        !randomCell.used
        && (cells[belowRandomIndex] !== undefined && !cells[belowRandomIndex].used)
        && (cells[aboveRandomIndex] !== undefined && !cells[aboveRandomIndex].used)
    ) {
        let i;
        cells[index].used = true;
        cells[belowRandomIndex].used = true;
        cells[aboveRandomIndex].used = true;

        aboveRandomCell = cells[aboveRandomIndex];
        belowRandomCell = cells[belowRandomIndex];


        // lerp from above to center of middle cell;
        for (i = 0; i < 1; i += tightness) {
            from = p5.Vector.lerp(
                createVector(aboveRandomCell.x, aboveRandomCell.y),
                createVector(randomCell.x, randomCell.y + randomCell.h / 2),
                i
            );
            to = p5.Vector.lerp(
                createVector(aboveRandomCell.x + aboveRandomCell.w, aboveRandomCell.y),
                createVector(randomCell.x + randomCell.w, randomCell.y + randomCell.h / 2),
                i
            );

            fromColor = color(aboveRandomCell.fill[0], aboveRandomCell.fill[1], aboveRandomCell.fill[2]);
            toColor = color(randomCell.fill[0], randomCell.fill[1], randomCell.fill[2]);

            lrpColor = lerpColor(fromColor, toColor, i);

            noFill();
            stroke(lrpColor);
            strokeCap(SQUARE);
            strokeWeight(strokeW);
            line(from.x, from.y, to.x, to.y);

        }
        // lerp from center of middle cell to the bottom of the below cellIndex
        for (i = 0; i < 1; i += tightness) {
            from = p5.Vector.lerp(
                createVector(randomCell.x, randomCell.y + randomCell.h / 2),
                createVector(belowRandomCell.x, belowRandomCell.y + belowRandomCell.h),
                i
            );
            to = p5.Vector.lerp(
                createVector(randomCell.x + randomCell.w, randomCell.y + randomCell.h / 2),
                createVector(belowRandomCell.x + belowRandomCell.w, belowRandomCell.y + belowRandomCell.h),
                i
            );

            fromColor = color(randomCell.fill[0], randomCell.fill[1], randomCell.fill[2]);
            toColor = color(belowRandomCell.fill[0], belowRandomCell.fill[1], belowRandomCell.fill[2]);

            lrpColor = lerpColor(fromColor, toColor, i);

            noFill();
            stroke(lrpColor);
            strokeCap(SQUARE);
            strokeWeight(strokeW);
            line(from.x, from.y, to.x, to.y);

        }

    }
}

function saveFileName() {

    let fileName;
    if (transparent) {
        fileName = `${saveId}_${saveCount}.png`;
    } else {
        fileName = `${saveId}_${saveCount}.jpg`;
    }

    saveCount++;
    return fileName;
}

function resetUsedCells() {
    _.forEach(cells, function (c) {
        c.used = false;
    });
}

function keyPressed() {
    if (key === "r") {
        window.location.reload(false);
    }

    if (key === "Enter") {
        resetUsedCells();
        clear();
        redraw();
    }
    if (key === 's') {
        save(saveFileName());
    }
    if (key === "g") {
        // generate stack of images
        for (var i = 0; i < 10; i++) {
            resetUsedCells();
            clear();
            redraw();
            save(saveFileName());
        }

        return false;
    }
}
