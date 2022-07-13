class Transform {

  cg;
  construct(cg) {
    this.cg = cg;
  }

  flipH = function () {
    this.cg.scale(-1.0, 1.0);
  };

  flipV = function () {
    this.cg.scale(1.0, -1.0);
  };

  imgRotate = function (img, x, y, r) {
    this.cg.push();
    this.cg.imageMode(CENTER);
    this.cg.rectMode(CENTER);
    this.cg.translate(x + img.width / 2, y + img.height / 2);
    this.cg.rotate(r);
    this.cg.image(img, 0, 0);
    this.cg.pop();
  };

  imgRotatePi = function (img, x, y, mode) {
    this.cg.push();
    this.cg.translate(x, y);
    this.cg.imageMode(mode === undefined ? CORNER : mode);
    this.cg.rotate(PI);
    this.cg.image(img, -img.width, -img.height);
    this.cg.pop();

  };

  imgRotateHalfPi = function (img, x, y) {

    this.cg.push();
    this.cg.imageMode(CENTER);
    this.cg.rectMode(CENTER);
    this.cg.translate(x + img.width / 2, y + img.height / 2);
    this.cg.rotate(HALF_PI);
    this.cg.image(img, 0, 0);
    this.cg.pop();
  };

  imgRotateHalfPiCc = function (img, x, y) {

    this.cg.push();
    this.cg.imageMode(CENTER);
    this.cg.rectMode(CENTER);
    this.cg.translate(x + img.width / 2, y + img.height / 2);
    this.cg.rotate(-HALF_PI);
    this.cg.image(img, 0, 0);
    this.cg.pop();
  };

  imageFlipV = function (img, x, y) {
    this.cg.push();
    this.cg.translate(x, y);
    this.flipV();
    this.cg.image(img, 0, -img.height);
    this.cg.pop();
  };

  imageFlipH = function (img, x, y) {
    this.cg.push();
    this.cg.translate(x, y);
    this.flipH();
    this.cg.image(img, -img.width, 0);
    this.cg.pop();
  };

};
