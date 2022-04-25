const helper = new Helpers();
const color = new Colors();


const imgMultiplier = 5;
const factor = 3;
const margin = 25;
const mediumColor = .80;
const darkColor = .60;
let img;
let sImg;
let sIW, sIH;
let canvasWidth;
let canvasHeight;
let cells = [];
let saveId = helper.makeid(10);
let saveCount = 0;

function preload() {
    img = loadImage(`../images/botanical/masdevallia-veitchiana-1885-1906.png`);
}

function setup() {
    pixelDensity(2);
    colorMode(RGB, 255, 255, 255, 1);
    canvasWidth = img.width * imgMultiplier;
    canvasHeight = img.height * imgMultiplier;
    createCanvas(canvasWidth, canvasHeight);
    console.log(canvasWidth, canvasHeight);
    sIW = ceil(img.width / factor);
    sIH = ceil(img.height / factor);
    sImg = createImage(int(sIW), int(sIH));
    sImg.copy(img, 0, 0, img.width, img.height, 0, 0, sIW, sIH);
}

function isoIsInsideBounds(iso, m = 10) {
    return iso.a.x >= m + helper.rollADie(m * 2) && iso.a.y >= m + helper.rollADie(m * 2) && iso.a.x <= width - m - helper.rollADie(m * 2) && iso.a.y <= height - m - helper.rollADie(m * 2) &&
        iso.b.x >= m + helper.rollADie(m * 2) && iso.b.y >= m + helper.rollADie(m * 2) && iso.b.x <= width - m - helper.rollADie(m * 2) && iso.b.y <= height - m - helper.rollADie(m * 2) &&
        iso.c.x >= m + helper.rollADie(m * 2) && iso.c.y >= m + helper.rollADie(m * 2) && iso.c.x <= width - m - helper.rollADie(m * 2) && iso.c.y <= height - m - helper.rollADie(m * 2) &&
        iso.d.x >= m + helper.rollADie(m * 2) && iso.d.y >= m + helper.rollADie(m * 2) && iso.d.x <= width - m - helper.rollADie(m * 2) && iso.d.y <= height - m - helper.rollADie(m * 2) &&
        iso.e.x >= m + helper.rollADie(m * 2) && iso.e.y >= m + helper.rollADie(m * 2) && iso.e.x <= width - m - helper.rollADie(m * 2) && iso.e.y <= height - m - helper.rollADie(m * 2) &&
        iso.f.x >= m + helper.rollADie(m * 2) && iso.f.y >= m + helper.rollADie(m * 2) && iso.f.x <= width - m - helper.rollADie(m * 2) && iso.f.y <= height - m - helper.rollADie(m * 2) &&
        iso.g.x >= m + helper.rollADie(m * 2) && iso.g.y >= m + helper.rollADie(m * 2) && iso.g.x <= width - m - helper.rollADie(m * 2) && iso.g.y <= height - m - helper.rollADie(m * 2)
}

function backgroundInsideBounds(vectors, m = 10) {

    return vectors.a.x >= m + helper.rollADie(m * 2) && vectors.a.y >= m + helper.rollADie(m * 2) && vectors.a.x <= width - m - helper.rollADie(m * 2) && vectors.a.y <= height - m - helper.rollADie(m * 2) &&
        vectors.b.x >= m + helper.rollADie(m * 2) && vectors.b.y >= m + helper.rollADie(m * 2) && vectors.b.x <= width - m - helper.rollADie(m * 2) && vectors.b.y <= height - m - helper.rollADie(m * 2) &&
        vectors.c.x >= m + helper.rollADie(m * 2) && vectors.c.y >= m + helper.rollADie(m * 2) && vectors.c.x <= width - m - helper.rollADie(m * 2) && vectors.c.y <= height - m - helper.rollADie(m * 2) &&
        vectors.d.x >= m + helper.rollADie(m * 2) && vectors.d.y >= m + helper.rollADie(m * 2) && vectors.d.x <= width - m - helper.rollADie(m * 2) && vectors.d.y <= height - m - helper.rollADie(m * 2)
}

