const wW = 4000;
const wH = 4000;
const maxScale = 0.65;
let saveCount = 0;
let images = [];
const maxIterations = 1000;

function preload() {
  for (let i = 1; i <= 86; i++) {
    images.push({ id: i, img: loadImage(`images/${i}.png`) });
  }
}

function setup() {
  createCanvas(wW, wH);
  colorMode(HSB, 359, 100, 100, 100);
}

function saveFileName() {
  let fileName = `screenshot_i_${maxIterations}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function coinFlip()
{
  return boolean(round(random(1)));
}

function squiggle(img) {
  push();
  scale(random(0.125, maxScale));
  rotate(random(45, 180));
  if (coinFlip()) {
    push();
    scale(-1.0, 1.0);
    image(img.img, img.img.width - img.img.width * 2, 0);
    pop();
  } else {
    image(img.img, 0, 0);
  }

  pop();
}

function draw() {
  noLoop();
  background(0, 0, 100, 100);
  stroke(0, 100, 100, 100);
  strokeWeight(5);
  noFill();
  translate(wW / 2, wH / 2);

  // shuffle the deck
  let sImages = _.shuffle(images);
  // for (var m = 0; m < maxIterations; m++) {
  //   for (var i = 0; i < sImages.length; i++) {
  //     let img = sImages[i];
  //     squiggle(img);
  //     m++;
  //   }
  //   // shuffle desk between outer loop
  //   sImages = _.shuffle(images);
  // }

  for (var m = 0; m < maxIterations; m++) {
    squiggle(sImages[0]);
  }

  // debugging
  // line(0, -wH / 2, 0, wH / 2);
  // line(-wW / 2, 0, wW / 2, 0);
  // fill(0, 100, 100, 100);
  // ellipse(0, 0, 50);

  console.log(`${maxIterations} iteration reached!`);

  //save(saveFileName());
}

function keyPressed() {
  if (key === 'Enter') {
    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }
}
