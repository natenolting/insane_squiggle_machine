const helper = new Helpers();
let sSize = [0, 0]; // [0, 0] for fullscreen
let saveId = helper.makeid(10);
let saveCount = 0;

// Keywords that usually work well with pixel sorting
let keywords = ['winter', 'waterfall', 'iceberg', 'car', 'desert', 'mountain'];

let url = "https://source.unsplash.com/";

let direction = "vertical";
let threshold = 50;
let pixelDistance = 1;

let editable = false;
let editRadius = 30;

let img, startImg;
let changes;
let ps;
function preload() {

  if (min(sSize) == 0) {
		sSize = [windowWidth, windowHeight];
	}
	startImg = loadImage(url + str(sSize[0]) + 'x' + str(sSize[1]) + '/?' + random(keywords));
}

function setup() {
  img = createGraphics(startImg.width, startImg.height);
	img.image(startImg, 0, 0);
	createCanvas(img.width, img.height);
  ps = new PixelSort(img, direction, threshold, pixelDistance);
  ps.detectPixelChanges(false);
  ps.generatePixelSort();
}

function draw() {

  image(ps.img, 0, 0);
	if (editable) {
		push();
		stroke(0, 255, 0, 100);
		noFill();
		circle(mouseX, mouseY, editRadius * 2);
		pop();
	}
}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.jpg`;
    saveCount++;
    return fileName;
}

function mouseWheel(event) {
	if (editable) {
		editRadius += event.delta / 10;
		editRadius = constrain(editRadius, 5, 400);
	}
}

function mouseClicked() {
	if (editable) {
		ps.img.image(startImg, 0, 0);
		ps.img.loadPixels();
		ps.removeChangesCloseTo(mouseX, mouseY, editRadius);
		ps.generatePixelSort(changes);
	}
}

function keyPressed() {
  if (keyCode === ENTER) {
    editable ^= true;
  }
    if (key === 's') {
        save(saveFileName());
    }

}
