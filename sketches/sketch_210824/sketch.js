let cols = 60;
let rows = 75;
let cW = 50;
let cH = 50;
  let helpers = new Helpers();
  let colorClass = new Colors();
  let saveId = helpers.makeid(10);
let saveCount = 0;
let dots = [];
let lines = [];
let colors = [];
let hexColors;
let colorA;
let colorB;
let colorC;
let rot = 0.001;
let pallets = [
  ['f72585', 'b5179e', '7209b7', '560bad', '480ca8', '3a0ca3', '3f37c9', '4361ee', '4895ef', '4cc9f0'],
  ['d9ed92', 'b5e48c', '99d98c', '76c893', '52b69a', '34a0a4', '168aad', '1a759f', '1e6091', '184e77'],
  ['f94144', 'f3722c', 'f8961e', 'f9844a', 'f9c74f', '90be6d', '43aa8b', '4d908e', '577590', '277da1'],
  ['ffbe0b', 'fb5607', 'ff006e', '8338ec', '3a86ff'],
  ['011627', 'fdfffc', '2ec4b6', 'e71d36', 'ff9f1c'],
  ['2b2d42', '8d99ae', 'edf2f4', 'ef233c', 'd90429'],
];

function preload() {
  for (let i = 1; i <= 13; i++) {
    lines.push({ id: i, img: loadImage(`images/line-${i}.png`) });
  }

  for (let i = 1; i <= 12; i++) {
    dots.push({ id: i, img: loadImage(`images/dot-${i}.png`) });
  }
}

function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];

  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  newColors = helpers.shuffleArray(colors);
  colorA = newColors[0];
  colorB = newColors[1];
  colorC = newColors[2];
}

function draw() {
  background(0, 0, 100, 100);
  noLoop();
  let rotX = rot * -250;
  translate(rot * -250, height / 2);
  rotate(rot);
  rot -= 0.1;
  stroke(colorB.h, colorB.s, colorB.l, 5);
  strokeWeight(1);
  strokeCap(ROUND);
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      //rect(cW * c, cH * r, cW * c + cW, cH * c + cH);
    }
  }

  noFill();
  stroke(colorA.h, colorA.s, colorA.l, 25);

  for (var i = 0; i <= cols; i++) {
    let strokeW = i * 2.25;
    strokeWeight(strokeW);
    line(cW * i - (cW / 2), cH + strokeW / 2, cW * i - (cW / 2), height - cH - strokeW / 2);
    let lGraphic = random(lines);
    let lGraphicW = lGraphic.img.width * (strokeW / lGraphic.img.width);
    let lGraphicH = lGraphic.img.height * (strokeW / lGraphic.img.width);
    if (lGraphicW > lGraphic.img.width || lGraphicH > lGraphic.img.height) {
      lGraphicW = lGraphic.img.width;
      lGraphicH = lGraphic.img.height;
    }

    if (lGraphicH > height - cH * 2) {
      lGraphicW = lGraphic.img.width * ((height - cH * 2) / lGraphicH);
      lGraphicH = height - cH * 2;
    }

    tint(colorC.h, colorC.s, colorC.l, 100);
    image(
      lGraphic.img,
      cW * i - (cW / 2) - (strokeW / 2),
      cH,
      lGraphicW,
      lGraphicH
    );

    if (lGraphicH < (height - cH * 2)) {
      let remaining = height - (cH * 2) - lGraphicH;

      if (lGraphicH > remaining) {
        tint(colorB.h, colorB.s, colorB.l, 50);
        image(
          lGraphic.img,
          cW * i - (cW / 2) - (strokeW / 2),
          height - cH - lGraphicH,
          lGraphicW,
          lGraphicH
        );
      } else {
        tint(colorA.h, colorA.s, colorA.l, 100);
        image(
          lGraphic.img,
          cW * i - (cW / 2) - (strokeW / 2),
          height - cH - lGraphicH,
          lGraphicW,
          lGraphicH
        );
      }

    }

  }

  // let el = new CreateShape(width * (1 / 4), width * (3 / 4), height * (1 / 4), height * (3 / 4));
  // let points = el.ellipse();
  // let sp = [];
  // for (var i = 0; i < points.length; i++) {
  //   if (i % (points.length / 8) === 0) {
  //     sp.push(points[i]);
  //   }
  // }
  //
  // beginShape();
  // for (var i = 0; i < sp.length; i++) {
  //   vertex(sp[i].x, sp[i].y);
  // }
  //
  // vertex(sp[0].x, sp[0].y);
  // endShape();
  //
  // for (var i = 0; i < sp.length; i++) {
  //
  //   let current = sp[i];
  //   let next = i === sp.length - 1 ? sp[0] : sp[i + 1];
  //   let h = dist(current.x, current.y, next.x, next.y);
  //   let o = dist(next.x, next.y, current.x, next.y);
  //   let adj = dist(current.x, current.y, current.x, next.y);
  //   let a = acos(adj / h);
  //   //let a = ((8 - 2) * 180) / 8;
  //   console.log('-----------------------');
  //   console.log(adj);
  //   console.log(h);
  //   console.log(a);
  //   console.log('-----------------------');
  //
  //   push();
  //   stroke(colorB.h, colorB.s, colorB.l, 100);
  //   translate(current.x, current.y);
  //   ellipse(0,0,10);
  //   rotate(a);
  //   rect(0,0,h,h);
  //   pop();
  //
  // }
  //
  // ellipse(sp[0].x,sp[0].y,20);

}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === "Enter") {
    redraw();
  }

  if (key === "s") {
    save(saveFileName());
  }

  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 25; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
