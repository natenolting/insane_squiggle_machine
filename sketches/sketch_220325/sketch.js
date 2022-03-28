const helper = new Helpers();
// --------------------------------------------------------------------------------------------------
// Settings
// 2750 x 4250 = 11x17" @ 250 ppi
let margin = 100;
let canvasWidth = window.innerHeight - margin;
let canvasHeight = window.innerHeight - margin;
canvasWidth = 3000;
canvasHeight = 3000;
let iterations = 10000;
let sizeVariation = [1,5];
let lengthVariation = helper.range(1, 150);
let cubeSideWidth = 12;
let directionBetween = helper.range(1,7);
let pixelD = 4;
let opacity = 100;

// --------------------------------------------------------------------------------------------------

let cubeSideHeightMultiple = 0.577396542692509;
let cubeSideHeight = cubeSideWidth * cubeSideHeightMultiple;
//canvasHeight = (canvasWidth / 2) * cubeSideHeightMultiple * 4;
let data;
let pallets;
let cols = Math.floor(canvasWidth / cubeSideWidth);
let rows = Math.floor(canvasHeight / cubeSideHeight);

let saveId = helper.makeid(10);
let saveCount = 0;

const colors = new Colors();
let colorList;
let hexColors;

function vectorsAreInsideBounds(iso) {
    return iso.a.x >= margin && iso.a.y >= margin && iso.a.x <= canvasWidth - margin && iso.a.y <= canvasHeight - margin &&
        iso.b.x >= margin && iso.b.y >= margin && iso.b.x <= canvasWidth - margin && iso.b.y <= canvasHeight - margin &&
        iso.c.x >= margin && iso.c.y >= margin && iso.c.x <= canvasWidth - margin && iso.c.y <= canvasHeight - margin &&
        iso.d.x >= margin && iso.d.y >= margin && iso.d.x <= canvasWidth - margin && iso.d.y <= canvasHeight - margin &&
        iso.e.x >= margin && iso.e.y >= margin && iso.e.x <= canvasWidth - margin && iso.e.y <= canvasHeight - margin &&
        iso.f.x >= margin && iso.f.y >= margin && iso.f.x <= canvasWidth - margin && iso.f.y <= canvasHeight - margin &&
        iso.g.x >= margin && iso.g.y >= margin && iso.g.x <= canvasWidth - margin && iso.g.y <= canvasHeight - margin
}

function shapeCrossesContainer(container, iso) {
    // check if the new isometric object collides with the bottom, left or right of the container.
    let crosses = false;
    let containerVectorGroups = [
        [container.a.x, container.a.y, container.b.x, container.b.y],
        [container.b.x, container.b.y, container.c.x, container.c.y],
        [container.c.x, container.c.y, container.d.x, container.d.y],
        [container.d.x, container.d.y, container.e.x, container.e.y],
        [container.f.x, container.f.y, container.e.x, container.e.y],
        [container.a.x, container.a.y, container.f.x, container.f.y],
    ]
    let newIsoVectorGroups = [
        [iso.a.x, iso.a.y, iso.g.x, iso.g.y],
        [iso.a.x, iso.a.y, iso.b.x, iso.b.y],
        [iso.b.x, iso.b.y, iso.c.x, iso.c.y],
        [iso.c.x, iso.c.y, iso.d.x, iso.d.y],
        [iso.e.x, iso.e.y, iso.d.x, iso.d.y],
        [iso.e.x, iso.e.y, iso.f.x, iso.f.y],

    ];
    for (let cvg of containerVectorGroups) {
        for (let civg of newIsoVectorGroups) {
            if (intersects(civg[0], civg[1], civg[2], civg[3], cvg[0], cvg[1], cvg[2], cvg[3])) {
                crosses = true;
            }
        }
    }

    // check if outside of sides
    if (dist(0, 0, iso.a.x, 0) < margin) {
        crosses = true;
    }
    if (dist(container.e.x, 0, canvasWidth, 0) < margin ) {
        crosses = true;
    }

    return crosses;
}

