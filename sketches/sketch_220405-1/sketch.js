const color = new Colors();
const helper = new Helpers();

let factor = 15;
let fillOpacity = 100;
let strokeOpacity = 100;
let margin = 25;
let lLow = .50;
let lHigh = .85;
let useGradients = false;
let useStrokes = true;
let strokeVWeight = 0.015;
let cubeDirections = [2,7];
let cubeLengthLow = 1;
let cubeLengthHigh = 7;

let img;
let sImg
let w, h;
let cubeSideWidth = factor / 3.5;
let lMid = helper.average([lLow, lHigh, 1]);
let cubeSideHeightMultiple = 0.577396542692509;
let cubeSideHeight = cubeSideWidth * cubeSideHeightMultiple;
let saveId = helper.makeid(10);
let saveCount = 0;

function vectorsAreInsideBounds(iso) {
    return iso.a.x >= margin + helper.rollADie(margin * 2) && iso.a.y >= margin + helper.rollADie(margin * 2) && iso.a.x <= width - margin - helper.rollADie(margin * 2) && iso.a.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.b.x >= margin + helper.rollADie(margin * 2) && iso.b.y >= margin + helper.rollADie(margin * 2) && iso.b.x <= width - margin - helper.rollADie(margin * 2) && iso.b.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.c.x >= margin + helper.rollADie(margin * 2) && iso.c.y >= margin + helper.rollADie(margin * 2) && iso.c.x <= width - margin - helper.rollADie(margin * 2) && iso.c.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.d.x >= margin + helper.rollADie(margin * 2) && iso.d.y >= margin + helper.rollADie(margin * 2) && iso.d.x <= width - margin - helper.rollADie(margin * 2) && iso.d.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.e.x >= margin + helper.rollADie(margin * 2) && iso.e.y >= margin + helper.rollADie(margin * 2) && iso.e.x <= width - margin - helper.rollADie(margin * 2) && iso.e.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.f.x >= margin + helper.rollADie(margin * 2) && iso.f.y >= margin + helper.rollADie(margin * 2) && iso.f.x <= width - margin - helper.rollADie(margin * 2) && iso.f.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.g.x >= margin + helper.rollADie(margin * 2) && iso.g.y >= margin + helper.rollADie(margin * 2) && iso.g.x <= width - margin - helper.rollADie(margin * 2) && iso.g.y <= height - margin - helper.rollADie(margin * 2)
}

function preload() {

    //https://artvee.com/dl/dahlia-sir-j-franklin/
    img = loadImage(`../images/botanical/Camellia-Valtevaredo-1852-1861.jpg`);
}

function setup() {
    colorMode(HSL, 359, 100, 100, 100);
    pixelDensity(1);
    createCanvas(img.width, img.height);
    w = img.width / factor;
    h = img.height / factor;
    sImg = createImage(int(w), int(h));
    sImg.copy(img, 0, 0, img.width, img.height, 0, 0, w, h)
}

