const helper = new Helpers();
const colors = new Colors();

let canvasWidth = 2000;
let canvasHeight = 2000;

//----------------------------------------------------------------------------------------------------

/* Portions borrowed from By Steve's Makerspace
   Video: https://youtu.be/_9yK32iUHm0
   See note about color table at end.
   click on canvas = new; s for jpg
   Mess with variables below.  */
let wave = {
 minYchange : 1, //these two ranges determine line overlap and width
 maxYchange : 75,
 layers : 1,
 rotStripe : -3, //rotation of each stripe, try 10 or 90,
// try lines : true with high alph or lines : false with low alph (100)
 lines : true,
 alph : 100, //out of 100
 colRand : false, //true : random color, false : color from palette table
 filling : true,
 colorLines : false, //false for black lines
 sw : 4, //line width
 extraBlack : 0, //1 for some black line and white fills, 0 for neither, -2 for fewer colors,
 extraBlackAlph : 0, //out of 100 - used if extraBlack=1 & lines, filling, colorLines all true, low alph, high sw
 vertexVarA: 300, // base 300
 vertexVarB: 5000, // base 500
}

//----------------------------------------------------------------------------------------------------

/* Tower Settings */
let tower = {
  factor: 20,
  sideWFactor: 3,
  fillOpacity: 100,
  strokeOpacity: 100,
  margin: 25,
  sideWidth: 0,
  sideHeight: 0,
  lLow: .60,
  lMid: 0,
  lHigh: .85,
  sideHeightMultiple: 0.577396542692509,
  useGradients: false,
  useStrokes: false,
  strokeVWeight: 0.00875,
  strokeW: 1,
  directions: helper.range(1,7),
  lengthLow: 1,
  lengthHigh: 2,
  transparent: false,
}
tower.sideWidth = tower.factor / tower.sideWFactor;
tower.sideHeight = tower.sideWidth * tower.sideHeightMultiple;
tower.lMid = helper.average([tower.lLow, tower.lHigh]);

//----------------------------------------------------------------------------------------------------

let img;
let sImg;
let sIW;
let sIH;
let data;
let hexColors = [];
let colorList = [];
let pallet = [];
let saveId = helper.makeid(10);
let saveCount = 0;

function preload() {
  data = loadJSON("../../data/palettes.json");
}

function setup() {
  colorMode(HSL, 359, 100, 100, 100);
  pixelDensity(2);
  createCanvas(canvasWidth, canvasHeight);
  pallets = data.palettes;

}

