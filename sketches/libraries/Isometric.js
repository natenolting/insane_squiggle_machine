class Isometric {
    startX = 0;
    startY = 0;
    multiplier = 1;
    heightMultiple = 0.577396542692509;
    sideW = 12;
    sideH = this.sideW * this.heightMultiple;


    constructor(startX, startY, sideW, sideH, multiplier) {
        this.startX = startX;
        this.startY = startY;
        this.multiplier = multiplier;
        this.setSideW(sideW);
        this.setSideH(sideH);
        this.baseCoordinates();
    }

    setStartX = function(x) {
      this.startX = x;
    }

    setStartY = function(y) {
      this.startY = y;
    }

    setSideW = function(sideW) {
      this.sideW = sideW * this.multiplier;
    }

    setSideH = function(sideH) {
        this.sideH = sideH * this.multiplier;
    }

    pickDirection = function(direction, multiple) {

        let directions = {
            2: 'rectangleSe',
            3: 'rectangleSw',
            4: 'rectangleNw',
            5: 'rectangleNe',
            6: 'rectangleN',
            7: 'rectangleS',
        }
        if (direction in directions) {
            eval(`this.${directions[direction]}(${multiple})`);
        }

        return this;
    }

    baseCoordinates() {

        this.a = {x: this.startX, y: this.startY};
        this.b = {x: this.a.x - this.sideW, y: this.a.y - this.sideH};
        this.c = {x: this.b.x, y: this.b.y - this.sideH * 2};
        this.g = {x: this.a.x, y: this.a.y - this.sideH * 2};
        this.f = {x: this.a.x + this.sideW, y: this.a.y - this.sideH};
        this.e = {x: this.f.x, y: this.f.y - this.sideH * 2};
        this.d = {x: this.a.x, y: this.a.y - this.sideH * 4};

    }

    // Build a rectangle in the southeast direction
    rectangleSe(multiplier = 1) {
        this.a = {x: this.b.x + ((this.sideW * 2) * multiplier), y: this.b.y + ((this.sideH * 2) * multiplier)};
        this.e = {x: this.d.x + ((this.sideW * 2) * multiplier), y: this.d.y + ((this.sideH * 2) * multiplier)};
        this.f = {x: this.g.x + ((this.sideW * 2) * multiplier), y: this.g.y + ((this.sideH * 2) * multiplier)};
        this.g = {x: this.c.x + ((this.sideW * 2) * multiplier), y: this.c.y + ((this.sideH * 2) * multiplier)};
        return this;
    }

    // build a rectangle in the southwest direction
    rectangleSw(multiplier = 1) {
        this.a = {x: this.f.x - ((this.sideW * 2) * multiplier), y: this.f.y + ((this.sideH * 2) * multiplier)};
        this.b = {x: this.g.x - ((this.sideW * 2) * multiplier), y: this.g.y + ((this.sideH * 2) * multiplier)};
        this.c = {x: this.d.x - ((this.sideW * 2) * multiplier), y: this.d.y + ((this.sideH * 2) * multiplier)};
        this.g = {x: this.e.x - ((this.sideW * 2) * multiplier), y: this.e.y + ((this.sideH * 2) * multiplier)};
        return this;
    }

    // build a rectangle in the northwest direction
    rectangleNw(multiplier = 1) {
        this.b = {x: this.a.x - ((this.sideW * 2) * multiplier), y: this.a.y - ((this.sideH * 2) * multiplier)};
        this.c = {x: this.g.x - ((this.sideW * 2) * multiplier), y: this.g.y - ((this.sideH * 2) * multiplier)};
        this.d = {x: this.e.x - ((this.sideW * 2) * multiplier), y: this.e.y - ((this.sideH * 2) * multiplier)};
        return this;
    }

    // build a rectangle in a northeast direction
    rectangleNe(multiplier = 1) {
        this.d = {x: this.c.x + ((this.sideW * 2) * multiplier), y: this.c.y - ((this.sideH * 2) * multiplier)};
        this.e = {x: this.g.x + ((this.sideW * 2) * multiplier), y: this.g.y - ((this.sideH * 2) * multiplier)};
        this.f = {x: this.a.x + ((this.sideW * 2) * multiplier), y: this.a.y - ((this.sideH * 2) * multiplier)};
        return this;
    }

    // Build a rectangle in a north direction
    rectangleN(multiplier = 1) {
        this.e = {x: this.e.x, y: this.e.y - ((this.sideH * 2) * multiplier)};
        this.d = {x: this.d.x, y: this.d.y - ((this.sideH * 2) * multiplier)};
        this.c = {x: this.c.x, y: this.c.y - ((this.sideH * 2) * multiplier)};
        this.g = {x: this.g.x, y: this.g.y - ((this.sideH * 2) * multiplier)};
        return this;
    }

    // Build a rectangle in a south direction
    rectangleS(multiplier = 1) {
        this.f = {x: this.f.x, y: this.f.y + ((this.sideH * 2) * multiplier)};
        this.a = {x: this.a.x, y: this.a.y + ((this.sideH * 2) * multiplier)};
        this.b = {x: this.b.x, y: this.b.y + ((this.sideH * 2) * multiplier)};
        return this;
    }

    buildLeftFace() {
        beginShape();
        vertex(this.a.x, this.a.y);
        vertex(this.b.x, this.b.y);
        vertex(this.c.x, this.c.y);
        vertex(this.g.x, this.g.y);
        vertex(this.a.x, this.a.y);
        endShape();
    }

    buildRightFace() {
        beginShape();
        vertex(this.a.x, this.a.y);
        vertex(this.f.x, this.f.y);
        vertex(this.e.x, this.e.y);
        vertex(this.g.x, this.g.y);
        vertex(this.a.x, this.a.y);
        endShape();
    }

    buildTopFace() {
        beginShape();
        vertex(this.c.x, this.c.y);
        vertex(this.d.x, this.d.y);
        vertex(this.e.x, this.e.y);
        vertex(this.g.x, this.g.y);
        vertex(this.c.x, this.c.y);
        endShape();
    }

    buildBottomFace() {
        beginShape();
        vertex(this.a.x, this.a.y);
        vertex(this.b.x, this.b.y);
        vertex(this.g.x, this.g.y);
        vertex(this.f.x, this.f.y);
        vertex(this.a.x, this.a.y);
        endShape();
    }

    build(h = 0, s = 0, l = 50, o = 100) {

        // left face
        noStroke();
        fill(h, s, l * .75, o);
        this.buildLeftFace();

        // right face
        fill(h, s, l * .55, o);
        this.buildRightFace();

        // top
        fill(h, s, l, o);
        this.buildTopFace()

    }

}
