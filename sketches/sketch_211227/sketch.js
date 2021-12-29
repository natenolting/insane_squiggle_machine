const canvasHeight = 1080;
const canvasWidth = 1920;
const density = 75;
const cols = Math.floor(canvasWidth / density);
const rows = Math.floor(canvasHeight / density);
const cW = canvasWidth / cols;
const cH = canvasHeight / rows;
const helpers = new Helpers();
let currentCol = 0;
let currentRow = 0;
let h = 0;
let s = 0;
let l = 0;
let colorList;
let hexColors;
let saveId = helpers.makeid(10);
let saveCount = 0;
let screensFilled = 0;
const colors = new Colors();
const pallets = [
  // https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
  ["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"],
  // https://coolors.co/f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0
  ["f72585","b5179e","7209b7","560bad","480ca8","3a0ca3","3f37c9","4361ee","4895ef","4cc9f0"],
  // https://coolors.co/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08
  ["03071e","370617","6a040f","9d0208","d00000","dc2f02","e85d04","f48c06","faa307","ffba08"],
  // https://coolors.co/ff6d00-ff7900-ff8500-ff9100-ff9e00-240046-3c096c-5a189a-7b2cbf-9d4edd
  ["ff6d00","ff7900","ff8500","ff9100","ff9e00","240046","3c096c","5a189a","7b2cbf","9d4edd"],
  // ["FBB042", "58595B", "231F20", "ffffff"],
  ["e63946","f1faee","a8dadc","457b9d","1d3557"],
  // https://coolors.co/000000-14213d-fca311-e5e5e5-ffffff
  ["000000","14213d","fca311","e5e5e5","ffffff"]

];
let pallet = [];

function pickAPallet() {
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colors.HEXtoRGB(hexColors[i]);
    colorList.push(rgb);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    pallet.push(hsl);
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 0, 100);
  pickAPallet();

}

function draw() {
  // translate((-cW * 0.01) * (screensFilled - 1), (cH * 0.005) * (screensFilled - 1));
  // rotate(-0.001 * screensFilled);
  noStroke();
  pallet = _.shuffle(pallet);
  let averageCR = helpers.average([currentCol, currentRow]);
  let cWHMultiplier = 1;
  if (helpers.rollADie(25) === 25) {
    cWHMultiplier = helpers.rollADie(25);
  }
  //cWHMultiplier = 3;
  if (cWHMultiplier > 1 ) {

    fill(
      pallet[pallet.length - 1].h,
      pallet[pallet.length - 1].s,
      pallet[pallet.length - 1].l,
      //90
      100 - map(currentCol, 1, averageCR, 0, 10)
    );

    push();
    translate(currentCol * cW, currentRow * cH);
    // noFill();
    // stroke(
    //   pallet[pallet.length - 1].h,
    //   pallet[pallet.length - 1].s,
    //   pallet[pallet.length - 1].l,
    //   100
    // );
    // translate(currentCol * cW, currentRow * cH);
    // rect(0,0, cW, cH);
    //
    // rect(
    //   -(cW * .5 * cWHMultiplier) * .5 + cW * .5,
    //   -(cH * .5 * cWHMultiplier) * .5 + cH * .5,
    //   cW * .5 * cWHMultiplier,
    //   cH * .5 * cWHMultiplier
    // );


    // console.log(
    //   `Average: ${averageCR}`,
    //   `current row: ${currentRow}`,
    //   `Map: ${map(currentCol, 1, averageCR, 0, 10)}`
    // );
    (new Shapes).caterpillar({
      height: cW * .5 * cWHMultiplier,
      width: cH * .5 * cWHMultiplier,
      x: -(cW * .5 * cWHMultiplier) * .5 + cW * .5,
      y: -(cH * .5 * cWHMultiplier) * .5 + cH * .5,
      humps: {
        top: helpers.rollADie(10),
        bottom: helpers.rollADie(10),
      },
    });
    pop();


    currentCol = 0;
    currentRow += floor((cH * .5 * cWHMultiplier) / cH * .50);
  } else {
    let newRoll = helpers.rollADie(3);
    let baseOffset = .18;

    fill(
      pallet[0].h,
      pallet[0].s,
      pallet[0].l,
      //baseOffset * 100
      map(currentCol, 1, cols, baseOffset * 100 , 90)
    );
    rect(currentCol * cW, currentRow * cH, cW, cH);

    fill(
      pallet[pallet.length - 1].h,
      pallet[pallet.length - 1].s,
      pallet[pallet.length - 1].l,
      map(currentRow, 1, rows, baseOffset * 100 , 50)
    );


    switch (newRoll) {
      case 1:
      ellipse(
        currentCol * cW + (cW / 2),
        currentRow * cH + (cH / 2),
        cW * (1 - baseOffset * 2),
        cH * (1 - baseOffset * 2)
      );
        break;
      case 2:
      triangle(
        currentCol * cW + (cW * baseOffset), currentRow * cH + (cH * (1 - baseOffset)),
        currentCol * cW + (cW / 2), currentRow * cH + (cH * baseOffset),
        currentCol * cW + (cW * (1 - baseOffset)), currentRow * cH + (cH * (1 - baseOffset)),
      );

        break;
      case 3:

      rect(
        currentCol * cW + (cW / 2) - (cW * (baseOffset / 2)),
        currentRow * cH + (cH / 2) - (cH * (baseOffset / 2)),
        cW * baseOffset, cH * baseOffset
      );

      rect(
        currentCol * cW + (cW * baseOffset), currentRow * cH + (cH * baseOffset),
        cW * baseOffset, cH * baseOffset,
      );

      rect(
        currentCol * cW + cW - (cW * (baseOffset * 2)), currentRow * cH + (cH * baseOffset),
        cW * baseOffset, cH * baseOffset,
      );

      rect(
        currentCol * cW + (cW * baseOffset), currentRow * cH + cH - (cH * (baseOffset * 2)),
        cW * baseOffset, cH * baseOffset,
      );

      rect(
        currentCol * cW + cW - (cW * (baseOffset * 2)), currentRow * cH + cH - (cH * (baseOffset * 2)),
        cW * baseOffset, cH * baseOffset,
      );

        break;
      default:

    }
  }


  if (cWHMultiplier === 1) {
    currentCol++;
    if (currentCol * cW >= canvasWidth) {
      currentCol = 0;
      currentRow++;
    }

    if (currentRow * cH >= canvasHeight) {
      currentRow = 0;
      screensFilled++;
      //noLoop();
    }
  }


  if (screensFilled >= 1 && screensFilled % 10 === 0) {
    save(saveFileName());
    // rotate(0);
    pickAPallet();
    erase(255, 255);
    rect(
      -canvasWidth * screensFilled,
      -canvasHeight * screensFilled,
      canvasWidth * screensFilled * 2,
      canvasHeight * screensFilled * 2
    );
    noErase();
    background(0, 0, 0, 100);
    screensFilled = 0;
    redraw();
  }

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
