let cols = 45;
let rows = 65;
let cW = 25;
let cH = 25;
let helpers = new Helpers();
let colors = new Colors();
let saveId = helpers.makeid(10);
let saveCount = 0;
let clouds = [];
let lightning = [];
let rain = [];

function preload() {
  for (let i = 1; i <= 14; i++) {
    clouds.push({ id: i, img: loadImage(`storm/cloud${i}.png`) });
  }

  for (let i = 1; i <= 10; i++) {
    lightning.push({ id: i, img: loadImage(`storm/lightning${i}.png`) });
  }

  for (let i = 1; i <= 16; i++) {
    rain.push({ id: i, img: loadImage(`storm/raindrop${i}.png`) });
  }
}

function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
}

function draw() {
  background(0, 0, 100, 100);
  noLoop();
  stroke(0, 0, 0, 100);
  noFill();
  rect(0, 0, width, height);

  let cloud = ceil(random(clouds.length - 1));
  let lightn = ceil(random(lightning.length - 1));
  let scaleL = .65;
  thunderCloud(
    cloud,
    lightn,
    (width / 2) - ((clouds[cloud].img.width * scaleL) / 2),
    cH,
    scaleL
  );

  cloud = ceil(random(clouds.length - 1));
  lightn = ceil(random(lightning.length - 1));
  scaleL = .35;
  thunderCloud(
    cloud,
    lightn,
    (width * (1 / 3)) - ((clouds[cloud].img.width * scaleL) / 2),
    cH * 3,
    scaleL
  );

  cloud = ceil(random(clouds.length - 1));
  lightn = ceil(random(lightning.length - 1));
  scaleL = .35;
  thunderCloud(
    cloud,
    lightn,
    (width * (2 / 3)) - ((clouds[cloud].img.width * scaleL) / 2),
    cH * 6,
    scaleL
  );

  cloud = ceil(random(clouds.length - 1));
  lightn = ceil(random(lightning.length - 1));
  scaleL = .35;
  thunderCloud(
    cloud,
    lightn,
    (width - cW * 2) - clouds[cloud].img.width * scaleL,
    cH * 3,
    scaleL
  );

  cloud = ceil(random(clouds.length - 1));
  lightn = ceil(random(lightning.length - 1));
  scaleL = .35;
  thunderCloud(
    cloud,
    lightn,
    cW * 2,
    cH,
    scaleL
  );

}

function thunderCloud(c, l, x, y, s) {
  let cloud = c;
  let lightn = l;
  push();
  translate(x, y);
  scale(s);

  // lightning
  let lW = lightning[lightn].img.width;
  let lH = lightning[lightn].img.height;
  let lX = (clouds[cloud].img.width / 2) - (lightning[lightn].img.width / 2);
  let lY = clouds[cloud].img.height / 2;
  let cW = clouds[cloud].img.width;

  if (lW > cW) {
    let scaleL = cW / lW;
    lW = lW * scaleL;
    lH = lH * scaleL;
    lX = lX * scaleL;
  }

  image(lightning[lightn].img, lX, lY, lW, lH);

  // cloud
  image(clouds[cloud].img, 0, 0);
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
    for (var i = 0; i < 25; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
