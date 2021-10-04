// 8x10"
let canvasWidth = 3300;
let canvasHeight = 5100;
let cols = 15;
let rows = 20;
let cW = canvasWidth / cols;
let cH = canvasHeight / rows;

let helpers = new Helpers();
let colorClass = new Colors();
let transform = new Transform();
let shapes = new Shapes();
let colors = [];
let saveId = helpers.makeid(10);
let saveCount = 0;
let squiggles = [];
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

  // let squiggleList = new LoadImages([...Array(13).keys()]).listSquggles();
  // for (let i = 0; i < squiggleList.length; i++) {
  //   squiggles.push(loadImage(squiggleList[i]));
  // }
  let stormList = new LoadImages([0]).listStorm();
  for (let i = 0; i < stormList.length; i++) {
    squiggles.push(loadImage(stormList[i]));
  }

}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);

}

function draw() {
  background(0, 0, 100, 100);
  noLoop();
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
  let shuffleColors = helpers.shuffleArray(colors);
  let randomizedCells = helpers.shuffleArray(cells[0]);
  for (var c = 0; c < randomizedCells.length; c++) {

    if (c === floor(randomizedCells.length * (3/8))) {
      let slashColor = shuffleColors[0];
      fill(slashColor.h, slashColor.s, slashColor.l, 100);
      stroke(0,0,0,100);
      strokeWeight(cW * (3/4) * (1/4));
      neutral();
    }

    if (c === floor(randomizedCells.length * (5/8))) {
      let slashColor2 = shuffleColors[1];
      fill(slashColor2.h, slashColor2.s, slashColor2.l, 100);
      stroke(0,0,0,100);
      strokeWeight(cW * (3/4) * (1/4));
      neutral();
    }


    noFill();
    noStroke();
    doSquiggle(randomizedCells[c].x, randomizedCells[c].y);
  }
  // create margin
  doMargin();
}

function neutral() {
  let neutral = helpers.rollADie(7);
  //let neutral = 7;
  switch (neutral) {
    case (1):
      ellipse(width / 2, height / 2, width - cW * 4);
      break;
    case (2):
      push();
      translate(width / 2, height / 2);
      rotate(radians(45));
      scale(125);
      strokeWeight(3/8);
      beginShape();
      vertex(-5,-10);
      vertex(5,-10);
      vertex(5,-5);
      vertex(10,-5);
      vertex(10,5);
      vertex(5,5);
      vertex(5,10);
      vertex(-5,10);
      vertex(-5,5);
      vertex(-10,5);
      vertex(-10,-5);
      vertex(-5,-5);
      endShape(CLOSE);
      pop();
      break;
    case (3):
      beginShape();
      vertex(cW * 2, cH * 2);
      vertex(cW * 7, cH * 2);
      vertex(width - cW * 2, height - cH * 2);
      vertex(width - cW * 7, height - cH * 2);
      endShape(CLOSE);
      break;
    case (4):
      beginShape();
      vertex(width - cW * 2, cH * 2);
      vertex(width - cW * 7, cH * 2);
      vertex(cW * 2, height - cH * 2);
      vertex(cW * 7, height - cH * 2);
      endShape(CLOSE);
      break;
    case (5):
      beginShape();
      vertex(width / 2, cH * 2);
      vertex(width - cW * 2, height - cH * 2);
      vertex(cW * 2, height - cH * 2);
      endShape(CLOSE);
      break;
    case (6):
      push();
      ellipse(width / 2, 0, width);
      ellipse(width / 2, height, width);
      pop();
      break;
    case (7):
      shapes.caterpillar({
          width: width * (2/3),
          height: height * (2/3),
          x: (width * (1/3)) / 2,
          y: (height * (1/3)) / 2,
          humps: {
            top: helpers.rollADie(8),
            bottom: helpers.rollADie(8),
          },
          gap: height * (1/8),
        });
      break;
    default:
      break;

  }
}

