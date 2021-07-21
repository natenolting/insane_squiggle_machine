const wW = 10000;
const wH = 10000;
let saveCount = 0;
let images = [];
const maxIterations = 500;

function preload() {
  for (let i = 1; i <= 48; i++) {
    images.push({ id: i, img: loadImage(`images/squiggle-${i}.png`) });
  }
}

function setup() {
  createCanvas(wW, wH);
  colorMode(HSB, 359, 100, 100, 100);
}

function saveFileName()
{
  let fileName = `screenshot_i_${maxIterations}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function squiggle()
{
  const thisCurrentImg = random(images);

  push();
  translate(random(wW / 4.25, wW / 1.25), random(wH / 4.75, wH / 1.25));
  scale(random(0.125, .9));
  rotate(random(45, 180));
  if (thisCurrentImg) {
    image(thisCurrentImg.img, 0, 0);
  }

  pop();
}

function draw() {
  noLoop();
  background(0, 0, 100, 100);
  for (var i = 1; i <= maxIterations; i++) {
    squiggle();
  }

  console.log(maxIterations + ' iteration reached!');
  save(saveFileName());
}

function keyPressed() {
  if (key === 'Enter') {
    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }
}
