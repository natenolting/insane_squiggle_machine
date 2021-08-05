class Cells {
  constructor(cell, colors) {
    this.cell = cell;
    this.colors = colors;
  }

  coinFlip = function ()
  {
    return boolean(round(random(1)));
  };

  rollADie = function (sides=6) {
    return int(random(1, sides + 1));
  };

  makeid = function (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  pixelated = function (splitW=10, splitH=10)
  {
    let w = this.cell.w / splitW;
    let h = this.cell.h / splitH;
    for (var r = 0; r < splitW; r++) {
      for (var c = 0; c < splitH; c++) {
        noStroke();
        let thisColor = random(colors);
        fill(thisColor.h, thisColor.s, thisColor.l, 100);
        rect(
          this.cell.x + r * w,
          this.cell.y + c * h,
          w,
          h,
        );
      }
    }
  };

  target = function ()
  {
    let centerX = this.cell.x + this.cell.w / 2;
    let centerY = this.cell.y + this.cell.h / 2;
    let color1 = random(colors);
    let color2 = random(colors);
    let color3 = random(colors);

    fill(color1.h, color1.s, color1.l, 100);
    ellipse(
      centerX,
      centerY,
      this.cell.w * .875,
      this.cell.h * .875
    );

    fill(color2.h, color2.s, color2.l, 100);
    ellipse(
      centerX,
      centerY,
      this.cell.w / 1.625,
      this.cell.h / 1.625
    );

    fill(color3.h, color3.s, color3.l, 100);
    ellipse(
      centerX,
      centerY,
      this.cell.w / 4,
      this.cell.h / 4
    );
  };

  or = function () {
    noFill();
    let color = random(colors);
    stroke(color.h, color.s, color.l, 100);
    strokeWeight(this.cell.w / 6);
    strokeCap(ROUND);
    line(
      this.cell.x + this.cell.w / 4,
      this.cell.y + this.cell.h / 4,
      this.cell.x + this.cell.w / 4,
      this.cell.y + this.cell.h / 1.375,
    );
    line(
      this.cell.x + this.cell.w / 1.375,
      this.cell.y + this.cell.h / 4,
      this.cell.x + this.cell.w / 1.375,
      this.cell.y + this.cell.h / 1.375,
    );
  };

  equal = function () {
    noFill();
    let color = random(colors);
    stroke(color.h, color.s, color.l, 100);
    strokeWeight(this.cell.w / 6);
    strokeCap(ROUND);

    line(
      this.cell.x + this.cell.w / 4,
      this.cell.y + this.cell.h / 4,
      this.cell.x + this.cell.w / 1.375,
      this.cell.y + this.cell.h / 4,
    );

    line(
      this.cell.x + this.cell.w / 4,
      this.cell.y + this.cell.h / 1.375,
      this.cell.x + this.cell.w / 1.375,
      this.cell.y + this.cell.h / 1.375,
    );

  };

  diceRoll = function ()
  {
    let diceRoll = this.rollADie(6);
    let dotW = this.cell.w / 6;
    let dotH = this.cell.h / 6;
    let color = random(colors);
    fill(color.h, color.s, color.l, 100);

    if (diceRoll === 1) {
      ellipse(
        this.cell.x + this.cell.w / 2,
        this.cell.y + this.cell.h / 2,
        dotW,
        dotH
      );

    }

    if (diceRoll === 2) {
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
    }

    if (diceRoll === 3) {
      ellipse(
        this.cell.x + this.cell.w / 2,
        this.cell.y + this.cell.h / 2,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
    }

    if (diceRoll === 4) {
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
    }

    if (diceRoll === 5) {
      ellipse(
        this.cell.x + this.cell.w / 2,
        this.cell.y + this.cell.h / 2,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
    }

    if (diceRoll === 6) {
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 2,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 2,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 1.375,
        this.cell.y + this.cell.h / 4,
        dotW,
        dotH
      );
      ellipse(
        this.cell.x + this.cell.w / 4,
        this.cell.y + this.cell.h / 1.375,
        dotW,
        dotH
      );
    }
  };

  triangle = function ()
  {
    let color1 = random(colors);
    let color2 = random(colors);
    let color3 = random(colors);
    let x1 = this.cell.x;
    let y1 = this.cell.y;
    let x2 = this.cell.x + this.cell.w;
    let y2 = this.cell.y + this.cell.h;
    let x3 = this.cell.x;
    let y3 = this.cell.y + this.cell.h;

    if (this.coinFlip()) {
      fill(color2.h, color2.s, color2.l, 100);
      triangle(
        x1,
        y1,
        x2,
        y1,
        x3,
        y3
      );
    }

    if (this.coinFlip() && this.coinFlip()) {
      fill(color3.h, color3.s, color3.l, 100);
      triangle(
        x2,
        y1,
        x2,
        y2,
        x3,
        y3
      );
    }

    fill(color1.h, color1.s, color1.l, 100);
    triangle(x1, y1, x2, y2, x3, y3);
  };

}
