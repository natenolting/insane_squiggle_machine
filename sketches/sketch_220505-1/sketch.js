const helper = new Helpers();
const colors = new Colors();
let palletData;
let settingsData;
let settings;
let pallets;
let margin;
let canvasWidth;
let canvasHeight;
let iterations;
let sizeVariation;
let lengthVariation;
let cubeSideWidth;
let rollBetween;
let pixelD;
let transparent;
let opacity;
let cubeSideHeightMultiple = 0.577396542692509;
let cubeSideHeight;
let cols;
let rows;
let cells;
let saveId = helper.makeid(10);
let saveCount = 0;
let colorList;
let hexColors;
let texture;
let applyTexture;
let textureDensity;
let textureSizeMean;
let textureSizeSD;


function vectorsAreInsideBounds(iso) {
    return iso.a.x >= margin && iso.a.y >= margin && iso.a.x <= canvasWidth - margin && iso.a.y <= canvasHeight - margin &&
        iso.b.x >= margin && iso.b.y >= margin && iso.b.x <= canvasWidth - margin && iso.b.y <= canvasHeight - margin &&
        iso.c.x >= margin && iso.c.y >= margin && iso.c.x <= canvasWidth - margin && iso.c.y <= canvasHeight - margin &&
        iso.d.x >= margin && iso.d.y >= margin && iso.d.x <= canvasWidth - margin && iso.d.y <= canvasHeight - margin &&
        iso.e.x >= margin && iso.e.y >= margin && iso.e.x <= canvasWidth - margin && iso.e.y <= canvasHeight - margin &&
        iso.f.x >= margin && iso.f.y >= margin && iso.f.x <= canvasWidth - margin && iso.f.y <= canvasHeight - margin &&
        iso.g.x >= margin && iso.g.y >= margin && iso.g.x <= canvasWidth - margin && iso.g.y <= canvasHeight - margin
}

function preload() {
    palletData = loadJSON("../../data/20220408_palettes.json");
    settingsData = loadJSON("./settings.json");
}

function setup() {
    settings = settingsData.settings;
    margin = settings.margin;

    iterations = settings.iterations;
    sizeVariation = settings.sizeVariation.length === 2 ? helper.range(settings.sizeVariation[0], settings.sizeVariation[1]) : settings.sizeVariation;
    lengthVariation = settings.lengthVariation.length === 2 ? helper.range(settings.lengthVariation[0], settings.lengthVariation[1]) : settings.lengthVariation;
    cubeSideWidth = settings.cubeSideWidth;
    rollBetween = settings.rollBetween.length === 2 ? helper.range(settings.rollBetween[0], settings.rollBetween[1]) : settings.rollBetween;
    pixelD = 4;
    transparent = settings.transparent;
    opacity = settings.opacity;

    applyTexture = settings.texture.apply;
    textureDensity = settings.texture.density;
    textureSizeMean = settings.texture.size.mean;
    textureSizeSD = settings.texture.size.sd;


    cubeSideHeightMultiple = 0.577396542692509;
    cubeSideHeight = cubeSideWidth * cubeSideHeightMultiple;

    cols = settings.columns;
    rows = settings.rows;

    canvasWidth = cols * cubeSideWidth + margin * 2;
    canvasHeight = rows * cubeSideWidth + margin * 2;

    cells = _.sortBy(new Cells(cols, rows, cubeSideWidth, cubeSideWidth).populateCells(false)[0], ['row', 'col']);


    createCanvas(canvasWidth, canvasHeight);
    console.log();
    colorMode(RGB, 255, 255, 255, 1);
    pixelDensity(pixelD);
    pallets = palletData.pallets;
}


