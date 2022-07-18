import "./p5.min.js";

const COLOR = new Colors();
const HELPER = new Helpers();

function mapScale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const CONFIG = {
    noiseSeed: fxrand() * 999999,
    randomSeed: fxrand() * 999999,
    pallet: Math.floor(mapScale(fxrand(), 0, 1, 0, 4257)),
    density: fxrand(),
    control: Math.round(mapScale(fxrand(), 0, 1, .3, 1)),
    duplicates: fxrand(),
};

let palletData;
let pallets = [];
let pallet = {};
let cg;
let cells;
let columns = 1;
let rows = 1;
let cellWidth = 100;
let cellHeight = 100;

function setupPallet() {

    pallet.h = pallets[CONFIG.pallet];
    pallet.i = CONFIG.pallet;
    pallet.rgb = [];
    pallet.hsl = [];
    for (let p = 0; p < pallet.h.length; p++) {

        let c1 = COLOR.HEXtoRGB(pallet.h[p]);
        pallet.rgb.push(c1);
        let rgb = pallet.rgb[pallet.rgb.length - 1];
        pallet.hsl.push(COLOR.RGBtoHSL(rgb[0], rgb[1], rgb[2]));

        let cc1 = color(c1[0], c1[1], c1[2]);
        let c2;
        if(p + 1 === pallet.h.length) {
          c2 = COLOR.HEXtoRGB(pallet.h[0]);
        } else {
          c2 = COLOR.HEXtoRGB(pallet.h[p + 1]);
        }
        let cc2 = color(c2[0], c2[1], c2[2]);
        for (var amt = .2; amt < 1; amt+=.2) {
          let cc3 = lerpColor(cc1, cc2, amt);
          pallet.rgb.push(cc3.levels);
          rgb = pallet.rgb[pallet.rgb.length - 1];
          pallet.hsl.push(COLOR.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
        }


    }

}

function init() {
    pallets = palletData.pallets;
    setupPosition();
    setupPallet();
    prepCells();
}

const POS = {};
const ENLARGED_CANVAS_WIDTH = 2048;
const ENLARGED_CANVAS_HEIGHT = 2048;
const MARGIN = Math.floor(ENLARGED_CANVAS_WIDTH * 0.02);
const CANVAS_WIDTH_MULTIPLIER = 1
const CANVAS_HEIGHT_MULTIPLIER = 1

function setupPosition() {
    let cW = window.innerWidth;
    let cH = window.innerHeight;

    if (cW > cH) {
        POS.cW = cH;
        POS.cH = cH;
    } else {
        POS.cW = cW;
        POS.cH = cW;
    }

    let w = ENLARGED_CANVAS_WIDTH;
    let h = ENLARGED_CANVAS_HEIGHT;
    if (w > h) {
        POS.w = h;
        POS.h = h;
    } else {
        POS.w = w;
        POS.h = w;
    }
    POS.w = w * CANVAS_WIDTH_MULTIPLIER;
    POS.h = h * CANVAS_HEIGHT_MULTIPLIER;
}

function prepCells() {
    let rowColDiv = map(CONFIG.density, 0, 1, POS.w / 100, POS.w / 10);

    columns = Math.floor(POS.w / rowColDiv);
    rows = Math.floor(POS.h / rowColDiv);
    cellWidth = POS.w / columns;
    cellHeight = POS.h / rows;
    cells = (new Cells(columns, rows, cellWidth, cellHeight)).populateCells()[0];
}

window.preload = () => {
    palletData = loadJSON("./palettes.json");

}

window.$fxhashFeatures = {
    ...CONFIG,
};

window.setup = () => {
    init();
    pixelDensity(1);
    colorMode(RGB, 255, 255, 255, 1);
    createCanvas(POS.cW, POS.cH);
    noiseSeed(CONFIG.noiseSeed);
    randomSeed(CONFIG.randomSeed);
};

window.windowResized = () => {

};

let diviation = 2;

function generatePill(shapeW, shapeH) {
    let pill = (new VectorShape(0, shapeW, 0, shapeH)).pill();
    return pill;

}

function drawEllipseGradient(posX, posY, shapeW, shapeH) {


    let rColor = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    let rColor2 = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    let rColor3 = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];

    let c1 = color(rColor[0], rColor[1], rColor[2]);
    let c2 = color(rColor2[0], rColor2[1], rColor2[2]);
    let c3 = color(rColor3[0], rColor3[1], rColor3[2]);

    // shape
    let cgs = createGraphics(shapeW, shapeH);


    // mask
    let cgm = createGraphics(shapeW, shapeH);


    cgs.colorMode(RGB, 255, 255, 255, 1);
    cgm.colorMode(RGB, 255, 255, 255, 1);
    cgs.fill(rColor[0], rColor[1], rColor[2], 1);
    cgs.noStroke();

    let pill = generatePill(shapeW, shapeH);

    cgs.beginShape();
    for (const element of pill) {
        let v = element;
        cgs.vertex(v.x, v.y);
    }
    cgs.endShape(CLOSE);

    cgs.loadPixels();
    cgm.loadPixels();
    let px;
    let py;
    for (px = 0; px < cgs.width; px++) {
        for (py = 0; py < cgs.height; py++) {
            let index = (px + py * cgs.width) * 4;
            cgm.pixels[index] = 255;
            cgm.pixels[index + 1] = 255;
            cgm.pixels[index + 2] = 255;
            cgm.pixels[index + 3] = cgs.pixels[index + 3];
        }
    }
    cgm.updatePixels();

    for (py = 0; py < cgs.height; py++) {
        let lp = py / cgs.height;
        let cl = lerpColor(c1, c2, lp);
        cgs.fill(cl);
        cgs.rect(0, py, cgs.width, 1);
    }

    let c4;
    if (HELPER.flipACoin()) {
        c4 = color(255, 255, 255);
    } else {
        c4 = color(0, 0, 0);
    }
    c4.setAlpha(0);
    for (px = 0; px < cgs.width; px++) {
        let lp = px / cgs.width;
        let cl = lerpColor(c3, c4, lp);
        cgs.fill(cl);
        cgs.rect(px, 0, 1, cgs.height);
    }


    let masked;
    (masked = cgs.get()).mask(cgm);


    cg.image(masked, posX, posY, cgs.width, cgs.height);

}