function pickPallet() {
    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    colorList = [];
    let pallet = [];
    for (const item of hexColors) {
        let rgb = colors.HEXtoRGB(item);
        colorList.push(rgb);
        let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        pallet.push(hsl);
    }
    return pallet;
}

function preload() {
    data = loadJSON("../../data/palettes.json");

}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    console.log();
    colorMode(HSL, 359, 100, 100, 100);
    pixelDensity(pixelD);
    pallets = data.palettes;
}

function fillSides(iso, basic, color) {

    // fill(color.h, color.s, color.l, opacity);
    // iso.buildTopFace();
    iso.build(color.h, color.s, color.l);
    return;

    let faceLength = dist(
        iso.g.x,
        iso.g.y,
        iso.c.x,
        iso.c.y
    );
    let baseLength = dist(
        basic.g.x,
        basic.g.y,
        basic.c.x,
        basic.c.y
    );
    let lerpDistance = baseLength / faceLength / 2;
    stroke(color.h, color.s, color.l, opacity);

    strokeWeight(3);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    //noStroke();

    for (let l = 0; l <= 1; l += lerpDistance) {
        line(
            lerp(iso.g.x, iso.c.x, l),
            lerp(iso.g.y, iso.c.y, l),
            lerp(iso.e.x, iso.d.x, l),
            lerp(iso.e.y, iso.d.y, l),
        );
    }

    faceLength = dist(
        iso.a.x,
        iso.a.y,
        iso.g.x,
        iso.g.y
    )
    lerpDistance = baseLength / faceLength / 2;
    for (let l = 0; l <= 1; l += lerpDistance) {
        line(
            lerp(iso.a.x, iso.g.x, l),
            lerp(iso.a.y, iso.g.y, l),
            lerp(iso.b.x, iso.c.x, l),
            lerp(iso.b.y, iso.c.y, l),
        );
    }

    faceLength = dist(
        iso.a.x,
        iso.a.y,
        iso.g.x,
        iso.g.y
    )
    lerpDistance = baseLength / faceLength / 4;
    for (let l = 0; l <= 1; l += lerpDistance) {
        line(
            lerp(iso.a.x, iso.g.x, l),
            lerp(iso.a.y, iso.g.y, l),
            lerp(iso.f.x, iso.e.x, l),
            lerp(iso.f.y, iso.e.y, l),
        );
    }
    noFill();
    iso.buildTopFace();
    iso.buildLeftFace();
    iso.buildRightFace();
}

function positionOnIso(iso) {
    let lerpSpot;
    let startingPoint;
    if (helper.flipACoin()) {
        lerpSpot = random(0, 1);
        startingPoint = {x: lerp(iso.a.x, iso.b.x, lerpSpot), y: lerp(iso.a.y, iso.b.y, lerpSpot)};
    } else {
        lerpSpot = random(0, 1);
        startingPoint = {x: lerp(iso.a.x, iso.f.x, lerpSpot), y: lerp(iso.a.y, iso.f.y, lerpSpot)};
    }

    return startingPoint;
}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
// https://stackoverflow.com/a/24392281
function intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