function draw() {
    noLoop();
    if (!transparent) {
        background(255, 255, 255, 1);
        noStroke();
        fill(255, 255, 255, 1);
        rect(0, 0, canvasWidth, canvasHeight);
    }
    hexColors = pallets[helper.rollADie(_.size(pallets) - 1)];
    while (hexColors === undefined) {
        hexColors = pallets[helper.rollADie(_.size(pallets) - 1)];
    }
    colorList = [];
    let pallet = [];
    for (const element of hexColors) {
        let rgb = colors.HEXtoRGB(element);
        pallet.push(rgb);
    }

// create texture map
    texture = [];
    if (applyTexture) {
        for (var y = 0; y < 1; y += textureDensity) {
            for (var x = 0; x < 1; x += textureDensity) {
                let xPos = lerp(0, canvasWidth, x);
                let yPos = lerp(0, canvasHeight, y);
                texture.push(createVector(xPos, yPos));
            }
        }
        let textureCount = texture.length * textureDensity * 1000;
        for (var i = 0; i < textureCount; i++) {
            let randX = randomGaussian(canvasWidth * .25, canvasWidth * .75);
            let randY = randomGaussian(canvasHeight * .25, canvasHeight * .75);
            texture.push(createVector(randX, randY))
        }
    }
    // fill(0,0,0,100);
    // _.forEach(texture, function(t){
    //       ellipse(t.x, t.y, 2);
    // });
    // return;

    let sizeOfShape;
    let roll;
    let multiple;
    if (Array.isArray(rollBetween)) {
        roll = random(rollBetween);
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

    let startingPoint = random(cells);
    let iso = new Isometric(startingPoint.cX, startingPoint.cY, cubeSideWidth, cubeSideHeight, sizeOfShape);
    iso.pickDirection(roll, multiple);
    let thisColor = random(pallet);

    if (vectorsAreInsideBounds(iso)) {

        fill(
            thisColor[0] * settings.faceLightness.top,
            thisColor[1] * settings.faceLightness.top,
            thisColor[2] * settings.faceLightness.top,
            opacity
        );
        iso.buildTopFace();
        textureFace(
            [
                createVector(iso.g.x, iso.g.y - textureSizeSD),
                createVector(iso.c.x + textureSizeSD, iso.c.y),
                createVector(iso.d.x, iso.d.y + textureSizeSD),
                createVector(iso.e.x - textureSizeSD, iso.e.y),
            ],
            texture,
            [
                thisColor[0] * settings.faceLightness.top * 0.95,
                thisColor[1] * settings.faceLightness.top * 0.95,
                thisColor[2] * settings.faceLightness.top * 0.95,
            ]
        );

        fill(
            thisColor[0] * settings.faceLightness.left,
            thisColor[1] * settings.faceLightness.left,
            thisColor[2] * settings.faceLightness.left,
            opacity
        );
        iso.buildLeftFace();

        // texture on left
        textureFace(
            [
                createVector(iso.a.x - textureSizeSD, iso.a.y - textureSizeSD),
                createVector(iso.b.x + textureSizeSD, iso.b.y - textureSizeSD),
                createVector(iso.c.x + textureSizeSD, iso.c.y + textureSizeSD),
                createVector(iso.g.x - textureSizeSD, iso.g.y + textureSizeSD),
            ],
            texture,
            [
                thisColor[0] * settings.faceLightness.left * 0.85,
                thisColor[1] * settings.faceLightness.left * 0.85,
                thisColor[2] * settings.faceLightness.left * 0.85,
            ]
        );

        fill(
            thisColor[0] * settings.faceLightness.right,
            thisColor[1] * settings.faceLightness.right,
            thisColor[2] * settings.faceLightness.right,
            opacity
        );
        iso.buildRightFace();
        // add texture to right face
        textureFace(
            [
                createVector(iso.a.x + textureSizeSD, iso.a.y - textureSizeSD),
                createVector(iso.g.x + textureSizeSD, iso.g.y + textureSizeSD),
                createVector(iso.e.x - textureSizeSD, iso.e.y + textureSizeSD),
                createVector(iso.f.x - textureSizeSD, iso.f.y - textureSizeSD),
            ],
            texture,
            [
                thisColor[0] * settings.faceLightness.right * 0.75,
                thisColor[1] * settings.faceLightness.right * 0.75,
                thisColor[2] * settings.faceLightness.right * 0.75,
            ]
        );


    }
    let oldIso = iso;
    for (let i = iterations; i > 0; i--) {

        if (Array.isArray(rollBetween)) {
            roll = random(rollBetween);
        } else {
            roll = helper.rollADie(7);
        }

        // starting point "g" seems to give the best result
        startingPoint = {x: oldIso.g.x, y: oldIso.g.y};

        let newIso = new Isometric(
            startingPoint.x,
            startingPoint.y,
            cubeSideWidth,
            cubeSideHeight,
            sizeOfShape
        );

        multiple = helper.rollADie(lengthVariation);
        newIso.pickDirection(roll, multiple);

        // if we hit a wall reset the starting point/size
        if (!vectorsAreInsideBounds(newIso)) {
            if (Array.isArray(sizeVariation)) {
                sizeOfShape = random(sizeVariation);
            } else {
                sizeOfShape = helper.rollADie(sizeVariation);
            }

            startingPoint = random(cells);
            oldIso = new Isometric(
                startingPoint.cX,
                startingPoint.cY,
                cubeSideWidth,
                cubeSideHeight,
                sizeOfShape
            );
            // pick a new color
            thisColor = random(pallet);
            continue;
        }

        fill(
            thisColor[0] * settings.faceLightness.top,
            thisColor[1] * settings.faceLightness.top,
            thisColor[2] * settings.faceLightness.top,
            opacity
        );
        newIso.buildTopFace();
        // texture the top face
        textureFace(
            [
                createVector(newIso.g.x, newIso.g.y - textureSizeSD),
                createVector(newIso.c.x + textureSizeSD, newIso.c.y),
                createVector(newIso.d.x, newIso.d.y + textureSizeSD),
                createVector(newIso.e.x - textureSizeSD, newIso.e.y),
            ],
            texture,
            [
                thisColor[0] * settings.faceLightness.top * 0.95,
                thisColor[1] * settings.faceLightness.top * 0.95,
                thisColor[2] * settings.faceLightness.top * 0.95,
            ]
        );


        fill(
            thisColor[0] * settings.faceLightness.left,
            thisColor[1] * settings.faceLightness.left,
            thisColor[2] * settings.faceLightness.left,
            opacity
        );
        newIso.buildLeftFace();
        // texture on left
        textureFace(
            [
                createVector(newIso.a.x - textureSizeSD, newIso.a.y - textureSizeSD),
                createVector(newIso.b.x + textureSizeSD, newIso.b.y - textureSizeSD),
                createVector(newIso.c.x + textureSizeSD, newIso.c.y + textureSizeSD),
                createVector(newIso.g.x - textureSizeSD, newIso.g.y + textureSizeSD),
            ],
            texture,
            [
                thisColor[0] * settings.faceLightness.left * 0.85,
                thisColor[1] * settings.faceLightness.left * 0.85,
                thisColor[2] * settings.faceLightness.left * 0.85,
            ]
        );

        fill(
            thisColor[0] * settings.faceLightness.right,
            thisColor[1] * settings.faceLightness.right,
            thisColor[2] * settings.faceLightness.right,
            opacity
        );
        newIso.buildRightFace();
        // texture on right face
        textureFace(
            [
                createVector(newIso.a.x + textureSizeSD, newIso.a.y - textureSizeSD),
                createVector(newIso.g.x + textureSizeSD, newIso.g.y + textureSizeSD),
                createVector(newIso.e.x - textureSizeSD, newIso.e.y + textureSizeSD),
                createVector(newIso.f.x - textureSizeSD, newIso.f.y - textureSizeSD),
            ],
            texture,
            [
                thisColor[0] * settings.faceLightness.right * 0.75,
                thisColor[1] * settings.faceLightness.right * 0.75,
                thisColor[2] * settings.faceLightness.right * 0.75,
            ]
        );


        oldIso = newIso;
    }

}

function textureFace(face, points, color) {
    fill(color[0], color[1], color[2], opacity);
    noStroke();
    for (var i = 0; i < points.length; i++) {
        let pt = points[i];
        if (helper.pointInPoly(face, pt)) {
            let ptSize = randomGaussian(textureSizeMean, textureSizeSD);
            ellipse(pt.x, pt.y, ptSize);
        }
    }
}

function saveFileName() {
    let fileName;
    if (transparent) {
        fileName = `${saveId}_${saveCount}.png`;
    } else {
        fileName = `${saveId}_${saveCount}.jpg`;
    }
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
