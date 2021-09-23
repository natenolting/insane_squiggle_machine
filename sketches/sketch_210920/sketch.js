// 8x10"
let canvasWidth = 4500;
let canvasHeight = 4500;
let cols = 6;
let rows = 6;
let sc = .90;
let cW = canvasWidth / cols;
let cH = canvasHeight / rows;

let helpers = new Helpers();
let colorClass = new Colors();
let transform = new Transform();
let colors = [];
let saveId = helpers.makeid(10);
let saveCount = 0;
let squiggles = [];
let paperHexColors = ["ffe699","ffebae","fff0c2"]
let pallets = [
  // https://coolors.co/e63946-f1faee-a8dadc-457b9d-1d3557
  ["e63946","f1faee","a8dadc","457b9d","1d3557"],
  // https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
  ["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"],
  //https://coolors.co/ffa69e-faf3dd-b8f2e6-aed9e0-5e6472
  ["ffa69e","faf3dd","b8f2e6","aed9e0","5e6472"],
  // https://coolors.co/3772ff-f038ff-ef709d-e2ef70-70e4ef
  ["3772ff","f038ff","ef709d","e2ef70","70e4ef"],
  // https://coolors.co/050505-1b9aaa-dddbcb-f5f1e3-ffffff-6d5a72
  ["050505","1b9aaa","dddbcb","f5f1e3","ffffff","6d5a72"],
  // https://coolors.co/2b2d42-8d99ae-edf2f4-ef233c-d90429
  ["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
  // https://coolors.co/1c3144-d00000-ffba08-a2aebb-3f88c5
  ["1c3144","d00000","ffba08","a2aebb","3f88c5"]
];
let hexColors;
let colorA;
let colorB;
let colorC;
let colorD;

let cells;

let border;

function preload() {


  for (let i = 1; i <= 60; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-11/${i}.png`));
  }

  for (let i = 1; i <= 34; i++) {
    squiggles.push(loadImage(`../images/squiggles/set-12/${i}.png`));
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
  for (var i = 0; i < squiggles.length; i++) {
    squiggles[i].filter(INVERT);
  }

}

function draw() {
  noLoop();
  background(0, 0, 100, 100);
  paper(100000);

  stroke(0, 0, 0, 100);
  noFill();

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colors = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  cells = (new Cells(cols, rows, cW, cH)).populateCells();

  for (let i = 0; i < cells[0].length; i++) {
    let current = cells[0][i];
    let c = random(colors);

    if (current.col === 0 || current.row === 0 || current.col === cols - 1 || current.row === rows - 1 ) {
        continue;
    }
    noStroke();
    fill(c.h, c.s, c.l, 100);
    //fill(0,0,100,100);
    cells[0][i].c = c;
    ellipse(
      current.x + current.w / 2,
      current.y + current.h / 2,
      current.w * sc,
      current.h * sc
    )
    // rect(
    //   current.x + (current.w - current.w * sc) / 2,
    //   current.y + (current.h - current.h * sc) / 2,
    //   current.w * sc,
    //   current.h * sc,
    //   50
    // );

  }

  for (var o = 0; o < 100; o++) {

    for (let i = 0; i < cells[0].length; i++) {
      let current = cells[0][i];
      if (current.col === 0 || current.row === 0 || current.col === cols - 1 || current.row === rows - 1 ) {
          continue;
      }
      //rect(current.x,current.y,current.w,current.h);
      let thisImage = squiggles[Math.floor(_.random(squiggles.length - 1))];
      if ((thisImage.width > current.w * 1.1) || (thisImage.height > current.h * 1.1)) {
        continue;

      }
      push();
      //let thisImage = squiggles[29];
      let flip = helpers.rollADie(8);
      //let flip = 6
      tint(
        current.c.h,
        ceil(random(100)),
        ceil(random(100)),
        90
      );
      //tint(c.h, c.s, c.l, 75);
      //tint(0,0,0,100);
      let x = current.x + current.w / 2;
      let y = current.y + current.h / 2;


      switch (flip) {
        case (1):
          transform.imgRotatePi(thisImage, x - thisImage.width, y - thisImage.height, CENTER);
          break;
        case (2):
          transform.imgRotateHalfPi(thisImage, x - thisImage.width / 2, y - thisImage.height / 2);
          break;
        case (3):
          transform.imgRotateHalfPiCc(thisImage, x - thisImage.width / 2, y - thisImage.height / 2);
          break;
        case (4):
          transform.imageFlipV(thisImage, x - thisImage.width / 2, y - thisImage.height / 2);
          break;
        case (5):
          transform.imageFlipH(thisImage, x - thisImage.width / 2, y - thisImage.height / 2);
          break;
        case (6):
          transform.imgRotate(thisImage, x - thisImage.width / 2, y - thisImage.height / 2, radians(ceil(random(100))));
          break;
        default:
          push();
          translate(x,y)
          imageMode(CENTER)
          image(thisImage, 0, 0);
          pop();
          break;
      };
      pop();
      //break;
    }
    //break;
  }

}

function paper(dots = 10000) {

  paperColors = [];
  for (var i = 0; i < paperHexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(paperHexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    paperColors.push(hsl);
  }
  paperColorsS = helpers.shuffleArray(paperColors);

  fill(paperColorsS[0].h, paperColorsS[0].s, paperColorsS[0].l, 100);
  rect(0,0,canvasWidth, canvasWidth);

  noFill();
  for (let i = 0; i < dots; i++) {
    let x1 = Math.random() * canvasWidth;
    let y1 = Math.random() * canvasHeight;
    let theta = Math.random() * 2 * Math.PI;
    let segmentLength = Math.random() * 5 + 2;
    let x2 = Math.cos(theta) * segmentLength + x1;
    let y2 = Math.sin(theta) * segmentLength + y1;
    stroke(
      paperColorsS[1].h,
      paperColorsS[1].s - Math.random() * 10,
      paperColorsS[1].l - Math.random() * 75,
      Math.random() * 10
    );

    line(x1, y1, x2, y2);
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
