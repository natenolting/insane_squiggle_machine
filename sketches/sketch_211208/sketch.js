let canvasWidth = 800;
let canvasHeight = 800;
let cells;
let cellsWidth;
let cellsHeight;
let saveId = new Helpers().makeid(10);
let saveCount = 0;
let cW;
let cH;
let cols;
let rows;
const colors = new Colors();
let colorList;
let hexColors;
const pallets = [
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

// lower number = tighter design
let cellVariance = 100;
let strokeVariance = .25;

function setupCells(cv) {
  cols = ceil(canvasWidth / cv);
  rows = ceil(canvasHeight / cv);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  cellsWidth = (cols - 2) * cW;
  cellsHeight = (rows - 2) * cH;
}

function setup() {
  setupCells(cellVariance);
  createCanvas(canvasWidth, canvasHeight, P2D);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
}

function draw() {
  noLoop();

  ////--------------------------------------------------------------------------------
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colors.HEXtoRGB(hexColors[i]);
    colorList.push(rgb);
  }
  ////--------------------------------------------------------------------------------

  background(0, 0, 100, 100);
  cells = _.shuffle(new Cells(cols, rows, cW, cH).populateCells(false)[0]);

  for (var i = 0; i < cells.length; i++) {
    const c = cells[i];
    fill(0, 0, 0, 100);

    noStroke();
    ellipse(c.cX, c.cY, c.w / 1.5, c.h / 1.5);
    //rect(c.x + cW / 4, c.y + cH / 4, cW / 2, cH / 2);

  }

////--------------------------------------------------------------------------------
  loadPixels();

  let pxls = [];
  let pixlX = 0;
  let pixlY = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixlX === canvasWidth) {
      pixlX = 0;
      pixlY++;
    }

    pxls.push({
      x: pixlX,
      y: pixlY,
      r: pixels[i],
      g: pixels[i + 1],
      b: pixels[i + 2],
      a: pixels[i + 3],
    });

    pixlX++;

  }

  //console.log(pxls);

  fill(0, 0, 100, 100);
  rect(0, 0, canvasWidth, canvasHeight);
  let useColor = random(colorList);
  let pixelsInc = 0;
  for (var i = 0; i < pxls.length; i++) {
    let pix = pxls[i];
    if (pix.r !== 255 && pix.g !== 255 && pix.b !== 255) {
      let hsl = colors.RGBtoHSL(pix.r, pix.g, pix.b);

      hsl.h = map(pix.y, 0, canvasHeight - 1, 1, 100);
      hsl.s = 100;
      hsl.l = map(hsl.l, 0, 50, 50, 100);
      // let hex = colors.h_s_lToHex(hsl.h, hsl.s, hsl.l);
      // let rgb = colors.HEXtoRGB(hex);
      //
      // pix.r = map(pix.y, 0, canvasHeight - 1, 100, useColor[0]);
      // pix.g = map(pix.y, 0, canvasHeight - 1, 100, useColor[1]);
      // pix.b = map(pix.y, 0, canvasHeight - 1, 100, useColor[2]);
      // let hsl = colors.RGBtoHSL(pix.r, pix.g, pix.b);

      //console.log(hex);
      fill(
        hsl.h,
        hsl.s,
        hsl.l,
        map(pix.a, 0, 255, 0, 100)
      );

      noStroke();
      rect(pix.x, pix.y, 1, 1);
    }
  }

  //updatePixels();

  /// ---------------------------------------------------------

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
    redraw();
  }

  if (key === "s") {
    save(saveFileName());
  }

  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 10; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}

// ------------------------------------------------------

function mousePressed() {

}
