class Shapes {
  caterpillar = function (obj) {
    let eH = 'height' in obj ? obj.height : 100;
    let eW = 'width' in obj ? obj.width : 100;
    let eX = 'x' in obj ? obj.x : 0;
    let eY = 'y' in obj ? obj.y : 0;
    let topHumps = 'humps' in obj && 'top' in obj.humps ? obj.humps.top : 5;
    let bottomHumps = 'humps' in obj && 'bottom' in obj.humps ? obj.humps.bottom : 5;
    let eGap = 'gap' in obj ? obj.gap : 50;

    let topHumpWidth = eW / topHumps;
    let bottomHumpWidth = eW / bottomHumps;

    beginShape();
    vertex(eX, eY + eH / 2);

    // top arches
    for (let i = 0; i < topHumps; i++) {
      // start of arc
      if (topHumpWidth > eH / 2) {
        vertex(eX + (topHumpWidth * i), eY + eH / 2);

      } else if (topHumpWidth < eGap) {
        vertex(eX + (topHumpWidth * i), eY + topHumpWidth);

      } else {
        vertex(eX + (topHumpWidth * i), eY + (eH / 2 - eGap / 2));
        vertex(eX + (topHumpWidth * i), eY + topHumpWidth);

      }

      // top of arc
      quadraticVertex(
            eX + (topHumpWidth * i),
            eY,
            eX + (topHumpWidth * i) + topHumpWidth / 2,
            eY
        );

      vertex(eX + (topHumpWidth * i) + topHumpWidth / 2, eY);

      // end of arc
      if (topHumpWidth > eH / 2) {
        quadraticVertex(
                eX + (topHumpWidth * (i + 1)),
                eY,
                eX + (topHumpWidth * (i + 1)),
                eY + eH / 2
            );

      } else if (topHumpWidth < eGap) {

        quadraticVertex(
                eX + (topHumpWidth * (i + 1)),
                eY,
                eX + topHumpWidth * (i + 1),
                eY + topHumpWidth
            );
        vertex(eX + (topHumpWidth * (i + 1)), eY + topHumpWidth);
        vertex(eX + (topHumpWidth * (i + 1)), eY + (eH / 2 - eGap / 2));

      } else {
        quadraticVertex(
                eX + (topHumpWidth * (i + 1)),
                eY,
                eX + topHumpWidth * (i + 1),
                eY + topHumpWidth
            );

        vertex(eX + (topHumpWidth * (i + 1)), eY + (eH / 2 - eGap / 2));

      }
    }

    vertex(eX + eW, eY + eH / 2);

    // bottom arches
    for (let i = bottomHumps; i > 0; i--) {
      // start of arc
      if (bottomHumpWidth > eH / 2) {
        vertex(eX + (bottomHumpWidth * i), eY + eH / 2);
      } else if (bottomHumps < eGap) {
        vertex(eX + (bottomHumpWidth * i), eY + eH - bottomHumpWidth);
      } else {
        vertex(eX + (bottomHumpWidth * i), eY + eH - (eH / 2 - eGap / 2));
      }

      // bottom of arc
      quadraticVertex(
            eX + (bottomHumpWidth * i),
            eY + eH,
            eX + (bottomHumpWidth * i) - (bottomHumpWidth / 2),
            eY + eH
        );
      vertex(eX + (bottomHumpWidth * i) - (bottomHumpWidth / 2), eY + eH);

      // end of arc
      if (bottomHumpWidth > eH / 2) {
        quadraticVertex(
              eX + (bottomHumpWidth * (i - 1)),
              eY + eH,
              eX + (bottomHumpWidth * (i - 1)),
              eY + eH / 2
          );
      } else {
        quadraticVertex(
              eX + bottomHumpWidth * (i - 1),
              eY + eH,
              eX + bottomHumpWidth * (i - 1),
              eY + eH - bottomHumpWidth
          );
        vertex(eX + (bottomHumpWidth * (i - 1)), eY + eH - (eH / 2 - eGap / 2));
      }
    }

    // end the shape
    vertex(eX, eY + eH / 2);

    endShape();

  };

