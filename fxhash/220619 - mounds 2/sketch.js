// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const PROJECT_WIDTH = 3000;
const PROJECT_HEIGHT = 3000;
const COLUMNS = 25;
const ROWS = 25;
const DO_MARGIN = false;
const MARGIN = PROJECT_WIDTH * .03;
const CELL_WIDTH = PROJECT_WIDTH / COLUMNS;
const CELL_HEIGHT = PROJECT_HEIGHT / ROWS;
const HELPER = new Helpers();
const COLORS = new Colors();
const TRANSFORM = new Transform();
const BW_OR_MONO = fxrand();


const CONFIG = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    rainbow: BW_OR_MONO > .15 && BW_OR_MONO < .16 ? true : false,

    /** is this monochrome? **/
    monochrome: BW_OR_MONO < .05 ? true : false,

    /** is this monochrome? **/
    coloring_book: BW_OR_MONO > .99 ? true : false,

    density: fxrand(),

    g: fxrand(),
};

window.$fxhashFeatures = {
    ...CONFIG,
};

const pos = {
    /** width */
    w: null,
    /** height */
    h: null,
    /** canvas width */
    cW: null,
    /** canvas height */
    cH: null,
};

function setupPosition() {
    // let w = window.innerWidth;
    // let h = window.innerHeight;
    // if (w > h) {
    //     pos.cW = h;
    //     pos.cH = h;
    // } else {
    //     pos.cW = w;
    //     pos.cH = w;
    // }
    pos.cW = PROJECT_WIDTH;
    pos.cH = PROJECT_HEIGHT;
    pos.w = PROJECT_WIDTH;
    pos.h = PROJECT_HEIGHT;
}

let colors = [];
let saveId = HELPER.makeid(10);
let saveCount = 0;
let squiggles = [];
let palletData;
let pallets;
let hexColors;
let cells;
let cg;
let lastImageIndex = null;
let lastColorIndex = null;
const pallet = {
    // pallet index
    i: null,
    // pallet hex colors
    h: [],
    // pallet rgb colors
    rgb: [],
    // pallet hsl colors
    hsl: [],
}

function setupPallet() {
    // setup colors
    pallets = palletData.pallets;

    if (CONFIG.coloring_book) {
        pallet.i = 0;
        pallet.h = ['000000', 'ffffff'];
        setupPalletRGAndHSL();
        return;
    }

    if (CONFIG.rainbow) {
        pallet.i = 0;
        pallet.h = ['ff0000', 'ffa500', 'ffff00', '008000', '0000ff', '4b0082', 'ee82ee'];
        setupPalletRGAndHSL();
        return;
    }

    pallet.i = floor(map(fxrand(), 0, 1, 0, pallets.length - 1));
    pallet.h = pallets[pallet.i];
    setupPalletRGAndHSL();

    if (CONFIG.monochrome) {
        let randColor = floor(map(fxrand(), 0, 1, 0, pallet.h.length));
        let randHSL = {h: pallet.hsl[randColor].h, s: pallet.hsl[randColor].s, l: pallet.hsl[randColor].l}

        pallet.h = [
            COLORS.HSLtoHEX(randHSL.h, randHSL.s, 15),
            COLORS.HSLtoHEX(randHSL.h, randHSL.s, 35),
            COLORS.HSLtoHEX(randHSL.h, randHSL.s, 55),
            COLORS.HSLtoHEX(randHSL.h, randHSL.s, 75),
            COLORS.HSLtoHEX(randHSL.h, randHSL.s, 95),
        ];
        setupPalletRGAndHSL();
    }

}

