function setup() {
	createCanvas(windowWidth, windowHeight);
	// put setup code here
}

// https://stackoverflow.com/a/63531127/405758
function quadLerp(p0, p1, p2, t){
  return lerp(lerp(p0, p1, t),
              lerp(p1, p2, t),
              t);
}

function draw() {

  stroke(0);
  background(255);
  noLoop();
  fill(0, 255, 0);

  caterpillar({
    width: 500,
    height: 300,
    x: 100,
    y: 100,
    humps: {
      top: 5,
      bottom: 4,
    },
    gap: 50,
  });

}

function caterpillar(obj)
{

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
  //ellipse(eX, eY + eH / 2, 10)

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
}
