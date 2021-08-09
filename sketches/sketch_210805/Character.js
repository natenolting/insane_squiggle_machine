class Character {
  constructor(cell, bgColor, bodyColor, facialColor, accentColor) {
    this.cell = cell;
    this.bgColor = bgColor;
    this.bodyColor = bodyColor;
    this.facialColor = facialColor;
    this.accentColor = accentColor;
    this.w = this.cell.w;
    this.h = this.cell.h;
    this.centerV = this.cell.w / 2;
    this.centerH = this.cell.h / 2;

    this.helpers = new Helpers();
  }

  buildCharacter = function () {

    // debugging
    // stroke(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
    // strokeWeight(1);
    //
    // // center vertical debug
    // line(centerV, 0, centerV, h);
    //
    // // center horizontal, debug
    // line(0, centerH, w, centerH);

    /** ==========================================
      The background
     ========================================== */

    this.background();

    /** ==========================================
      The body
     ========================================== */

    // ears
    this.ears();

    // body
    this.body();

    /** ==========================================
      The face
    ========================================== */

    // eyes
    this.eyes();

    /** ==========================================
       The accents
    ========================================== */



  };

  /** ==========================================
    BACKGROUND
  =========================================== */
  background = function () {

    fill(this.bgColor.h, this.bgColor.s, this.bgColor.l, 100);
    noStroke();
    rect(0, 0, this.cell.w, this.cell.h);

    let bgTexture = (new Helpers).rollADie(3);
    let bgTextureColor;
    let whichTexture = this.helpers.rollADie(100);

    switch (bgTexture) {
      case (1):
        bgTextureColor = this.bodyColor;
        break;
      case (2):
        bgTextureColor = this.accentColor;
        break;
      case (3):
        bgTextureColor = this.facialColor;
        break;
    }

    switch (whichTexture) {
      default:
        this.doTexture(
          [0, 0, this.cell.w, this.cell.h],
          bgTextureColor,
          ((this.w + this.h) / 2) / 200,
          this.w * this.h / 30
        );
        break;
    }

  };
  /** ==========================================
    EARS

    Pick ears from a set of params, add additional
    to the switch statement and increment the
    ears variable
  =========================================== */
  ears = function () {
    let earType = (new Helpers).rollADie(60);
    switch (earType) {

      case (10):
        /** ----------------------------------------------------
         strait up and down ears
        ------------------------------------------------------ */

        for (var e = 0; e < 2; e++) {
          if (e === 0) {
            strokeCap(ROUND);
            stroke(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            fill(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            strokeWeight(this.w / 2 / 2);
          } else {
            stroke(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);
            strokeWeight(this.w / 2 / 5);
            noFill();
          }

          line(
            (this.w / 4) + (this.w / 2 / 4),
            (this.h / 4),
            (this.w / 4) + (this.w / 2 / 4),
            this.centerV
          );
          line(
            this.w - (this.w / 4) - (this.w / 2 / 4),
            (this.h / 4),
            this.w - (this.w / 4) - (this.w / 2 / 4),
            this.centerV
          );
        }

        break;
      case (20):

        /** ----------------------------------------------------
        Tripple round ears
        ------------------------------------------------------ */
        for (var e = 0; e < 2; e++) {
          if (e === 0) {
            strokeCap(ROUND);
            stroke(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            fill(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            strokeWeight(this.w / 2 / 2);
          } else {
            stroke(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);
            strokeWeight(this.w / 2 / 5);
            noFill();
          }

          line(
            this.centerV,
            (this.w / 4),
            this.centerV,
            this.centerH
          );

          line(
            (this.w / 4),
            (this.h / 3),
            (this.w / 4) + (this.w / 2 / 4),
            this.centerV
          );
          line(
            this.w - (this.w / 4),
            (this.h / 3),
            this.w - (this.w / 4) - (this.w / 2 / 4),
            this.centerV
          );
        }

        break;
      case (30):

        /** ----------------------------------------------------
        Triangle ears
        ------------------------------------------------------ */

        for (var e = 0; e < 2; e++) {
          if (e === 0) {
            strokeCap(ROUND);
            stroke(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            noFill();
            fill(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            strokeWeight(this.w / 2 / 4);
          } else {
            noStroke();
            fill(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);
          }

          // left ear
          triangle(
            this.w / 4,
            this.h / 4,
            this.centerV + this.w / 14,
            this.centerH,
            this.w / 2.8,
            this.centerH
          );

          // right ear
          triangle(
            this.w - (this.w / 4),
            this.h / 4,
            this.centerV - this.w / 14,
            this.centerH,
            this.w - (this.w / 2.8),
            this.centerH
          );
        }

        break;
      case (40):
        /** ----------------------------------------------------
         "punk" ears
        ------------------------------------------------------ */

        for (var e = 0; e < 2; e++) {
          if (e === 0) {
            strokeCap(ROUND);
            stroke(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            noFill();
            fill(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
            strokeWeight(this.w / 2 / 4);
          } else {
            noStroke();
            fill(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);
          }

          // left ear
          triangle(
            this.w / 4,
            this.h / 4,
            this.centerV + this.w / 14,
            this.centerH,
            this.w / 2.8,
            this.centerH
          );

          // left ear middle
          triangle(
            this.w / 4,
            this.centerH - this.h / 18,
            this.centerV + this.w / 24,
            this.centerH + this.h / 16,
            this.w / 2.8,
            this.centerH + this.h / 10
          );

          // left ear bottom
          triangle(
            this.w / 3.5,
            this.centerH + this.h / 18,
            this.centerV,
            this.centerH,
            this.w / 2.8,
            this.centerH + this.h / 10
          );

          // center

          triangle(
            this.centerV,
            this.h / 5,
            this.centerV + this.w / 8,
            this.centerH,
            this.centerV - this.w / 8,
            this.centerH
          );

          // right ear
          triangle(
            this.w - (this.w / 4),
            this.h / 4,
            this.centerV - this.w / 14,
            this.centerH,
            this.w - (this.w / 2.8),
            this.centerH
          );

          // left ear center
          triangle(
            this.w - this.w / 4,
            this.centerH - this.h / 18,
            this.w - (this.centerV + this.w / 24),
            this.centerH + this.h / 16,
            this.w - (this.w / 2.8),
            this.centerH + this.h / 10
          );

          // left ear bottom
          triangle(
            this.w - (this.w / 3.5),
            this.centerH + this.h / 18,
            this.centerV,
            this.centerH,
            this.w - (this.w / 2.8),
            this.centerH + this.h / 10
          );
        }

        break;
      case (50):
        /** ----------------------------------------------------
        Horns
        ------------------------------------------------------ */
        const hornDist = 18;
        noStroke();
        fill(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);

        // https://www.reddit.com/r/processing/comments/22ct50/how_to_make_a_crescent/cgllfw1/?utm_source=reddit&utm_medium=web2x&context=3
        beginShape();
        noStroke();
        vertex(
          this.w / hornDist,
          this.h / hornDist
        );
        bezierVertex(
          this.w / hornDist,
          this.h / hornDist,
          this.w / hornDist,
          this.h / hornDist,
          this.w / hornDist,
          this.h / hornDist
        );
        bezierVertex(
          this.w / hornDist,
          this.h / hornDist,
          this.w / hornDist,
          this.centerH - (this.h / hornDist),
          this.centerV,
          this.centerH - (this.h / hornDist)
        );
        bezierVertex(
          this.w - (this.w / hornDist),
          this.centerH - (this.h / hornDist),
          this.w - (this.w / hornDist),
          this.h / hornDist,
          this.w - (this.w / hornDist),
          this.h / hornDist,
        );

        bezierVertex(
          this.w - (this.w / hornDist),
          this.h / hornDist,
          this.centerV + (this.w / 2.5),
          this.h,
          this.centerV,
          this.h,
        );

        bezierVertex(
          this.centerV - (this.w / 2.5),
          this.h,
          (this.w / hornDist),
          (this.w / hornDist),
          (this.w / hornDist),
          (this.w / hornDist),
        );

        endShape();

        break;

      case (60):
        /** ----------------------------------------------------
        Halo
        ------------------------------------------------------ */
        noFill();
        strokeCap(ROUND);
        stroke(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);
        strokeWeight(this.w / 16);
        ellipse(
          this.centerV,
          this.h / 7,
          this.w * .66,
          this.h / 8
        );
        if ((new Helpers).coinFlip()) {
          line(
            this.centerV - (this.w * .66) / 2,
            this.h / 7,
            this.centerV - this.w / 6,
            this.centerH
          );
        } else {
          line(
            this.centerV + (this.w * .66) / 2,
            this.h / 7,
            this.centerV + this.w / 6,
            this.centerH
          );
        }

        break;
      default:
        /** ----------------------------------------------------
         circle type ears
        ------------------------------------------------------ */

        fill(this.accentColor.h, this.accentColor.s, this.accentColor.l, 100);
        stroke(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
        strokeWeight(this.w / 2 / 6);
        ellipse(
           this.w / 4 + this.w / 16,
           this.h / 4 + this.h / 16,
           this.w / 4,
           this.h / 4
         );

        ellipse(
           this.w - this.w / 4 - this.w / 16,
           this.h / 4 + this.h / 16,
           this.w / 4,
           this.h / 4
         );
        break;
    }
  };
  /** ==========================================
    Body

    Pick body from a set of params, add additional
    to the switch statement and increment the
    ears variable
  =========================================== */
  body = function () {
    noStroke();
    fill(this.bodyColor.h, this.bodyColor.s, this.bodyColor.l, 100);
    let bodyType = (new Helpers).rollADie(2);
    switch (bodyType) {
      case (1):
        ellipse(this.centerV, this.centerH, this.w / 2, this.h / 2);
        rect(this.centerV / 2, this.centerH, this.w / 2, this.h / 2);
        break;
      case (2):

        ellipse(
          this.centerV,
          this.centerH + (this.h / 8),
          this.w / 1.375,
          this.h / 1.375
        );
        rect(
          this.centerV - ((this.w / 1.375) / 2),
          this.centerH + (this.h / 8),
          this.w / 1.375,
          this.h - (this.centerH + (this.h / 8))
        );
        break;
    }
  };

  /** ==========================================
    EYES

    Pick eyes from a set of params, add additional
    to the switch statement and increment the
    ears variable
  =========================================== */
  eyes = function () {

    let earType = (new Helpers).rollADie(50);
    switch (earType) {

      case (10):
        /** ----------------------------------------------------
        Angry Eyes
        ------------------------------------------------------ */
        noFill();
        stroke(this.facialColor.h, this.facialColor.s, this.facialColor.l, 100);
        strokeCap(ROUND);
        strokeWeight(this.w / 16);

        line(
          (this.w / 4) + (this.w / 8),
          this.centerH + (this.w / 16),
          (this.w / 4) + (this.w / 6.25),
          this.centerH + (this.h / 5)
        );

        line(
          this.w  - (this.w / 4) - (this.w / 8),
          this.centerH + (this.w / 16),
          this.w  - (this.w / 4) - (this.w / 6.25),
          this.centerH + (this.h / 5)
        );
        break;

      case (20):
        /** ----------------------------------------------------
        Dead Eyes
        ------------------------------------------------------ */
        noFill();
        stroke(this.facialColor.h, this.facialColor.s, this.facialColor.l, 100);
        strokeCap(ROUND);
        strokeWeight(this.w / 20);

        line(
          this.centerV - (this.w / 6),
          this.centerH,
          this.centerV - (this.w / 18),
          this.centerH + (this.w / 6),
        );
        line(
          this.centerV - (this.w / 18),
          this.centerH,
          this.centerV - (this.w / 6),
          this.centerH + (this.w / 6),
        );

        line(
          this.centerV + (this.w / 6),
          this.centerH,
          this.centerV + (this.w / 18),
          this.centerH + (this.w / 6),
        );
        line(
          this.centerV + (this.w / 18),
          this.centerH,
          this.centerV + (this.w / 6),
          this.centerH + (this.w / 6),
        );

        break;
      default:
        /** ----------------------------------------------------
        Basic Eyes
        ------------------------------------------------------ */
        noFill();
        stroke(this.facialColor.h, this.facialColor.s, this.facialColor.l, 100);
        strokeCap(ROUND);
        strokeWeight(this.w / 10);

        line(
          (this.w / 4) + (this.w / 6),
          this.centerV,
          (this.w / 4) + (this.w / 6),
          this.centerV + (this.h / 5)
        );

        line(
          this.w  - (this.w / 4) - (this.w / 6),
          this.centerV,
          this.w  - (this.w / 4) - (this.w / 6),
          this.centerV + (this.h / 5)
        );
        break;
    };
  };

  doTexture = function (coodinates, color, size, max) {
    let x1 = coodinates[0];
    let y1 = coodinates[1];
    let x2 = coodinates[2];
    let y2 = coodinates[3];
    for (var i = 0; i < max; i++) {
      let tx1 = floor(random(x1, x2));
      let ty1 = floor(random(y1, y2));
      noStroke();
      fill(color.h, color.s, color.l, 100);

      if (this.helpers.coinFlip()) {
        triangle(
          tx1,
          ty1,
          tx1 + map(size, 0, max, size, size * 1.5),
          ty1 + map(size, 0, max, size, size * 1.5),
          tx1 - map(size, 0, max, size, size * 1.5),
          ty1 + map(size, 0, max, size, size * 1.5)
        );
      } else {
        triangle(
          tx1,
          ty1,
          tx1 - map(size, 0, max, size, size * 1.5),
          ty1 - map(size, 0, max, size, size * 1.5),
          tx1 + map(size, 0, max, size, size * 1.5),
          ty1 - map(size, 0, max, size, size * 1.5)
        );
      }
    }
  };

}