function draw() {
  noLoop();
  background(0, 0, 100, 100);

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colorList = [];
  pallet = [];
  for (const item of hexColors) {
      let rgb = colors.HEXtoRGB(item);
      colorList.push(rgb);
      let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
      pallet.push(hsl);
  }

  img = waves();
  //image(wg, 0, 0, canvasWidth, canvasHeight);
  sIW = int(ceil(img.width / tower.factor));
  sIH = int(ceil(img.height / tower.factor));
  sImg = createImage(sIW, sIH);
  sImg.copy(img, 0, 0, img.width, img.height, 0, 0, sIW, sIH);
  tower.strokeW = sImg.width * tower.strokeVWeight;
  sImg.loadPixels();

  noStroke();
  fill(0, 0, 100, 100);
  rect(0, 0, sImg.width, sImg.height);

  // // base image for debuging
  // image(img, 0,0, canvasWidth, canvasHeight);
  // //this is the base image "pixelated", just for debugging
  // for (let x = 0; x < sImg.width; x++) {
  //     for (let y = 0; y < sImg.height; y++) {
  //       let index = (x + y * sImg.width) * 4
  //       let r = sImg.pixels[index];
  //       let g = sImg.pixels[index + 1];
  //       let b = sImg.pixels[index + 2];
  //       let hsl = colors.RGBtoHSL(r, g, b);
  //
  //       noStroke();
  //       fill(hsl.h, hsl.s, hsl.l, tower.opacity);
  //       rect(
  //         x * tower.factor + sImg.width / 2  - sImg.width / 2,
  //         y * tower.factor + sImg.height - sImg.height,
  //         img.width / sImg.width,
  //         img.height / sImg.height,
  //       );
  //     }
  //   }
  //
  // return;

  // first loop to blot out background
  for (let x = 0; x < sImg.width; x++) {
      for (let y = 0; y < sImg.height; y++) {


          let currentX = (x * tower.factor + sImg.width / 2) - sImg.width / 2;
          let currentY = (y * tower.factor + sImg.height) - sImg.height;

          let iso = new Isometric(
              currentX,
              currentY,
              tower.sideWidth,
              tower.sideHeight,
              tower.sideWidth
          );

          if (vectorsAreInsideBounds(iso)) {
              let index = (x + y * sImg.width) * 4
              let r = sImg.pixels[index];
              let g = sImg.pixels[index + 1];
              let b = sImg.pixels[index + 2];
              let hsl = colors.RGBtoHSL(r, g, b);
              fill(hsl.h, hsl.s, hsl.l, 100);
              iso.buildTopFace();
              iso.buildLeftFace();
              iso.buildRightFace();
          }

      }
  }



    let counter = 0;
    for (let x = 0; x < sImg.width; x++) {
        for (let y = 0; y < sImg.height; y++) {

            let index = (x + y * sImg.width) * 4
            let r = sImg.pixels[index];
            let g = sImg.pixels[index + 1];
            let b = sImg.pixels[index + 2];
            let hsl = colors.RGBtoHSL(r, g, b);
            let currentX = (x * tower.factor + sImg.width / 2) - sImg.width / 2;
            let currentY = (y * tower.factor + sImg.height) - sImg.height;
            let length = random(helper.range(tower.lengthLow, tower.lengthHigh)) * noise(
                currentX,
                currentY
            );
            let iso = new Isometric(
                currentX,
                currentY,
                tower.sideWidth,
                tower.sideHeight,
                random(helper.range(1, 10)) * noise(
                    currentX,
                    currentY
                )
            );

            let direct;
            if(Array.isArray(tower.directions)) {
                direct = random(tower.directions);
            } else {
                direct = tower.directions;
            }


            iso.pickDirection(direct, length);
            if (vectorsAreInsideBounds(iso)) {
                push();
                angleMode(DEGREES);
                translate(iso.startX, iso.startY);
                //rotate(random(helper.range(-10, 10)));
                iso.setStartX(0);
                iso.setStartY(0);
                iso.baseCoordinates();
                iso.pickDirection(direct, length);
                noStroke();
                fill(hsl.h, hsl.s, hsl.l, tower.fillOpacity);
                iso.buildLeftFace();

                fill(hsl.h, hsl.s, hsl.l * tower.lHigh, tower.fillOpacity);
                iso.buildTopFace();
                fill(hsl.h, hsl.s, hsl.l * tower.lLow, tower.fillOpacity);
                iso.buildRightFace();
                strokeWeight(tower.strokeW);
                strokeCap(ROUND);
                strokeJoin(ROUND);
                noFill();
                if (tower.useGradients) {
                    let aV = createVector(iso.a.x, iso.a.y);
                    let bV = createVector(iso.b.x, iso.b.y);
                    let cV = createVector(iso.c.x, iso.c.y);
                    let dV = createVector(iso.d.x, iso.d.y);
                    let eV = createVector(iso.e.x, iso.e.y);
                    let fV = createVector(iso.f.x, iso.f.y);
                    let gV = createVector(iso.g.x, iso.g.y);

                    let cbLerpDist = strokeW / p5.Vector.dist(cV, bV);
                    let gaLerpDist = strokeW / p5.Vector.dist(gV, aV);
                    let efLerpDist = strokeW / p5.Vector.dist(eV, fV);
                    let gcLerpDist = strokeW / p5.Vector.dist(gV, cV);
                    let cdLerpDist = strokeW / p5.Vector.dist(cV, dV);

                    // do left side gradient from base to mid
                    for (var i = 0; i < 1; i += cbLerpDist) {
                        let cbLerp = p5.Vector.lerp(cV, bV, i);
                        let gaLerp = p5.Vector.lerp(gV, aV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(1, tower.lMid, i), tower.strokeOpacity);
                        line(cbLerp.x, cbLerp.y, gaLerp.x, gaLerp.y);
                    }

                    // do right side gradient from base to low
                    for (var i = 0; i < 1; i += efLerpDist) {
                        let efLerp = p5.Vector.lerp(eV, fV, i);
                        let gaLerp = p5.Vector.lerp(gV, aV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(1, lLow, i), tower.strokeOpacity);
                        line(gaLerp.x, gaLerp.y, efLerp.x, efLerp.y);
                    }

                    // do bottom half of top from base to high
                    for (var i = 0; i < 1; i += gcLerpDist) {
                        let gcLerp = p5.Vector.lerp(gV, cV, i);
                        let geLerp = p5.Vector.lerp(gV, eV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(1, lHigh, i), tower.strokeOpacity);
                        line(gcLerp.x, gcLerp.y, geLerp.x, geLerp.y);
                    }

                    // do top half of top from high to mid
                    for (var i = 0; i < 1; i += cdLerpDist) {
                        let cdLerp = p5.Vector.lerp(cV, dV, i);
                        let edLerp = p5.Vector.lerp(eV, dV, i);
                        stroke(hsl.h, hsl.s, hsl.l * lerp(lHigh, tower.lMid, i), tower.strokeOpacity);
                        line(cdLerp.x, cdLerp.y, edLerp.x, edLerp.y);
                    }
                }
                if (tower.useStrokes) {
                    // add stroke edges
                    stroke(hsl.h, hsl.s, hsl.l * tower.lMid, tower.strokeOpacity);
                    iso.buildLeftFace();
                    iso.buildTopFace();
                    iso.buildRightFace();
                }

                pop();

            }
            counter++;
        }
    }
    console.log(`${counter} total cubes`);

}

