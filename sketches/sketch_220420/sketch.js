const helper = new Helpers();
const color = new Colors();


const imgMultiplier = 12;
const factor = 1.4;
const margin = 5;
let img;
let sImg;
let siW, sIH;
let canvasWidth;
let canvasHeight;
let cells = [];
let saveId = helper.makeid(10);
let saveCount = 0;
function preload() {
    img = loadImage(`../images/maps/bemidji-crop.png`);
}

function setup() {
  pixelDensity(2);
  colorMode(RGB, 255, 255, 255, 1);
  canvasWidth = img.width * imgMultiplier;
  canvasHeight = img.height * imgMultiplier;
	createCanvas(canvasWidth, canvasHeight);
  sIW = ceil(img.width / factor);
  sIH = ceil(img.height / factor);
  sImg = createImage(int(sIW), int(sIH));
  sImg.copy(img, 0, 0, img.width, img.height, 0, 0, sIW, sIH);
}

function vectorsAreInsideBounds(iso) {
    return iso.a.x >= margin + helper.rollADie(margin * 2) && iso.a.y >= margin + helper.rollADie(margin * 2) && iso.a.x <= width - margin - helper.rollADie(margin * 2) && iso.a.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.b.x >= margin + helper.rollADie(margin * 2) && iso.b.y >= margin + helper.rollADie(margin * 2) && iso.b.x <= width - margin - helper.rollADie(margin * 2) && iso.b.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.c.x >= margin + helper.rollADie(margin * 2) && iso.c.y >= margin + helper.rollADie(margin * 2) && iso.c.x <= width - margin - helper.rollADie(margin * 2) && iso.c.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.d.x >= margin + helper.rollADie(margin * 2) && iso.d.y >= margin + helper.rollADie(margin * 2) && iso.d.x <= width - margin - helper.rollADie(margin * 2) && iso.d.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.e.x >= margin + helper.rollADie(margin * 2) && iso.e.y >= margin + helper.rollADie(margin * 2) && iso.e.x <= width - margin - helper.rollADie(margin * 2) && iso.e.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.f.x >= margin + helper.rollADie(margin * 2) && iso.f.y >= margin + helper.rollADie(margin * 2) && iso.f.x <= width - margin - helper.rollADie(margin * 2) && iso.f.y <= height - margin - helper.rollADie(margin * 2) &&
        iso.g.x >= margin + helper.rollADie(margin * 2) && iso.g.y >= margin + helper.rollADie(margin * 2) && iso.g.x <= width - margin - helper.rollADie(margin * 2) && iso.g.y <= height - margin - helper.rollADie(margin * 2)
}

function draw() {
  noLoop();
  fill(255, 255, 255, 1);
  noStroke();
  rect(0 ,0, canvasWidth, canvasHeight);
  //image(sImg,0,0,sImg.width,sImg.width)
  sImg.loadPixels();

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
            index
        );
        c.fill = [r, g, b];
        cells.push(c);
    }
  }


  for (var i = 0; i < cells.length; i++) {
    let c = cells[i];
    let x1 = c.x * factor;
    let y1 = c.y * factor;
    let x2 = x1 + c.w * factor
    let y2 = y1 + c.h * factor
    fill(c.fill[0], c.fill[1], c.fill[2], 1);
    noStroke();
    //rect(c.x * factor, c.y * factor, c.w * factor, c.h * factor);
    // beginShape();
    // vertex(x1,y1);
    // vertex(x2,y1);
    // vertex(x2,y2);
    // vertex(x1,y2);
    // endShape(CLOSE);

    let iso = new Isometric(
      x2 - ((x2 - x1) / 2),
      y2,
      (x2 - x1) / 2,
      ((x2 - x1) / 2) * (new Isometric()).heightMultiple,
      random(1,2)
    );
    iso.pickDirection(random([1,7]), random(3));
    if (vectorsAreInsideBounds(iso)) {
      // do faces
      fill(c.fill[0], c.fill[1], c.fill[2], 1);
      iso.buildTopFace();
      fill(c.fill[0] * 0.75, c.fill[1] * 0.75, c.fill[2] * 0.75, 1);
      iso.buildLeftFace();
      fill(c.fill[0] * 0.55, c.fill[1] * 0.55, c.fill[2] * 0.55, 1);
      iso.buildRightFace();

      // do border
      noFill()
      stroke(c.fill[0] * 0.55, c.fill[1] * 0.55, c.fill[2] * 0.55, .5);
      strokeWeight((x2 - x1) / 2 * .1);
      strokeJoin(ROUND);
      iso.buildTopFace();
      iso.buildLeftFace();
      iso.buildRightFace();
    }

  }
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