function draw() {
    noLoop();
    background(0, 0, 100, 100);
    image(sImg, 0, 0);
    sImg.loadPixels();
    noStroke();
    fill(0, 0, 100, 100);
    rect(0, 0, sImg.width, sImg.height);
    let strokeW = sImg.width * strokeVWeight;


    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {


            let currentX = (x * factor + sImg.width / 2) - sImg.width / 2;
            let currentY = (y * factor + sImg.height) - sImg.height;

            let iso = new Isometric(
                currentX,
                currentY,
                cubeSideWidth,
                cubeSideHeight,
                cubeSideWidth
            );

            if (vectorsAreInsideBounds(iso)) {
                let index = (x + y * sImg.width) * 4
                let r = sImg.pixels[index];
                let g = sImg.pixels[index + 1];
                let b = sImg.pixels[index + 2];
                let hsl = color.RGBtoHSL(r, g, b);
                fill(hsl.h, hsl.s, hsl.l, 100);
                iso.buildTopFace();
                iso.buildLeftFace();
                iso.buildRightFace();
            }

        }
    }

    let counter = 0;
    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {

            let index = (x + y * sImg.width) * 4
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            let hsl = color.RGBtoHSL(r, g, b);
            let currentX = (x * factor + sImg.width / 2) - sImg.width / 2;
            let currentY = (y * factor + sImg.height) - sImg.height;
            let length = random(helper.range(cubeLengthLow, cubeLengthHigh)) * noise(
                currentX,
                currentY
            );
            let iso = new Isometric(
                currentX,
                currentY,
                cubeSideWidth,
                cubeSideHeight,
                random(helper.range(1, 10)) * noise(
                    currentX,
                    currentY
                )
            );

            let direct;
            if(Array.isArray(cubeDirections)) {
                direct = random(cubeDirections);
            } else {
                direct = cubeDirections;
            }


            iso.pickDirection(direct, length);
            if (vectorsAreInsideBounds(iso)) {
                push();
                angleMode(DEGREES);
                translate(iso.startX, iso.startY);
                //rotate(random(helper.range(-10, 10)));
                iso.setStartX(0);
                iso.setStartY(0);
                iso.baseCoordinates();
                iso.pickDirection(direct, length);
                noStroke();
                fill(hsl.h, hsl.s, hsl.l, fillOpacity);
                iso.buildLeftFace();

                fill(hsl.h, hsl.s, hsl.l * lHigh, fillOpacity);
                iso.buildTopFace();
                fill(hsl.h, hsl.s, hsl.l * lLow, fillOpacity);
                iso.buildRightFace();
                strokeWeight(strokeW);
                strokeCap(ROUND);
                strokeJoin(ROUND);
                noFill();
                if (useGradients) {
                    let aV = createVector(iso.a.x, iso.a.y);
                    let bV = createVector(iso.b.x, iso.b.y);
                    let cV = createVector(iso.c.x, iso.c.y);
                    let dV = createVector(iso.d.x, iso.d.y);
                    let eV = createVector(iso.e.x, iso.e.y);
                    let fV = createVector(iso.f.x, iso.f.y);
                    let gV = createVector(iso.g.x, iso.g.y);

                    let cbLerpDist = strokeW / p5.Vector.dist(cV, bV);
                    let gaLerpDist = strokeW / p5.Vector.dist(gV, aV);
                    let efLerpDist = strokeW / p5.Vector.dist(eV, fV);
                    let gcLerpDist = strokeW / p5.Vector.dist(gV, cV);
                    let cdLerpDist = strokeW / p5.Vector.dist(cV, dV);

                    // do left side gradient from base to mid
                    for (var i = 0; i < 1; i += cbLerpDist) {
                        let cbLerp = p5.Vector.lerp(cV, bV, i);
                        let gaLerp = p5.Vector.lerp(gV, aV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(1, lMid, i), strokeOpacity);
                        line(cbLerp.x, cbLerp.y, gaLerp.x, gaLerp.y);
                    }

                    // do right side gradient from base to low
                    for (var i = 0; i < 1; i += efLerpDist) {
                        let efLerp = p5.Vector.lerp(eV, fV, i);
                        let gaLerp = p5.Vector.lerp(gV, aV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(1, lLow, i), strokeOpacity);
                        line(gaLerp.x, gaLerp.y, efLerp.x, efLerp.y);
                    }

                    // do bottom half of top from base to high
                    for (var i = 0; i < 1; i += gcLerpDist) {
                        let gcLerp = p5.Vector.lerp(gV, cV, i);
                        let geLerp = p5.Vector.lerp(gV, eV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(1, lHigh, i), strokeOpacity);
                        line(gcLerp.x, gcLerp.y, geLerp.x, geLerp.y);
                    }

                    // do top half of top from high to mid
                    for (var i = 0; i < 1; i += cdLerpDist) {
                        let cdLerp = p5.Vector.lerp(cV, dV, i);
                        let edLerp = p5.Vector.lerp(eV, dV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(lHigh, lMid, i), strokeOpacity);
                        line(cdLerp.x, cdLerp.y, edLerp.x, edLerp.y);
                    }
                }
                if (useStrokes) {
                    // add stroke edges
                    stroke(hsl.h, hsl.s, hsl.l * lMid, strokeOpacity);
                    iso.buildLeftFace();
                    iso.buildTopFace();
                    iso.buildRightFace();
                }

                pop();

            }
            counter++;
        }
    }
    console.log(`${counter} total cubes`);
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
