const cols = 15;
const rows = 15;
const cW = 225;
const cH = 225;
const baseStroke = 12;
const strokeVariance = 10;
const circleVariance = 50;
const circleDetail = [100, 1000, 2500];

const canvasWidth = cols * cW;
const canvasHeight = rows * cH;

let cells;
let helpers = new Helpers();
let colorClass = new Colors();
let saveId = helpers.makeid(10);
let saveCount = 0;
let hexColors;
let colorA;
let colorB;
let colorC;
let colorD;

function preload() {
    data = loadJSON("../../data/palettes.json");
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    colorMode(HSL, 359, 100, 100, 100);
    background(0, 0, 100, 100);
    pixelDensity(1);
    cells = (new Cells(cols, rows, cW, cH)).populateCells();
    pallets = data.palettes;

}

function underOver(base, variance) {
  let v = helpers.rollADie(variance);
  let vh = round(variance/2);
  let output = 0;
  if (v < vh) {
    output = base/v;
  } else if (v === vh) {
    output = base;
  } else {
    output = base * (v - vh);
  }

  return output;
}

function draw() {
    let current;
    let circles = [];

    noLoop();
    background(0, 0, 100, 100);


    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    colors = [];
    for (var i = 0; i < hexColors.length; i++) {
        let rgb = colorClass.HEXtoRGB(hexColors[i]);
        let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        colors.push(hsl);
    }

    cColors = helpers.shuffleArray(colors);
    colorA = cColors[0];
    colorB = cColors[1];
    colorC = cColors[2];
    colorD = cColors[3];


    noStroke();
    fill(colorD.h, colorD.s, colorD.l, 100);
    rect(1, 1, canvasWidth - 2, canvasHeight - 2);

    // fill the circles array
    let circlesCellSuffle = helpers.shuffleArray(cells[0]);
    for (var i = 0; i < circlesCellSuffle.length; i++) {
        current = circlesCellSuffle[i];
        let x1 = current.cX;
        let y1 = current.cY;
        let w1;
        let h1;
        let inter;

        // skip ourside cells
        if (
            current.row === 0
            || current.col === 0
            || current.row === rows - 1
            || current.col === cols - 1
        ) {
            continue;
        }


        let circRoll = helpers.rollADie(circleVariance);
        let halfCircleRoll = round(circleVariance / 2);
        if (circRoll < halfCircleRoll) {
            w1 = current.w / circRoll;
            h1 = current.h / circRoll;
        } else if (circRoll === halfCircleRoll) {
            w1 = current.w;
            h1 = current.h;
        } else {
            w1 = current.w * (circRoll - halfCircleRoll);
            h1 = current.h * (circRoll - halfCircleRoll);
        }
        thisCircle = new Cell(
            current.row,
            current.col,
            x1,
            y1,
            w1,
            h1,
            false,
        );

        if (intersectOthers(x1, y1, w1, circles)) {
            continue;
        }

        if (thisCircle.x - thisCircle.w / 2 <= 0
            || thisCircle.x + thisCircle.w / 2 >= canvasWidth
            || thisCircle.y - thisCircle.h / 2 <= 0
            || thisCircle.y + thisCircle.h / 2 >= canvasHeight
        ) {
            continue;
        }

        circles.push(thisCircle);
    }
    for (var i = 0; i < circles.length; i+=2) {
        current = circles[i];
        let cf = helpers.coinFlip();
        noStroke();
        if (cf) {
            fill(colorA.h, colorA.s, colorA.l, 100);
        } else {
            fill(colorB.h, colorB.s, colorB.l, 100);
        }

        let elip = (new VectorShape(current.x - current.w/2, current.x + current.w/2, current.y - current.h/2, current.y + current.h/2)).ellipse();
        beginShape();
        let elipOffset = random(circleDetail);
        for (var e = 0; e < elip.length; e+=elipOffset) {
          vertex(elip[e].x,elip[e].y);
        }
        endShape(CLOSE);
    }

    stroke(colorC.h, colorC.s, colorC.l, 100);
    noFill();
    for (var i = 0; i < cells[0].length; i++) {
        current = cells[0][i];

        // skip ourside cells
        if (
            current.row === 0
            || current.col === 0
            || current.row === rows - 1
            || current.col === cols - 1
        ) {
            continue;
        }

        noFill();
        strokeCap(ROUND);
        strokeWeight(underOver(baseStroke, strokeVariance));



        let direction = helpers.rollADie(8);
        noFill();
        beginShape(LINES);
        switch (direction) {
            case (1):
                vertex(current.x - current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w + current.w / 2, current.y + current.h / 2);
                break;
            case (2):
                vertex(current.x, current.y + current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w, current.y + current.h / 2);
                break;
            case (3):
                vertex(current.x + current.w / 2, current.y - current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h + current.h / 2);
                break;
            case (4):
                vertex(current.x + current.w / 2, current.y);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                break;
            case (5):
                vertex(current.x + current.w + current.w / 2, current.y - current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x - current.w / 2, current.y + current.h + current.h / 2);
            case (6):
                vertex(current.x + current.w, current.y);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x, current.y + current.h);
                break;
            case (7):
                vertex(current.x - current.w / 2, current.y - current.h / 2);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w + current.w / 2, current.y + current.h + current.h / 2);
                break;
            case (8):
                vertex(current.x, current.y);
                vertex(current.x + current.w / 2, current.y + current.h / 2);
                vertex(current.x + current.w, current.y + current.h);
                break;
            default:
                break;

        }
        endShape(CLOSE);
    }

    for (var i = 1; i < circles.length; i+=2) {
        current = circles[i];
        let cf = helpers.coinFlip();
        let ff = helpers.coinFlip();
        let roll = helpers.rollADie(4);
        noStroke();
        if (cf) {
            if (ff) {
                let randomizePallet = helpers.shuffleArray(colors);

                fill(randomizePallet[0].h, randomizePallet[0].s, randomizePallet[0].l, 100);
                stroke(randomizePallet[1].h, randomizePallet[1].s, randomizePallet[1].l, 100);
                strokeWeight(underOver(baseStroke, strokeVariance));
            } else {
                noFill();
                noStroke();
            }
            let elip = (new VectorShape(current.x - current.w/2, current.x + current.w/2, current.y - current.h/2, current.y + current.h/2)).ellipse();
            beginShape();
            let elipOffset = random(circleDetail);
            for (var e = 0; e < elip.length; e+=elipOffset) {
              vertex(elip[e].x,elip[e].y);
            }
            endShape(CLOSE);
        }
    }

}

function intersect(x1, y1, r1, x2, y2, r2) {
    let d = dist(x1, y1, x2, y2);
    if (d < r1 + r2) {
        return true;
    } else {
        return false;
    }
}

function intersectOthers(x1, y1, w1, others) {
    let inter = false;
    for (var i = 0; i < others.length; i++) {
        if (intersect(x1, y1, w1 / 2, others[i].x, others[i].y, others[i].w / 2)) {
            inter = true;
            break;
        }
    }

    return inter;
}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

function keyPressed() {
    if (key === 'Enter') {
        redraw();
    }

    if (key === 's') {
        save(saveFileName());
    }

    if (key === 'g') {
        // generate stack of images
        for (var i = 0; i < 10; i++) {
            redraw();
            save(saveFileName());
        }

        return false;
    }
}