function setupPalletRGAndHSL() {
    pallet.rgb = [];
    pallet.hsl = [];
    for (let i = 0; i < pallet.h.length; i++) {
        let h = pallet.h[i];
        pallet.rgb.push(COLORS.HEXtoRGB(h));
        let rgb = pallet.rgb[pallet.rgb.length - 1];
        pallet.hsl.push(COLORS.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
    }
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

window.preload = () => {

    palletData = loadJSON("./data/palettes.json");

    let imagesMax = 223;
    let imageIndexes = HELPER.shuffleArray(range(1, imagesMax)).slice(0, Math.ceil(imagesMax / 4));

    for (let i = 0; i < imageIndexes.length; i++) {
        squiggles.push(loadImage(`./images/squiggles/set-19/${imageIndexes[i]}.png`));
    }

}

window.setup = () => {
    setupPosition();
    pallets = palletData.pallets
    setupPallet();
    createCanvas(pos.cW, pos.cH);
    colorMode(HSL, 359, 100, 100, 100);
    background(0, 0, 100, 100);
    pixelDensity(1);
    noiseSeed(CONFIG.noiseSeed);
    cg = createGraphics(pos.w - (DO_MARGIN ? MARGIN * 2 : 0), pos.h - (DO_MARGIN ? MARGIN * 2 : 0));
    if (DO_MARGIN) {
        cg.translate(MARGIN, MARGIN);
    }
    cg.colorMode(HSL, 359, 100, 100, 100);
    TRANSFORM.cg = cg;
}

window.windowResized = () => {
}

window.draw = () => {
    noLoop();

    cg.background(0, 0, 100, 100);
    let randColors = HELPER.shuffleArray(pallet.hsl);
    let bgColor1 = color(randColors[0].h, randColors[0].s, randColors[0].l, 30);
    let bgColor2 = color(randColors[1].h, randColors[1].s, randColors[1].l, 30);


    if (!CONFIG.coloring_book) {
        // give the canvas a muted background
        for (var i = 1; i <= cg.height; i++) {
            let lerpAmount = i / cg.height;
            let bgColor3 = lerpColor(bgColor1, bgColor2, lerpAmount);
            cg.stroke(bgColor3);
            cg.strokeWeight(1);
            cg.noFill()
            cg.line(0, i, cg.width, i);
            cg.noStroke();

        }
    }
    let moundRowsDensityLow = map(CONFIG.density, 0, 1, 50, 150);
    let moundRowsDensityHigh = map(CONFIG.density, 0, 1, 150, 200);
    let moundRowsDensity = floor(map(CONFIG.density, 0, 1, moundRowsDensityLow, moundRowsDensityHigh));


    let gradientChanceOffset = 0;
    for (let i = 0; i < moundRowsDensity; i++) {
        let y = map(i, 0, moundRowsDensity, 0, cg.height)

        let x = (cg.width / 2) + map(noise(i, y), 0, 1, -cg.width, cg.width);

        let s = map(y, 0, cg.height, .25, 1);
        let gChance = floor(map(CONFIG.g, 0, 1, 1, 10));

        if (gradientChanceOffset < gChance) {
            gChance -= gradientChanceOffset;
        }
        let g = HELPER.rollADie(gChance) === gChance;

        let m = doMound(x, y, s, g);
        if (!m) {
            gradientChanceOffset++;
        } else {
            gradientChanceOffset = 0;
        }

    }

    cg.filter(BLUR, .5);

    image(cg, 0, 0, pos.cW, pos.cH);
}

// find a random pallet index
function getRandPalletIndex(rand = null) {
    if (!rand) {
        rand = fxrand();
    }
    return floor(map(rand, 0, 1, 0, pallet.hsl.length));
}

// Find a random Image index
function getRandImageIndex(rand = null) {
    if (!rand) {
        rand = fxrand();
    }

    return floor(map(rand, 0, 1, 0, squiggles.length));
}

function doMound(x, y, s = 1, g = false) {

    let thisColorIndex = getRandPalletIndex();
    if (lastColorIndex === thisColorIndex) {
        while (lastColorIndex === thisColorIndex) {
            //console.log('found same as last color index');
            thisColorIndex = getRandPalletIndex();
        }
    }
    lastColorIndex = thisColorIndex
    let thisColor = pallet.hsl[thisColorIndex];

    let thisImageIndex = getRandImageIndex(noise(x, y));

    if (lastImageIndex === thisImageIndex) {
        while (lastImageIndex === thisImageIndex) {
            thisImageIndex = getRandImageIndex();
        }
    }
    lastImageIndex = thisImageIndex;
    let thisImage = squiggles[thisImageIndex];

    let newCg = createGraphics(thisImage.width * s, thisImage.height * s);
    newCg.colorMode(HSL, 359, 100, 100, 100);
    let newTransform = new Transform();
    let flip = HELPER.flipACoin();
    newTransform.cg = newCg;
    newCg.push();
    newCg.scale(s);
    if (flip) {
        newTransform.imageFlipH(thisImage, 0, 0);
    } else {
        newCg.image(thisImage, 0, 0);
    }
    newCg.pop();

    // if outside the margin then return
    if (x < MARGIN || x + newCg.width > cg.width - MARGIN || y - newCg.height < MARGIN || y > cg.height - MARGIN) {
        return false;
    }
    // if not in coloring book mode then make the drop shaddow
    if (!CONFIG.coloring_book) {
        let shadowScale = 1.035
        let shadowCg = createGraphics(newCg.width * shadowScale, newCg.height * shadowScale);
        let shadowTransform = new Transform();
        shadowTransform.cg = shadowCg;
        shadowCg.scale(s * shadowScale);
        shadowCg.tint(0, 0, 0, 65);
        if (flip) {
            shadowTransform.imageFlipH(thisImage, 0, 0);
        } else {
            shadowCg.image(thisImage, 0, 0);
        }
        cg.image(shadowCg, x, y - shadowCg.height);
    }


    if (!CONFIG.coloring_book) {

        // alpha image for masking out the gradient
        let newAlpha = createImage(int(newCg.width), int(newCg.height));
        // image that will hold the pixels from newCg
        let newCgImage = createImage(int(newCg.width), int(newCg.height));
        newAlpha.loadPixels();
        newCg.loadPixels();
        // go over the newCg canvas and find the alpha channels
        for (let x = 0; x < newAlpha.width; x++) {
            for (let y = 0; y < newAlpha.height; y++) {

                let index = (x + y * newAlpha.width) * 4
                newAlpha.pixels[index] = 255;
                newAlpha.pixels[index + 1] = 255;
                newAlpha.pixels[index + 2] = 255;
                newAlpha.pixels[index + 3] = newCg.pixels[index + 3];
            }
        }

        newAlpha.updatePixels();
        newCg.updatePixels();
        // get a secondary color for the gradient
        let thisColorIndex2 = getRandPalletIndex();
        if (thisColorIndex === thisColorIndex2) {
            while (thisColorIndex === thisColorIndex2) {
                thisColorIndex2 = getRandPalletIndex();
            }
        }
        let thisColorC = color(thisColor.h, thisColor.s, thisColor.l);
        let accentDarkLight = HELPER.flipACoin();
        let thisColor2C = color(0,0,accentDarkLight ? 0 : 100, 100);


        if (g) {
          newCg.blendMode(MULTIPLY);
          newCg.fill(thisColorC);
          newCg.rect(0,0,newCg.width, newCg.height);
          newCg.blendMode(OVERLAY);
          newCg.fill(thisColor2C);
          newCg.noStroke();
            for (let ly = 0; ly < newCg.height; ly+=3) {
                let lerpDist = ly / newCg.height;
                let lerpC = lerpColor(thisColorC, thisColor2C, lerpDist);
                newCg.fill(lerpC);
                for (var gl = 0; gl < 3; gl++) {

                for (var lx = 0; lx < newCg.width; lx+=5) {
                  let fillRoll=HELPER.rollADie(20)
                  if (fillRoll === 4) {
                    newCg.ellipse(lx, ly, map(noise(lx, ly), 0, 1, 2, 5));
                  }
                  if (fillRoll === 10) {
                    newCg.rectMode(RADIUS);
                    newCg.rect(lx, ly, map(noise(lx, ly), 0, 1, 3, 8), 3, 3);
                  }
                }
              }
            }
            newCg.rectMode(CORNER);
        } else {
            newCg.blendMode(MULTIPLY);
            newCg.fill(thisColor.h, thisColor.s, thisColor.l, 100);
            newCg.rect(0, 0, newCg.width, newCg.height)
        }


        newCg.loadPixels();
        newCgImage.loadPixels();
        // now move the pixels from newCg to the newCgImage image container
        for (let x = 0; x < newCgImage.width; x++) {
            for (let y = 0; y < newCgImage.height; y++) {

                let index = (x + y * newCgImage.width) * 4
                newCgImage.pixels[index] = newCg.pixels[index];
                newCgImage.pixels[index + 1] = newCg.pixels[index + 1];
                newCgImage.pixels[index + 2] = newCg.pixels[index + 2];
                newCgImage.pixels[index + 3] = newCg.pixels[index + 3];
            }
        }

        newCgImage.updatePixels();
        // now apply the alpha mask
        newCgImage.mask(newAlpha);

        cg.image(newCgImage, x, y - newAlpha.height);
    } else {
        cg.image(newCg, x, y - newCg.height);
    }


    return true;
}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.jpg`;
    saveCount++;
    return fileName;
}

function keyPressed() {

    if (key === 's') {
        save(saveFileName());
    }
    if (key === "g") {
        // generate stack of images
        for (var i = 0; i < 25; i++) {
            clear();
            redraw();
            save(saveFileName());
        }

        return false;
    }
}