function vectorsAreInsideBounds(iso) {
    return iso.a.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.a.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.a.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.a.y <= height - tower.margin - helper.rollADie(tower.margin * 2) &&
        iso.b.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.b.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.b.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.b.y <= height - tower.margin - helper.rollADie(tower.margin * 2) &&
        iso.c.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.c.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.c.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.c.y <= height - tower.margin - helper.rollADie(tower.margin * 2) &&
        iso.d.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.d.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.d.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.d.y <= height - tower.margin - helper.rollADie(tower.margin * 2) &&
        iso.e.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.e.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.e.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.e.y <= height - tower.margin - helper.rollADie(tower.margin * 2) &&
        iso.f.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.f.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.f.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.f.y <= height - tower.margin - helper.rollADie(tower.margin * 2) &&
        iso.g.x >= tower.margin + helper.rollADie(tower.margin * 2) && iso.g.y >= tower.margin + helper.rollADie(tower.margin * 2) && iso.g.x <= width - tower.margin - helper.rollADie(tower.margin * 2) && iso.g.y <= height - tower.margin - helper.rollADie(tower.margin * 2)
}

function waves() {
  let cg = createGraphics(canvasHeight,canvasWidth);
  cg.colorMode(HSL, 359, 100, 100, 100);
  let h, s, l, thisColor;
  if (wave.lines == true) {
    cg.stroke(0, 0, 0, wave.extraBlackAlph);
    cg.strokeWeight(wave.sw);
  } else {
    cg.noStroke();
  }
  cg.angleMode(DEGREES);
  let end = height / 2 + wave.vertexVarB; //where lines stop
  for (let i = 0; i < wave.layers; i++) {
    let y1;
    if (i == 0) {
      y1 = -height / 2 - wave.vertexVarA;
    } else {
      y1 = -height / 2 + (height / wave.layers) * i;
    }
    //starting height for each layer
    let y2 = y1,
      y3 = y1,
      y4 = y1,
      y5 = y1,
      y6 = y1;
    let rotLayer = random(359); //layer rotation
    let rotThisStripe = 0;
    //keep going until all the lines are at the bottom
    while (
      (y1 < end) &
      (y2 < end) &
      (y3 < end) &
      (y4 < end) &
      (y5 < end) &
      (y6 < end) &
      (-wave.maxYchange < wave.minYchange)
    ) {
      y1 += random(wave.minYchange, wave.maxYchange);
      y2 += random(wave.minYchange, wave.maxYchange);
      y3 += random(wave.minYchange, wave.maxYchange);
      y4 += random(wave.minYchange, wave.maxYchange);
      y5 += random(wave.minYchange, wave.maxYchange);
      y6 += random(wave.minYchange, wave.maxYchange);
      thisColor = random(pallet);
      if (wave.colRand == true) {
        h = random(359);
        s = random(100);
        l = random(100);
      } else {
        h = thisColor.h;
        s = thisColor.s;
        l = thisColor.l;
      }
      if (wave.filling == true) {
        cg.fill(h, s, l, 100);
      } else {
        cg.noFill();
      }
      if (wave.colorLines == true) {
        cg.stroke(h, s, l, 100);
      }
      cg.push();
      cg.translate(width / 2, height / 2);
      rotThisStripe += wave.rotStripe; //rotating after each stripe
      cg.rotate(rotThisStripe + rotLayer);
      let xStart = -width / 2;
      cg.beginShape();
      cg.curveVertex(xStart - wave.vertexVarA, height / 2 + wave.vertexVarB);
      cg.curveVertex(xStart - wave.vertexVarA, y1);
      cg.curveVertex(xStart + (width / 5) * 1, y2);
      cg.curveVertex(xStart + (width / 5) * 2, y3);
      cg.curveVertex(xStart + (width / 5) * 3, y4);
      cg.curveVertex(xStart + (width / 5) * 4, y5);
      cg.curveVertex(width / 2 + wave.vertexVarA, y6);
      cg.curveVertex(width / 2 + wave.vertexVarA, height / 2 + 500);
      cg.endShape(CLOSE);
      cg.pop();
    }
  }

  return cg;
}

