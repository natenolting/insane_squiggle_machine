const color = new Colors();
const helper = new Helpers();
let img;
let sImg
let factor = 13;
let w, h;
let fillOpacity = 100;
let strokeOpacity = 100;
let margin = 25;
let cubeSideWidth = 6;
let lLow = .55;
let lHigh = .85;

let lMid = helper.average([lLow, lHigh]);
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
    img = loadImage(`../images/botanical/Dahlia-Sir-J.-Franklin-1852-1861 copy.jpg`);
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
    //
    // push();
    // translate(-sImg.width * .5, -sImg.height);

    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {

            let currentX  = (x * factor + sImg.width / 2) - sImg.width/2;
            let currentY = (y * factor + sImg.height) - sImg.height;

            let iso = new Isometric(
                currentX,
                currentY,
                cubeSideWidth,
                cubeSideHeight,
                2
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
    //pop();
    // stroke(0,0,0,100);
    // rect(0,0,sImg.width, sImg.height)
    // push();
    // translate(-sImg.width/2,-sImg.height);
    let counter = 0;
    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {

            let index = (x + y * sImg.width) * 4
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            let hsl = color.RGBtoHSL(r, g, b);
            let currentX  = (x * factor + sImg.width / 2) - sImg.width/2;
            let currentY = (y * factor + sImg.height) - sImg.height;
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
            iso.pickDirection(
                7,
                random(helper.range(1, 5)) * noise(
                    currentX,
                    currentY
                )
            );

            if (vectorsAreInsideBounds(iso)) {

                stroke(hsl.h, hsl.s, hsl.l * lMid, strokeOpacity);
                strokeWeight(sImg.width * .00875);
                strokeCap(ROUND);
                strokeJoin(ROUND);
                //noStroke();
                fill(hsl.h, hsl.s, hsl.l, fillOpacity);
                iso.buildLeftFace();
                fill(hsl.h, hsl.s, hsl.l * lHigh, fillOpacity);
                iso.buildTopFace();
                fill(hsl.h, hsl.s, hsl.l * lLow, fillOpacity);
                iso.buildRightFace();

            }
            counter++;
        }
    }
//pop();
// stroke(0,0,0,100);
// rect(0,0,sImg.width, sImg.height)
console.log(counter);
}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.png`;
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
