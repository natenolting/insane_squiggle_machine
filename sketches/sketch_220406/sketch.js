const helper = new Helpers();
const colors = new Colors();

const margin = 50;
const cols = 4;
const rows = 3;
const monoChrome = false;
const texture = false;
const bands = false;
const cW = 200;

const extraRows = Math.floor(rows / 3);
const cH = cW * (113 / 98);
let lDark = .30;
let lLow = .55;
let lHigh = .75;


const canvasWidth = margin * 2 + cols * cW;
const canvasHeight = margin * 2 + rows * cH + extraRows * (cH / 4);

let data;
let saveId = helper.makeid(10);
let saveCount = 0;
let cells = [];
let cellIndex = 0;
let cubeSideHeightMultiple = 0.577396542692509;
let pallets;

let colorList;
let hexColors;
let thisColor;

function preload() {
    data = loadJSON("../../data/palettes.json");

}

function setup() {
    colorMode(HSL, 359, 100, 100, 100);
    pixelDensity(2);
    createCanvas(canvasWidth, canvasHeight);
    pallets = data.palettes;
}

function draw() {
    noLoop();
    background(0, 0, 100, 100);
    fill(0, 0, 100, 100);
    rect(0, 0, canvasWidth, canvasHeight);

    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    colorList = [];
    let pallet = [];
    for (const item of hexColors) {
        let rgb = colors.HEXtoRGB(item);
        colorList.push(rgb);
        let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        pallet.push(hsl);
    }
    thisColor = random(pallet);
    cells = [];
    for (let r = 0; r < rows + extraRows; r++) {
        for (let c = 0; c < cols; c++) {
            let x = margin + c * cW;
            let y = margin + r * cH;
            let cCell;
            cCell = new Cell(r, c, x, y, cW, cH, false, cellIndex);
            cells.push(cCell);
            cellIndex++;
        }
    }

    let rowOffset = cH / 4;
    for (let r = 0; r < rows + extraRows; r++) {
        let subCells = _.filter(cells, function (o) {
            return o.row === r;
        });
        for (const cCell of subCells) {
            let cube;

            if (helper.isEven(cCell.row)) {
                cube = new Isometric(
                    cCell.cX,
                    (cCell.y + cCell.h) - (rowOffset * r),
                    cCell.w / 2,
                    cCell.w / 2 * cubeSideHeightMultiple, 1
                );

            } else if (!helper.isEven(cCell.row) && cCell.col < cols - 1) {
                cube = new Isometric(
                    cCell.cX + cCell.w / 2,
                    (cCell.y + cCell.h) - (rowOffset * r),
                    cCell.w / 2,
                    cCell.w / 2 * cubeSideHeightMultiple, 1
                );

            }
            if (cube instanceof Isometric) {
                noStroke();
                if (!monoChrome) {
                    thisColor = random(pallet);
                }
                if (helper.flipACoin()) {
                    fill(thisColor.h, thisColor.s, thisColor.l * lDark, 100);
                    cube.buildBottomFace();
                }
                if (helper.flipACoin() && texture) {
                    // bottom side texture
                    sideNoise(cube.g, cube.b, cube.f, cube.a, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lDark});
                    sideNoise(cube.b, cube.g, cube.a, cube.f, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lDark});
                    sideNoise(cube.f, cube.g, cube.a, cube.b, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lDark});
                    sideNoise(cube.g, cube.f, cube.b, cube.a, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lDark});
                }
                if (helper.flipACoin() && bands) {
                    // bottom bands
                    sideBands(cube.a, cube.b, cube.f, cube.g, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lDark});
                }
                if (helper.flipACoin()) {
                    fill(thisColor.h, thisColor.s, thisColor.l * lLow, 100);
                    cube.buildRightFace();
                }
                if (helper.flipACoin() && texture) {
                    // right side texture
                    sideNoise(cube.g, cube.a, cube.e, cube.f, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lLow});
                    sideNoise(cube.a, cube.g, cube.f, cube.e, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lLow});
                    sideNoise(cube.g, cube.e, cube.a, cube.f, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lLow});
                    sideNoise(cube.e, cube.g, cube.f, cube.a, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lLow});
                }
                if (helper.flipACoin() && bands) {
                    // right bands
                    sideBands(cube.g, cube.e, cube.a, cube.f, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lLow});
                }
                if (helper.flipACoin()) {
                    fill(thisColor.h, thisColor.s, thisColor.l * lHigh, 100);
                    cube.buildLeftFace();
                }
                if (helper.flipACoin() && texture) {
                    // left side texture
                    sideNoise(cube.c, cube.b, cube.g, cube.a, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lHigh});
                    sideNoise(cube.b, cube.c, cube.a, cube.g, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lHigh});
                    sideNoise(cube.c, cube.g, cube.b, cube.a, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lHigh});
                    sideNoise(cube.g, cube.c, cube.a, cube.b, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lHigh});
                }
                if (helper.flipACoin() && bands) {
                    // left bands
                    sideBands(cube.c, cube.g, cube.b, cube.a, {h: thisColor.h, s: thisColor.s, l: thisColor.l * lHigh});
                }
                if (helper.flipACoin()) {
                    fill(thisColor.h, thisColor.s, thisColor.l, 100);
                    cube.buildTopFace();
                }
                if (helper.flipACoin() && texture) {
                    // top texture
                    sideNoise(cube.d, cube.c, cube.e, cube.g, {h: thisColor.h, s: thisColor.s, l: thisColor.l});
                    sideNoise(cube.c, cube.d, cube.g, cube.e, {h: thisColor.h, s: thisColor.s, l: thisColor.l});

                    sideNoise(cube.g, cube.c, cube.e, cube.d, {h: thisColor.h, s: thisColor.s, l: thisColor.l});
                    sideNoise(cube.c, cube.g, cube.d, cube.e, {h: thisColor.h, s: thisColor.s, l: thisColor.l});
                }
                if (helper.flipACoin() && bands) {
                    // top bands
                    sideBands(cube.d, cube.c, cube.e, cube.g, {h: thisColor.h, s: thisColor.s, l: thisColor.l});
                }
            }
        }

    }

}