function saveFileName() {

    let imageName;
    let settingsName;
    if (tower.transparent) {
        imageName = `${saveId}_${saveCount}.png`;
    } else {
        imageName = `${saveId}_${saveCount}.jpg`;
    }
    settingsName = `${saveId}_${saveCount}.json`

    saveCount++;
    return [imageName, settingsName];
}

function keyPressed() {
    if (key === "r") {
        window.location.reload(false);
    }

    if (key === "Enter") {
        clear();
        redraw();
    }
    if (key === 's') {
        const [imageName = 'imageName', settingsName = 'settingsName'] = saveFileName();
        // save the image
        save(imageName);
        // save the setitngs
        let writer = createWriter(settingsName);
        writer.write(getSettingsString());
        writer.close();

    }
    if (key === "g") {
        // generate stack of images
        for (var i = 0; i < 10; i++) {
            clear();
            redraw();
            const [imageName = 'imageName', settingsName = 'settingsName'] = saveFileName();
            // save the image
            save(imageName);
            // save the setitngs
            let writer = createWriter(settingsName);
            writer.write(getSettingsString());
            writer.close();
        }

        return false;
    }
}

getSettingsString = function() {
  return `{"wave": ${JSON.stringify(wave)}, "tower": ${JSON.stringify(tower)}, "pallet": ${JSON.stringify(pallet)}}`;
}

/* You are welcome to use the color table, but should probably credit me and the info below.
 Table obtained by scanning the nice-color-palette.png image located here: https://github.com/federico-pepe/nice-color-palettes
 ... which was created by that author from the top color palettes on ColourLovers.com. I did not use any of the code from the nice-color-palettes app.  */