function drawEllipse(posX, posY, shapeW, shapeH, strokeC = false, strokeW = false) {


    if(!strokeC) {
      strokeC = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    }

    if (!strokeW) {
      strokeW = floor(map(fxrand(), 0, 1, MARGIN * .1, MARGIN * .75));
    }

    // shape
    let cgs = createGraphics(shapeW + strokeW * 2, shapeH + strokeW * 2);
    cgs.translate(strokeW, strokeW);

    cgs.colorMode(RGB, 255, 255, 255, 1);
    cgs.stroke(strokeC[0], strokeC[1], strokeC[2], 1);
    cgs.strokeWeight(strokeW);
    cgs.noFill();

    let pill = generatePill(shapeW, shapeH);

    cgs.beginShape();
    for (const element of pill) {
        let v = element;
        cgs.vertex(v.x, v.y);
    }
    cgs.endShape(CLOSE);

    cg.image(cgs, posX, posY, cgs.width, cgs.height);

}

function duplicateDirection(direction, directionDistance) {
  switch(direction) {
    case(1):
      // north
      cg.translate(0, -directionDistance);
      break;
    case(2):
      // north east
      cg.translate(directionDistance, -directionDistance);
      break;
    case(3):
      // east
      cg.translate(directionDistance, 0);
      break;
    case(4):
      // south east
      cg.translate(directionDistance, directionDistance);
      break;
    case(5):
      // south
      cg.translate(0, directionDistance);
      break;
    case(6):
      // south west
      cg.translate(-directionDistance, directionDistance);
      break;
    case(6):
      // west
      cg.translate(-directionDistance, 0);
      break;
    case(7):
      // north west
      cg.translate(-directionDistance, -directionDistance);
      break;

  }
}