function draw() {
    noLoop();
    fill(255, 255, 255, 1);
    noStroke();
    rect(0, 0, canvasWidth, canvasHeight);
    //image(sImg,0,0,sImg.width,sImg.width)
    sImg.loadPixels();
    let cellIndex = 0;
    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {
            let index = (x + y * sImg.width) * 4;
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            fill(r, g, b, 1);
            noStroke();
            let c = new Cell(
                x,
                y,
                x * imgMultiplier,
                y * imgMultiplier,
                imgMultiplier,
                imgMultiplier,
                false,
                cellIndex
            );
            c.fill = [r, g, b];
            cells.push(c);
            cellIndex++;
        }
    }
    // do background to fill in any dead spots
    for (let c of cells) {

        let x1 = c.x * factor;
        let y1 = c.y * factor;
        let x2 = x1 + c.w * factor
        let y2 = y1 + c.h * factor
        fill(c.fill[0], c.fill[1], c.fill[2], 1);
        noStroke();

        // Create background fill
        let bgVectors = {
            a: createVector(x1, y1),
            b: createVector(x2, y1),
            c: createVector(x2, y2),
            d: createVector(x1, y2),
        }

        if (backgroundInsideBounds(bgVectors, margin * 1.375)) {
            ellipse(c.cX * factor, c.cY * factor, c.w * 1.5 * factor, c.h * 1.5 * factor)
            // beginShape();
            // vertex(bgVectors.a.x, bgVectors.a.y);
            // vertex(bgVectors.b.x, bgVectors.b.y);
            // vertex(bgVectors.c.x, bgVectors.c.y);
            // vertex(bgVectors.d.x, bgVectors.d.y);
            // endShape(CLOSE);
        }
    }
    let used  = 0;
    for (let c of cells) {

        if (helper.rollADie(6) === 6) {
          continue;
        }
        let x1 = c.x * factor;
        let y1 = c.y * factor;
        let x2 = x1 + c.w * factor
        let y2 = y1 + c.h * factor
        fill(c.fill[0], c.fill[1], c.fill[2], 1);
        noStroke();

        let iso = new Isometric(
            x1 + ((x2 - x1) * noise(x1, y1)),
            y2,
            (x2 - x1) / 2,
            ((x2 - x1) / 2) * (new Isometric()).heightMultiple,
            4 * noise(x1, y1)
        );
        let dirPercent = noise(x1 * c.index, y2 * c.index);
        let direction = 1;
        if (dirPercent < .45) {
          direction = 6;
        } else if (dirPercent > .65) {
          direction = 7;
        }
        iso.pickDirection(direction, 8 * dirPercent);
        if (isoIsInsideBounds(iso, margin * .75)) {
          used++;

            let xDiviation = (iso.a.x - iso.b.x) * noise(c.index) * 1.75;
            if (helper.isEven(c.index)) {
              xDiviation = xDiviation * -1;
            }

            if(direction === 1) {
              xDiviation = xDiviation/4;
            }

            let yDiviation = noise(c.index);

            //do faces


            fill(c.fill[0] * mediumColor, c.fill[1] * mediumColor, c.fill[2] * mediumColor, 1);
            iso.buildTopFace();

            fill(c.fill[0], c.fill[1], c.fill[2], 1);
            beginShape();
            vertex(iso.a.x,iso.a.y);
            vertex(iso.b.x,iso.b.y);
            quadraticVertex(iso.c.x + xDiviation, lerp(iso.c.y, iso.b.y, yDiviation), iso.c.x,iso.c.y);
            vertex(iso.c.x,iso.c.y);
            vertex(iso.g.x,iso.g.y);
            quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.a.x,iso.a.y);
            endShape(CLOSE);

            //iso.buildLeftFace();
            fill(c.fill[0] * darkColor, c.fill[1] * darkColor, c.fill[2] * darkColor, 1);

            beginShape();
            vertex(iso.a.x,iso.a.y);
            quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.g.x ,iso.g.y);
            vertex(iso.e.x,iso.e.y);
            quadraticVertex(iso.e.x + xDiviation, lerp(iso.f.y, iso.e.y, yDiviation), iso.f.x ,iso.f.y);
            endShape(CLOSE);
            //iso.buildTopFace();

            //iso.buildRightFace();

            // do border
            noFill()
            stroke(c.fill[0] * darkColor, c.fill[1] * darkColor, c.fill[2] * darkColor, .5);
            strokeWeight((x2 - x1) / 2 * .1);
            strokeJoin(ROUND);
            iso.buildTopFace();

            beginShape();
            vertex(iso.a.x,iso.a.y);
            vertex(iso.b.x,iso.b.y);
            quadraticVertex(iso.c.x + xDiviation, lerp(iso.c.y, iso.b.y, yDiviation), iso.c.x,iso.c.y);
            vertex(iso.c.x,iso.c.y);
            vertex(iso.g.x,iso.g.y);
            quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.a.x,iso.a.y);
            endShape(CLOSE);

            beginShape();
            vertex(iso.a.x,iso.a.y);
            quadraticVertex(iso.g.x + xDiviation, lerp(iso.g.y, iso.a.y, yDiviation), iso.g.x ,iso.g.y);
            vertex(iso.e.x,iso.e.y);
            quadraticVertex(iso.e.x + xDiviation, lerp(iso.f.y, iso.e.y, yDiviation), iso.f.x ,iso.f.y);
            endShape(CLOSE);
        }

    }
    console.log(`${used} blocks used.`);

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