function draw() {
    noLoop();

    let sizeOfShape;
    let roll;
    let multiple;
    let basicIso = new Isometric(canvasWidth / 2, canvasHeight / 2, cubeSideWidth, cubeSideHeight, 1);
    let containerMultiplier = (canvasHeight - (margin * 2)) / dist(basicIso.a.x, basicIso.a.y, basicIso.d.x, basicIso.d.y);
    let containerIso = new Isometric(canvasWidth / 2, canvasHeight - margin, cubeSideWidth, cubeSideHeight, containerMultiplier);
    let startingPoint;
    let resetIso = false;


    // background(0, 0, 100, 100);
    // noStroke();
    // fill(0, 0, 100, 100);
    // rect(0, 0, canvasWidth, canvasHeight);

    hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
    colorList = [];
    let pallet = [];
    for (const item of hexColors) {
        let rgb = colors.HEXtoRGB(item);
        colorList.push(rgb);
        let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
        pallet.push(hsl);
    }


    if (Array.isArray(directionBetween)) {
        roll = random(directionBetween);
    } else {
        roll = helper.rollADie(7);
    }

    if (Array.isArray(sizeVariation)) {
        sizeOfShape = random(sizeVariation);
    } else {
        sizeOfShape = helper.rollADie(sizeVariation);
    }

    if (Array.isArray(lengthVariation)) {
        multiple = random(lengthVariation);
    } else {
        multiple = helper.rollADie(lengthVariation);
    }

    startingPoint = positionOnIso(containerIso);

    let iso = new Isometric(startingPoint.x, startingPoint.y, cubeSideWidth, cubeSideHeight, sizeOfShape);
    iso.pickDirection(roll, multiple);
    let thisColor = random(pallet);

    if (vectorsAreInsideBounds(iso) && !shapeCrossesContainer(containerIso, iso)) {
        fillSides(iso, basicIso, thisColor);
    }
    let oldIso = iso;
    for (let i = 0; i < iterations; i++) {

        if (Array.isArray(directionBetween)) {
            roll = random(directionBetween);
        } else {
            roll = helper.rollADie(7);
        }
        // starting point "g" seems to give the best result
        if (resetIso === true) {
            startingPoint = positionOnIso(containerIso);
        } else {
            startingPoint = {x: oldIso.g.x, y: oldIso.g.y};
        }

        let newIso = new Isometric(
            startingPoint.x,
            startingPoint.y,
            cubeSideWidth,
            cubeSideHeight,
            sizeOfShape
        );

        multiple = helper.rollADie(lengthVariation);
        newIso.pickDirection(roll, multiple);

        // if we hit a wall or collided with the container reset the starting point/size
        if (!vectorsAreInsideBounds(newIso) || shapeCrossesContainer(containerIso, newIso)) {
            resetIso = true;
            if (Array.isArray(sizeVariation)) {
                sizeOfShape = random(sizeVariation);
            } else {
                sizeOfShape = helper.rollADie(sizeVariation);
            }
            startingPoint = positionOnIso(containerIso);

            oldIso = new Isometric(
                startingPoint.x,
                startingPoint.y,
                cubeSideWidth,
                cubeSideHeight,
                sizeOfShape
            );
            // pick a new color
            thisColor = random(pallet);

            continue;
        }
        resetIso = false;
        fillSides(newIso, basicIso, thisColor);

        oldIso = newIso;
    }

    // for debugging
    // stroke(0,0,0,100);
    // noFill();
    // strokeWeight(2);
    // containerIso.buildTopFace();
    // containerIso.buildBottomFace();
    // containerIso.buildRightFace();
    // containerIso.buildLeftFace();
    // noStroke();

// show the pallet used in the corner
// push();
// let offset = (margin / 4) * pallet.length;
// // stroke(0,0,0,100);
// // strokeWeight(5);
// // line(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
// translate((canvasWidth / 2) - offset + (margin / 8), 0);
//
// let pp = {x: 0, y: canvasHeight - (margin/2), w: (margin / 4), h: (margin / 4) };
// for (var i = 0; i < pallet.length; i++) {
//   let cp = pallet[i];
//   fill(cp.h, cp.s, cp.l, 100);
//   rect(pp.x, pp.y, pp.w, pp.h);
//   pp.x = pp.x + pp.w + (margin / 4);
// }
// pop();
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
        clear();
        redraw();
    }

    if (key === "s") {
        save(saveFileName());
    }

    if (key === "g") {
        // generate stack of images
        for (var i = 0; i < 10; i++) {
            clear();
            redraw();
            save(saveFileName());
        }

        return false;
    }
}