function sideBands(a, b, c, d, color) {
    let lerpA;
    let lerpB;
    let lerpC;
    let lerpD;
    let lerpInc = random([0.025, 0.05, 0.1, 0.2]);
    for (let l = 0; l < .99; l += lerpInc * 2) {
        lerpA = p5.Vector.lerp(a, b, l);
        lerpB = p5.Vector.lerp(a, b, l + lerpInc);
        lerpC = p5.Vector.lerp(c, d, l);
        lerpD = p5.Vector.lerp(c, d, l + lerpInc);
        fill(color.h, color.s, color.l, 100);
        noStroke();
        beginShape();
        vertex(lerpA.x, lerpA.y);
        vertex(lerpB.x, lerpB.y);
        vertex(lerpD.x, lerpD.y);
        vertex(lerpC.x, lerpC.y);
        endShape(CLOSE);

    }
}

function sideNoise(a, b, c, d, color) {
    let lerpA;
    let lerpB;
    let lerpC;
    let high = 0.05;
    let low = -0.01;
    let lerpNoise = random(low, high);
    for (var l = 0; l < 1 - high; l += lerpNoise) {

        lerpNoise = random(low, high);
        lerpA = p5.Vector.lerp(a, b, l + lerpNoise);
        lerpNoise = random(low, high);
        lerpB = p5.Vector.lerp(c, d, l + lerpNoise);

        for (var z = 0; z < 1 - high; z += lerpNoise) {

            lerpNoise = random(low, high);
            lerpC = p5.Vector.lerp(lerpA, lerpB, z + lerpNoise);
            fill(color.h, color.s, color.l, 50);
            noStroke();
            ellipse(lerpC.x, lerpC.y, lerpNoise * random(45, 65));

        }

    }
}


function saveFileName() {
    let fileName = `${saveId}_${saveCount}.jpg`;
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
