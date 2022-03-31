const color = new Colors();
const helper = new Helpers();
let img;
let sImg
let factor = 20;
let w, h;
let opacity = 100;
let margin = 25;
let cubeSideWidth = 10;
let cubeSideHeightMultiple = 0.577396542692509;
let cubeSideHeight = cubeSideWidth * cubeSideHeightMultiple;
let saveId = helper.makeid(10);
let saveCount = 0;

function vectorsAreInsideBounds(iso) {
    return iso.a.x >= margin && iso.a.y >= margin && iso.a.x <= width - margin && iso.a.y <= height - margin &&
        iso.b.x >= margin && iso.b.y >= margin && iso.b.x <= width - margin && iso.b.y <= height - margin &&
        iso.c.x >= margin && iso.c.y >= margin && iso.c.x <= width - margin && iso.c.y <= height - margin &&
        iso.d.x >= margin && iso.d.y >= margin && iso.d.x <= width - margin && iso.d.y <= height - margin &&
        iso.e.x >= margin && iso.e.y >= margin && iso.e.x <= width - margin && iso.e.y <= height - margin &&
        iso.f.x >= margin && iso.f.y >= margin && iso.f.x <= width - margin && iso.f.y <= height - margin &&
        iso.g.x >= margin && iso.g.y >= margin && iso.g.x <= width - margin && iso.g.y <= height - margin
}

function preload() {
    // preload() runs once
    img = loadImage(`../images/botanical/${helper.rollADie(8)}.jpg`);
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
    fill(0,0,100, 100);
    rect(0,0,sImg.width, sImg.height);
    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {
            let index = (x + y * sImg.width) * 4
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            let a = sImg.pixels[index + 3];
            let hsl = color.RGBtoHSL(r, g, b);

            let iso = new Isometric(x * factor + sImg.width / 2, y * factor + sImg.height, cubeSideWidth, cubeSideHeight, random(helper.range(1, 2)));
            iso.pickDirection(helper.rollADie(7), random(helper.range(1, 4)));

            if (vectorsAreInsideBounds(iso)) {
                stroke(hsl.h, hsl.s, hsl.l * .75, opacity);
                strokeWeight(2);
                strokeCap(ROUND);
                strokeJoin(ROUND);
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
