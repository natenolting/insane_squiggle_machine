const color = new Colors();
const helper = new Helpers();
let img;
let sImg
let factor = 30;
let w, h;
let opacity = 100;
let margin = 25;
let cubeSideWidth = 8;
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

    //https://artvee.com/dl/camellia-reticulata-var-flore-pleno/
    img = loadImage(`../images/botanical/Camellia-reticulata-var.-flore-pleno-1854-1896.jpg`);
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

    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {
          let index = (x + y * sImg.width) * 4
          let r = sImg.pixels[index];
          let g = sImg.pixels[index + 1];
          let b = sImg.pixels[index + 2];
          let hsl = color.RGBtoHSL(r, g, b);
          fill(hsl.h, hsl.s, hsl.l, opacity);
          ellipse(
            x * factor + sImg.width / 2,
            y * factor + sImg.height,
            45
          );
        }
      }

    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {
            let index = (x + y * sImg.width) * 4
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            let hsl = color.RGBtoHSL(r, g, b);

            let iso = new Isometric(
                x * factor + sImg.width / 2,
                y * factor + sImg.height,
                cubeSideWidth,
                cubeSideHeight,
                random(helper.range(1,7)) * noise(
                    x * factor + sImg.width / 2,
                    y * factor + sImg.height
                )
            );
            iso.pickDirection(
                random(helper.range(1,6)),
                random(helper.range(1,4)) * noise(
                    x * factor + sImg.width / 2,
                    y * factor + sImg.height
                )
            );

            if (vectorsAreInsideBounds(iso)) {
                stroke(hsl.h, hsl.s, hsl.l * .75, opacity);
                strokeWeight(2);
                strokeCap(ROUND);
                strokeJoin(ROUND);
                noStroke();
                fill(hsl.h, hsl.s, hsl.l, opacity);

                iso.buildTopFace();
                fill(hsl.h, hsl.s, hsl.l * .75, opacity);
                iso.buildLeftFace();
                fill(hsl.h, hsl.s, hsl.l * .55, opacity);
                iso.buildRightFace();

            }
        }
    }


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