function doMargin() {
  // margin
  thisCW = cW * (3/4);
  thisCH = cH * (3/4);
  rectMode(CORNER);
  fill(0, 0, 100, 100);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  beginContour();
  vertex(thisCW, thisCH);
  bezierVertex(
    thisCW, thisCH,
    thisCW * 2, height / 2,
    thisCW, height - thisCH
  );
  vertex(thisCW, height - thisCH);
  bezierVertex(
    thisCW, height - thisCH,
    width / 2, height - thisCH * 2,
    width - thisCW, height - thisCH
  );
  vertex(width - thisCW, height - thisCH);
  bezierVertex(
    width - thisCW, height - thisCH,
    width - thisCW * 2, height / 2,
    width - thisCW, thisCH
  );
  vertex(width - thisCW, thisCH);
  bezierVertex(
    width - thisCW, thisCH,
    width / 2, thisCH * 2,
    thisCW, thisCH
  );
  endContour();
  endShape(CLOSE);

  stroke(0, 0, 0, 100);
  noFill();
  // strokeWeight(thisCW * (1/32));
  // curvyBorder(thisCW * (1 + 1/8), thisCH * (1 + 1/8));

  strokeWeight(thisCW * (1/4));
  //rect(thisCW, thisCH, width - thisCW * 2, height - thisCH * 2);
  curvyBorder(thisCW, thisCH);
  // // thin border
  // strokeWeight(thisCW * (1/16));
  // curvyBorder(thisCW * (3/4), thisCH * (3/4));
  //
  // // thinner border
  // strokeWeight(thisCW * (1/32));
  // curvyBorder(thisCW * (((3/4)+(3/8))/2), thisCH * (((3/4)+(3/8))/2));
  //
  //
  // // even thinner border
  // strokeWeight(thisCW * (1/64));
  // curvyBorder(thisCW * (3/8), thisCH * (3/8));

  // // corners
  // strokeWeight(thisCW * (1/16));
  // let cornerOffset = (55/64);
  // rectMode(CENTER);
  //
  // // top left
  // fill(0, 0, 100, 100);
  // stroke(0, 0, 0, 100);
  // rect(thisCW * cornerOffset, thisCH * cornerOffset, thisCW, thisCH);
  // fill(colors[0].h, colors[0].s, colors[0].l, 100);
  // noStroke();
  // ellipse(thisCW * cornerOffset, thisCH * cornerOffset, thisCW / 2);
  //
  // // top right
  // fill(0, 0, 100, 100);
  // stroke(0, 0, 0, 100);
  // rect(width - thisCW * cornerOffset, thisCH * cornerOffset, thisCW, thisCH);
  // fill(colors[1].h, colors[1].s, colors[1].l, 100);
  // noStroke()
  // ellipse(width - thisCW * cornerOffset, thisCH * cornerOffset, thisCW / 2);
  //
  // // bottom right
  // fill(0, 0, 100, 100);
  // stroke(0, 0, 0, 100);
  // rect(width - thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW, thisCH);
  // fill(colors[2].h, colors[2].s, colors[2].l, 100);
  // noStroke();
  // ellipse(width - thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW / 2);
  //
  // // bottom left
  // fill(0, 0, 100, 100);
  // stroke(0, 0, 0, 100);
  // rect(thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW, thisCH);
  // fill(colors[3].h, colors[3].s, colors[3].l, 100);
  // noStroke();
  // ellipse(thisCW * cornerOffset, height - thisCH * cornerOffset, thisCW / 2);
}

curvyBorder = function (thisCW, thisCH) {
  beginShape();
  vertex(thisCW, thisCH);
  bezierVertex(
    thisCW, thisCH,
    thisCW * 2, height / 2,
    thisCW, height - thisCH
  );
  vertex(thisCW, height - thisCH);
  bezierVertex(
    thisCW, height - thisCH,
    width / 2, height - thisCH * 2,
    width - thisCW, height - thisCH
  );
  vertex(width - thisCW, height - thisCH);
  bezierVertex(
    width - thisCW, height - thisCH,
    width - thisCW * 2, height / 2,
    width - thisCW, thisCH
  );
  vertex(width - thisCW, thisCH);
  bezierVertex(
    width - thisCW, thisCH,
    width / 2, thisCH * 2,
    thisCW, thisCH
  );
  endShape(CLOSE);
}

function doSquiggle(x, y) {

  let thisColors = helpers.shuffleArray(colors);
  let colorA = thisColors[0];
  let colorB = thisColors[1];
  let flip = helpers.rollADie(6);
  //let flip = 100000;
  let thisImage = squiggles[Math.floor(_.random(squiggles.length - 1))];
  thisImage.filter(GRAY);

  push();
  imageMode(CENTER);
  translate(x,y);
  let thisScale = random(0.2, 1);
  scale(thisScale);

  let thisRotation = radians(random(-45, 45));
  rotate(thisRotation);

  if (helpers.rollADie(50) === 50) {
    thisImage.filter(INVERT);
  }

  switch (flip) {
    case (1):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imgRotatePi(thisImage, x, y,);
      break;
    case (2):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imgRotateHalfPi(thisImage, x, y);
      break;
    case (3):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imgRotateHalfPiCc(thisImage, x, y);
      break;
    case (4):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imageFlipV(thisImage, x, y);
      break;
    case (5):
      tint(colorA.h, colorA.s, colorA.l, 100);
      transform.imageFlipH(thisImage, x, y);
      break;
    default:
      tint(0 , 0, 100, 100);
      image(thisImage, 0, 0);
      break;
  };

  pop();

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