window.draw = () => {
    let i;
    noLoop();
    cg = createGraphics(POS.w, POS.h);
    cg.colorMode(RGB, 255, 255, 255, 1);

    cg.fill(255, 255, 255, 1);
    cg.rect(0, 0, POS.w, POS.h);

    let rColor = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    let rColor2 = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
    cg.fill(rColor[0], rColor[1], rColor[2], CONFIG.density);

    cg.rect(0, 0, POS.w, POS.h);
    let gridStrokeW = floor(map(CONFIG.density, 0, 1, 2, 4));
    // for (const element of cells) {
    //     let c = element;
    //     if((c.row === 0 || c.col === 0 || c.row === rows - 1 || c.col === columns - 1)) {
    //       continue;
    //     }
    //     cg.noFill();
    //     cg.stroke(rColor2[0], rColor2[1], rColor2[2], CONFIG.density);
    //     cg.strokeWeight(gridStrokeW);
    //     cg.rect(c.x + c.w / 8, c.y + c.h / 8, c.w - c.w / 4, c.h - c.h / 4, 0);
    //
    // }

    let iterations = floor(map(CONFIG.density, 0, 1, 25, 50));

    for (let p = 0; p < iterations; p++) {
        let ix = floor(map(fxrand(), 0, 1, MARGIN, POS.w));
        let iy = floor(map(fxrand(), 0, 1, MARGIN, POS.h));
        let iw = floor(map(fxrand(), 0, 1, MARGIN, POS.w));
        let ih = floor(map(fxrand(), 0, 1, MARGIN, POS.h));
        let direction = HELPER.rollADie(7);
        let directionDistance = floor(map(CONFIG.density, 0, 1, MARGIN * .5, MARGIN * 2));
        let duplicates = floor(map(CONFIG.density, 0, 1, 10, 1000));
        let strokeW = floor(map(fxrand(), 0, 1, MARGIN * .1, MARGIN * .75));
        let strokeC = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
        let overW, overH;
        if(CONFIG.control) {
          overW = (ix + iw) - (POS.w - MARGIN)
          overH = (iy + ih) - (POS.h - MARGIN);

          if (overW > 0) {
              iw = floor(iw - overW);
              if(iw <= 1) {
                continue;
              }
          }

          if (overH > 0) {
              ih = floor(ih - overH);
              if(ih <= 1) {
                continue;
              }
          }

          if (ix + iw === POS.w - MARGIN) {
              ix = floor(map(fxrand(), 0, 1, MARGIN, ix));
          }

          if (iy + ih === POS.h - MARGIN) {
              iy = floor(map(fxrand(), 0, 1, MARGIN, iy));
          }
        }

        if (HELPER.rollADie(6) > 2) {

            drawEllipseGradient(ix, iy, iw, ih);

        } else {
            if (!CONFIG.control && HELPER.rollADie(100) === floor(CONFIG.duplicates * 10)) {
              cg.push();
              cg.scale(0.9);
              for (var dup = 0; dup < duplicates; dup++) {
                duplicateDirection(direction, directionDistance);
                drawEllipse(0, 0, iw, ih, strokeC, strokeW);
              }
              cg.pop();
            } else {
              cg.push();
              cg.scale(0.9);
              drawEllipse(ix, iy, iw, ih);
              cg.pop();
            }

        }
    }

    // for overlay items that go in cells
    for (const element of cells) {
        let c = element;
        if((c.row === 0 || c.col === 0 || c.row === rows - 1 || c.col === columns - 1)) {
          continue;
        }
        rColor2 = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
        cg.noFill();
        if(HELPER.rollADie(50) === round(CONFIG.density * 10)) {

          cg.rect(c.x, c.y, c.w, c.h);
        }
        cg.stroke(rColor2[0], rColor2[1], rColor2[2], CONFIG.density);
        cg.strokeWeight(gridStrokeW);
        let roll = HELPER.rollADie(5);
        let lrpAmt, lerpP, lrp, v1, v2, v3;
        lrpAmt = 100 / round(CONFIG.density * map(CONFIG.density, 0, 1, .5, 1) * 10);
        //roll = 5;
        if(HELPER.rollADie(50) === round(CONFIG.density * 10)) {
          cg.noFill();
          //cg.ellipse(c.cX,c.cY, c.w/2, c.h/2);
          switch (roll) {
            case 1:
            // forward slash
              cg.line(c.x, c.y, c.x + c.w, c.y + c.h);
              break;
            case 2:
            // back slash
              cg.line(c.x + c.w, c.y, c.x, c.y + c.h);
              break;
            case 3:
            // vertical lines
              for (lrp = lrpAmt; lrp < 100; lrp+=lrpAmt) {
                lerpP = lrp / 100;
                v1 = createVector(c.x, c.y);
                v2 = createVector(c.x + c.w, c.y);
                v3 = p5.Vector.lerp(v1, v2, lerpP);
                cg.line(v3.x, c.y, v3.x, c.y + c.h);
              }
              break;
            case 4:
            // horizontal lines
              for (lrp = lrpAmt; lrp < 100; lrp+=lrpAmt) {
                lerpP = lrp / 100;
                v1 = createVector(c.x, c.y);
                v2 = createVector(c.x, c.y + c.h);
                v3 = p5.Vector.lerp(v1, v2, lerpP);
                cg.line(c.x, v3.y, c.x + c.w, v3.y);
              }
              break;
            case 5:
            // checker board
              for (lrp = lrpAmt; lrp < 100; lrp+=lrpAmt) {
                lerpP = lrp / 100;
                v1 = createVector(c.x, c.y);
                v2 = createVector(c.x + c.w, c.y);
                v3 = p5.Vector.lerp(v1, v2, lerpP);
                cg.line(v3.x, c.y, v3.x, c.y + c.h);
              }
              for (lrp = lrpAmt; lrp < 100; lrp+=lrpAmt) {
                lerpP = lrp / 100;
                v1 = createVector(c.x, c.y);
                v2 = createVector(c.x, c.y + c.h);
                v3 = p5.Vector.lerp(v1, v2, lerpP);
                cg.line(c.x, v3.y, c.x + c.w, v3.y);
              }
              break;
            default:

          }
        }

    }


    let dots = [];
    for (let x = 0; x < cg.width; x++) {
        for (let y = 0; y < cg.height; y++) {
            if (HELPER.rollADie(15) === 15) {
                dots.push(createVector(x, y));
            }
        }
    }
    cg.noStroke();


    cg.blendMode(OVERLAY);

    cg.noFill();
    for (i = 0; i < dots.length; i++) {
        let dot = dots[i];
        cg.strokeWeight(1);
        if (HELPER.flipACoin()) {
            cg.stroke(0, 0, 0, 1);
        } else {
            cg.stroke(255, 255, 255, 1);
        }
        cg.point(dot.x, dot.y);
    }

    image(cg, 0, 0, POS.cW, POS.cH);
    fxpreview();
}

let saveCount = 0;
let saveId = HELPER.makeid(10);

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {

    if (key === "s") {
        save(saveFileName());
    }
}
