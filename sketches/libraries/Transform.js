class Transform {

  flipH = function () {
    scale(-1.0, 1.0);
  };

  flipV = function () {
    scale(1.0, -1.0);
  };

  imgRotatePi = function (img, x, y) {

    push();
    translate(x, y);
    rotate(PI);
    image(img, -img.width, -img.height);
    pop();

  };

  imgRotateHalfPi = function (img, x, y) {

    push();
    imageMode(CENTER);
    rectMode(CENTER);
    translate(x + img.width / 2, y + img.height / 2);
    rotate(HALF_PI);
    image(img, 0, 0);
    pop();
  };

  imgRotateHalfPiCc = function (img, x, y) {

    push();
    imageMode(CENTER);
    rectMode(CENTER);
    translate(x + img.width / 2, y + img.height / 2);
    rotate(-HALF_PI);
    image(img, 0, 0);
    pop();
  };

  imageFlipV = function (img, x, y) {
    push();
    translate(x, y);
    this.flipV();
    image(img, 0, -img.height);
    pop();
  };

  imageFlipH = function (img, x, y) {
    push();
    translate(x, y);
    this.flipH();
    image(img, -img.width, 0);
    pop();
  };

};
