class Character {
  constructor(cell, bodyColor, facialColor, accentColor) {
    this.cell = cell;
    this.bodyColor = bodyColor;
    this.facialColor = facialColor;
    this.accentColor = accentColor;
    this.w = this.cell.w;
    this.h = this.cell.h;
    this.centerV = this.cell.w / 2;
    this.centerH = this.cell.h / 2;
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
    EARS

    Pick ears from a set of params, add additional
    to the switch statement and incriment the
    ears variable
  =========================================== */
  ears = function () {
    let earType = (new Helpers).rollADie(6);
    switch (earType) {
      case (1):
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
           this.w / 4
         );

        ellipse(
           this.w - this.w / 4 - this.w / 16,
           this.h / 4 + this.h / 16,
           this.w / 4,
           this.h / 4
         );
        break;
      case (2):
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
      case (3):

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
            this.centerH,
            (this.w / 4),
            this.centerH,
            this.centerV
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
      case (4):

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
            this.centerH + this.w / 14,
            this.centerV,
            this.w / 2.8,
            this.centerV
          );

          // right ear
          triangle(
            this.w - (this.w / 4),
            this.h / 4,
            this.centerH - this.w / 14,
            this.centerV,
            this.w - (this.w / 2.8),
            this.centerV
          );
        }

        break;
      case (5):
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
            this.centerH + this.w / 14,
            this.centerV,
            this.w / 2.8,
            this.centerV
          );

          // left ear bottom
          triangle(
            this.w / 4,
            this.centerV - this.h / 18,
            this.centerH + this.w / 24,
            this.centerV + this.h / 16,
            this.w / 2.8,
            this.centerV + this.h / 10
          );

          // center

          triangle(
            this.centerH,
            this.h / 5,
            this.centerH + this.w / 8,
            this.centerV,
            this.centerH - this.w / 8,
            this.centerV
          );

          // right ear
          triangle(
            this.w - (this.w / 4),
            this.h / 4,
            this.centerH - this.w / 14,
            this.centerV,
            this.w - (this.w / 2.8),
            this.centerV
          );

          // left ear bottom
          triangle(
            this.w - this.w / 4,
            this.centerV - this.h / 18,
            this.w - (this.centerH + this.w / 24),
            this.centerV + this.h / 16,
            this.w - (this.w / 2.8),
            this.centerV + this.h / 10
          );
        }

        break;
      case (6):
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
          this.centerV - (this.h / hornDist),
          this.centerH,
          this.centerV - (this.h / hornDist)
        );
        bezierVertex(
          this.w - (this.w / hornDist),
          this.centerV - (this.h / hornDist),
          this.w - (this.w / hornDist),
          this.h / hornDist,
          this.w - (this.w / hornDist),
          this.h / hornDist,
        );

        bezierVertex(
          this.w - (this.w / hornDist),
          this.h / hornDist,
          this.centerH + (this.w / 2.5),
          this.h,
          this.centerH,
          this.h,
        );

        bezierVertex(
          this.centerH - (this.w / 2.5),
          this.h,
          (this.w / hornDist),
          (this.w / hornDist),
          (this.w / hornDist),
          (this.w / hornDist),
        );

        endShape();

        break;
    }
  };

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

  eyes = function () {
    noFill();
    stroke(this.facialColor.h, this.facialColor.s, this.facialColor.l, 100);
    strokeCap(ROUND);
    strokeWeight(this.w / 2 / 5);

    line(
      (this.w / 4) + (this.w / 2 / 3),
      this.centerH,
      (this.w / 4) + (this.w / 2 / 3),
      this.centerH + (this.w / 2 / 2.5)
    );

    line(
      this.w  - (this.w / 4) - (this.w / 2 / 3),
      this.centerH,
      this.w  - (this.w / 4) - (this.w / 2 / 3),
      this.centerH + (this.w / 2 / 2.5)
    );
  };
}