  /**
  Add a drop shadow to an image
  */
  dropShadow = function (thisImg, shadowX, shadowY)
  {
    let thisPixels = [];
    let pixelGroup = 0;
    let strokes = [];
    let strokeW = 0;
    thisImg.loadPixels();

    for (let y = 0; y < thisImg.height; y++) {
      let firstIn = 0;
      let lastOut = 0;
      for (let x = 0; x < thisImg.width; x++) {
        let thisGroup = {
          x: x,
          y: y,
          r: thisImg.pixels[pixelGroup * 4],
          g: thisImg.pixels[pixelGroup * 4 + 1],
          b: thisImg.pixels[pixelGroup * 4 + 2],
          a: thisImg.pixels[pixelGroup * 4 + 3],
          firstIn: false,
          lastOut: false,
        };

        // find the first black in
        if (
          thisGroup.r === 0
          && thisGroup.g === 0
          && thisGroup.b === 0
          && thisGroup.a > 255 / 2
          && thisGroup.firstIn === false
        ) {
          thisGroup.firstIn = true;
          lastOut = false;
        }

        // Find the first time of a
        // transparent pixel after first in
        if (
          thisGroup.r === 255
          && thisGroup.g === 255
          && thisGroup.b === 255
          && thisGroup.a > 255 / 2
          && thisGroup.lastOut === false
        ) {
          thisGroup.lastOut = true;
          firstIn = false;
        }

        //  try and find the stroke weight
        if (
          thisGroup.r < 255
          && thisGroup.g < 255
          && thisGroup.b < 255
          && thisGroup.a > 255 / 2
        ) {
          strokeW++;
        } else if (
          (thisGroup.r === 255
          && thisGroup.g === 255
          && thisGroup.b === 255
          && thisGroup.a === 255)
          || thisGroup.a === 0
        ) {
          strokes.push(strokeW);
          strokeW = 0;
        }

        thisPixels.push(thisGroup);
        pixelGroup++;
      }
    }

    // Find small strokes
    let median = (new Helpers).median(strokes);
    let lowerStrokes = _.remove(strokes, function (n) {
      return n > 0 && n < median;
    });

    let strokesFiltered = _.remove(strokes, function (n) {
      return n > (new Helpers).average(lowerStrokes);
    });

    //console.log(thisPixels);
    let on = false;
    for (var i = 0; i < thisPixels.length; i++) {
      if (
        thisPixels[i].r === 255
        && thisPixels[i].g === 255
        && thisPixels[i].b === 255
        && thisPixels[i].a === 255
        && !on) {
        stroke(0, 0, 0, 255);

        strokeWeight(helpers.average(strokesFiltered));
        noFill();
        let p1 = createVector(thisPixels[i].x, thisPixels[i].y);

        let p2 = createVector(p1.x + shadowX, p1.y + shadowY);

        line(p1.x, p1.y, p2.x, p2.y);
        on = false;
      }

      if (
        (thisPixels[i].r === 0 && thisPixels[i].g === 0 && thisPixels[i].b === 0)
        || thisPixels[i].a === 255
        || thisPixels[i].x === thisImg.width - 1
    ) {
        on = false;
      }

      // Add the first in and last out so
      // that the shadow lines up with the
      // outside of the shape
      if (thisPixels[i].firstIn === true || thisPixels[i].lastOut === true) {
        let p1 = createVector(thisPixels[i].x, thisPixels[i].y);
        let p2 = createVector(p1.x + shadowX, p1.y + shadowY);
        strokeWeight(2);
        stroke(0, 0, 0, 255);
        line(p1.x, p1.y, p2.x, p2.y);
      }

    }

    image(thisImg, 0, 0);
  };
}
