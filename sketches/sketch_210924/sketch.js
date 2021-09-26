let squiggles = [];
let helpers = new Helpers();
let shapes = new Shapes();

function preload() {
  squiggles.push(loadImage(`img2.png`));
}


function setup() {
	createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  noLoop();
  push();
  translate(50, 100);
  image(squiggles[0], 0, 0);
  pop();
  push();
  translate(400, 100);
  shapes.dropShadow(squiggles[0], -50, 100);
  pop();

}
