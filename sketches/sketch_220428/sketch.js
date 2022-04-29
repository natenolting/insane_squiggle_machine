const helper = new Helpers();
const colors = new Colors();

let margin;
// square layouts:
// 5,4
// 14,13

let cols;
let rows;
let monoChrome;
let texture;
let textureDensity;
let bands;
let cW;
let transparent;

let extraRows;
let cH;
let lDark;
let lLow;
let lHigh;


let canvasWidth
let canvasHeight;
let data;
let saveCount = 0;
let cells = [];
let cellIndex = 0;
let cubeSideHeightMultiple;
let pallets;
let saveId = helper.makeid(10);

let colorList;
let hexColors;
let thisColor;

let settingsData;
let settings;

let cyan = '00AEEF';
let magenta = 'EC008C';
let yellow = 'FFF200';
let black = '000004';
let lOpacity;
let loops;

function preload() {
    data = loadJSON("../../data/palettes.json");
    settingsData = loadJSON("./settings.json");

}

function setup() {
    settings = settingsData.settings;
    margin = settings.margin;
    cols = settings.cols;
    rows = settings.rows;
    monoChrome = settings.monoChrome;
    texture = settings.texture;
    textureDensity = settings.textureDensity;
    bands = settings.bands;
    cW = settings.columnWidth;
    transparent = settings.transparent;
    extraRows = Math.floor(rows / 3);
    cubeSideHeightMultiple = 0.577396542692509;
    cH = cW * (113 / 98);
    lDark = settings.colorAdjust.dark;
    lLow = settings.colorAdjust.low;
    lHigh = settings.colorAdjust.high;
    lOpacity = settings.colorAdjust.opacity;
    loops = settings.loops;

    canvasWidth = margin * 2 + cols * cW;
    canvasHeight = margin * 2 + rows * cH + extraRows * (cH / 4);

    colorMode(HSL, 359, 100, 100, 100);
    pixelDensity(2);
    createCanvas(canvasWidth, canvasHeight);
    //pallets = data.palettes;
    pallets = [[cyan, magenta, yellow, black]];
}

function draw() {
    noLoop();
    if (!transparent) {
        noStroke();
        background(0, 0, 100, 100);
        fill(0, 0, 100, 100);
        rect(0, 0, canvasWidth, canvasHeight);
    }

    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    //hexColors = ['FFFFFF', 'FBB042', '58595B', '231F20'];
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
    for (var l = 0; l < loops; l++) {
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

                    if (l === 0 && transparent) {
                      fill(0,0,100,100);
                      cube.buildBottomFace();
                      cube.buildTopFace();
                      cube.buildLeftFace();
                      cube.buildRightFace();
                    }

                    //--------------------------------------------------
                    // Bottom Face
                    // -------------------------------------------------
                    if (helper.flipACoin()) {
                        fill(thisColor.h, thisColor.s, thisColor.l * lDark, 100 * lOpacity);
                        cube.buildBottomFace();
                    }
                    if (helper.flipACoin() && texture) {
                        // bottom side texture
                        sideNoise(cube.g, cube.b, cube.f, cube.a, {
                            h: thisColor.h,
                            s: thisColor.s,
                            l: thisColor.l * lDark
                        });
                    }
                    if (helper.flipACoin() && bands) {
                        // bottom bands
                        sideBands(cube.a, cube.b, cube.f, cube.g, {
                            h: thisColor.h,
                            s: thisColor.s,
                            l: thisColor.l * lDark
                        });
                    }

                    //--------------------------------------------------
                    // Right Face
                    // -------------------------------------------------
                    if (helper.flipACoin()) {
                        fill(thisColor.h, thisColor.s, thisColor.l * lLow, 100 * lOpacity);
                        cube.buildRightFace();
                    }
                    if (helper.flipACoin() && texture) {
                        // right side texture
                        sideNoise(cube.g, cube.a, cube.e, cube.f, {
                            h: thisColor.h,
                            s: thisColor.s,
                            l: thisColor.l * lLow
                        });
                    }
                    if (helper.flipACoin() && bands) {
                        // right bands
                        sideBands(cube.g, cube.e, cube.a, cube.f, {
                            h: thisColor.h,
                            s: thisColor.s,
                            l: thisColor.l * lLow
                        });
                    }

                    //--------------------------------------------------
                    // Left Face
                    // -------------------------------------------------
                    if (helper.flipACoin()) {
                        fill(thisColor.h, thisColor.s, thisColor.l * lHigh, 100 * lOpacity);
                        cube.buildLeftFace();
                    }
                    if (helper.flipACoin() && texture) {
                        // left side texture
                        sideNoise(cube.c, cube.b, cube.g, cube.a, {
                            h: thisColor.h,
                            s: thisColor.s,
                            l: thisColor.l * lHigh
                        });
                    }
                    if (helper.flipACoin() && bands) {
                        // left bands
                        sideBands(cube.c, cube.g, cube.b, cube.a, {
                            h: thisColor.h,
                            s: thisColor.s,
                            l: thisColor.l * lHigh
                        });
                    }

                    //--------------------------------------------------
                    // Top Face
                    // -------------------------------------------------
                    if (helper.flipACoin()) {
                        fill(thisColor.h, thisColor.s, thisColor.l, 100 * lOpacity);
                        cube.buildTopFace();
                    }
                    if (helper.flipACoin() && texture) {
                        // top texture
                        sideNoise(cube.d, cube.c, cube.e, cube.g, {h: thisColor.h, s: thisColor.s, l: thisColor.l});
                    }
                    if (helper.flipACoin() && bands) {
                        // top bands
                        sideBands(cube.d, cube.c, cube.e, cube.g, {h: thisColor.h, s: thisColor.s, l: thisColor.l});
                    }
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
        fill(color.h, color.s, color.l, 100 * lOpacity);
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
    noStroke();
    fill(color.h, color.s, color.l, 50 * lOpacity);
    let lerpA = p5.Vector.lerp(a, d, .5);
    let lerpADist = p5.Vector.dist(a, b);
    let lerpB;
    let randX;
    let randY;
    let density = textureDensity * sq(cW);
    point(lerpA.x, lerpA.y);
    for (var i = 0; i < density; i++) {
        randX = random(-lerpADist, lerpADist);
        randY = random(-lerpADist, lerpADist);
        lerpB = createVector(lerpA.x + randX, lerpA.y + randY);
        if (helper.pointInPoly([b, a, c, d], lerpB)) {
            let ellipseRandom = random(helper.range(1, 4));
            ellipse(lerpB.x, lerpB.y, ellipseRandom * noise(lerpB.x, lerpB.y));
        }
    }


    noStroke();


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
