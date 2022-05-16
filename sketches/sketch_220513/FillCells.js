class FillCells {
    constructor(cG, cell, colors, opacity = 100) {
        this.cG = cG;
        this.cell = cell;
        this.colors = colors;
        this.opacity = opacity;
        this.helper = new Helpers();
    }

    coinFlip = function () {
        return this.helper.coinFlip();
    };

    rollADie = function (sides = 6) {
        return this.helper.rollADie(sides);
    };

    makeid = function (length) {
        this.helper.makeid(length);
    };

    colorList = function(random = false) {

      if (random) {
        return helper.shuffleArray([...this.colors])
      }
      if(this.coinFlip()) {
        return this.colors;
      } else {
        return this.colors.reverse();
      }
    };

    pixelated = function (splitW = 10, splitH = 10, shape = "square") {
        let w = this.cell.w / splitW;
        let h = this.cell.h / splitH;
        for (var r = 0; r < splitW; r++) {
            for (var c = 0; c < splitH; c++) {
                let thisColor = random(this.colors);
                this.cG.noStroke();
                this.cG.fill(thisColor.h, thisColor.s, thisColor.l, this.opacity);
                switch (shape) {
                    case "circle":
                    case "ellipse":
                        this.cG.ellipse(
                            this.cell.x + r * w + w / 2,
                            this.cell.y + c * h + h / 2,
                            w,
                            h
                        );
                        break;
                    case "square":
                    case "rectangle":
                        this.cG.rect(
                            this.cell.x + r * w,
                            this.cell.y + c * h,
                            w,
                            h
                        )

                }

                this.cG.noStroke();
            }
        }
    };

    target = function (circles = 4) {

        let colors = this.colorList();

        // console.log(colors);
        let colorIndex = 0;
        let roll = helper.rollADie(11);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < circles; i++) {
            let {x, y, w, h} = this.position(circles, i, roll);

            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, this.opacity);
            this.cG.ellipse(x, y, w, h);
            colorIndex++;
        }

    };

    diamond = function (diamonds = 4) {

        let colors = this.colorList();

        let colorIndex = 0;
        let roll = helper.rollADie(11);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < diamonds; i++) {
            let {x, y, w, h} = this.position(diamonds, i, roll);

            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, this.opacity);
            this.cG.beginShape();
            this.cG.vertex(x, y - h / 2);
            this.cG.vertex(x + w / 2, y);
            this.cG.vertex(x, y + h / 2);
            this.cG.vertex(x - w / 2, y);
            this.cG.endShape(CLOSE);
            colorIndex++;
        }

    };
    square = function (squares = 4) {

        let colors = this.colorList();

        let colorIndex = 0;
        let roll = helper.rollADie(11);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < squares; i++) {
            let {x, y, w, h} = this.position(squares, i, roll);

            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, this.opacity);
            this.cG.beginShape();
            this.cG.vertex(x - w / 2, y - h / 2);
            this.cG.vertex(x + w / 2, y - h / 2);
            this.cG.vertex(x + w / 2, y + h / 2);
            this.cG.vertex(x - w / 2, y + h / 2);
            this.cG.endShape(CLOSE);
            colorIndex++;
        }

    };

    position = function (iterations, index, roll) {
        let x, y, w, h, m;
        m = (index * (100 / iterations * 0.01));
        switch (roll) {
            case 1:
                // center, contain to cell
                x = this.cell.cX;
                y = this.cell.cY;
                w = this.cell.w - (this.cell.w * m);
                h = this.cell.h - (this.cell.h * m);
                break;
            case 2:
                // top left cover cell
                x = 0;
                y = 0;
                w = (this.cell.w * 2) - (this.cell.w * m * 2);
                h = (this.cell.h * 2) - (this.cell.h * m * 2);
                break;
            case 3:
                // center top contain to cell
                x = this.cell.cX;
                y = 0;
                w = this.cell.w - (this.cell.w * m);
                h = this.cell.h - (this.cell.h * m);
                break;
            case 4:
                // top right, cover cell
                x = this.cell.w;
                y = 0;
                w = (this.cell.w * 2) - (this.cell.w * m * 2);
                h = (this.cell.h * 2) - (this.cell.h * m * 2);
                break;
            case 5:
                // top right, contain to cell
                x = 0;
                y = this.cell.cY;
                w = this.cell.w - (this.cell.w * m);
                h = this.cell.h - (this.cell.h * m);
                break;
            case 6:
                x = this.cell.w;
                y = this.cell.cY;
                w = this.cell.w - (this.cell.w * m);
                h = this.cell.h - (this.cell.h * m);
                break;
            case 7:
                // bottom left, cover the cell
                x = 0;
                y = this.cell.h;
                w = (this.cell.w * 2) - (this.cell.w * m * 2);
                h = (this.cell.h * 2) - (this.cell.h * m * 2);
                break;
            case 8:
                // center bottom, contain to cell
                x = this.cell.cX;
                y = this.cell.h;
                w = this.cell.w - (this.cell.w * m);
                h = this.cell.h - (this.cell.h * m);
                break;
            case 9:
                // bottom right corner, cover the cell
                x = this.cell.w;
                y = this.cell.h;
                w = (this.cell.w * 2) - (this.cell.w * m * 2);
                h = (this.cell.h * 2) - (this.cell.h * m * 2);
                break;
            case 10:
                // center top, cover the cell
                x = this.cell.w / 2;
                y = 0;
                w = (this.cell.w * 2) - (this.cell.w * m * 2);
                h = (this.cell.h * 2) - (this.cell.h * m * 2);
                break;
            case 11:
                // center bottom, cover the cell
                x = this.cell.w / 2;
                y = this.cell.h;
                w = (this.cell.w * 2) - (this.cell.w * m * 2);
                h = (this.cell.h * 2) - (this.cell.h * m * 2);
                break;
            default:

        }

        return {x, y, w, h}
    }

    pointField = function (dotCount = 1000) {

        for (let i = 0; i < dotCount; i++) {
            let colors = this.colorList(true);
            let color1 = colors[0];
            let x = random(this.cell.w);
            let y = random(this.cell.h);
            this.cG.fill(color1.h, color1.s, color1.l, 90);
            this.cG.ellipse(x, y, random(helper.range(1, 3)));
        }
    };

    cheerio = function () {
        let colors = this.colorList(true);
        this.cG.fill(colors[0].h, colors[0].s, colors[0].l, this.opacity);
        let outer = (new VectorShape(this.cell.x, this.cell.x + this.cell.w, this.cell.y, this.cell.y + this.cell.h)).ellipse();

        let centerOffset = noise(this.cell.index) * 0.49;
        let inner = (new VectorShape(
            this.cell.cX - this.cell.w * centerOffset,
            this.cell.cX + this.cell.w * centerOffset,
            this.cell.cY - this.cell.h * centerOffset,
            this.cell.cY + this.cell.g * centerOffset
        )).ellipse();

        this.cG.beginShape();
        for (let i = 0; i < outer.length; i++) {
            this.cG.vertex(outer[i].x, outer[i].y);
        }
        this.cG.beginContour();
        for (var i = inner.length - 1; i >= 0; i--) {
            this.cG.vertex(inner[i].x, inner[i].y);
        }
        this.cG.endContour();
        this.cG.endShape(CLOSE);
    }

    squareCorners = function () {
        let colors = this.colorList(true);

        this.cG.fill(colors[0].h, colors[0].s, colors[0].l, this.opacity);
        let widthHeightOffset = noise(this.cell.index) * 1.35 - 0.1;

        // top right
        this.cG.rect(this.cell.x, this.cell.y, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
        // top left
        this.cG.rect(this.cell.x + this.cell.w - this.cell.w * widthHeightOffset, this.cell.y, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
        // bottom right
        this.cG.rect(this.cell.x + this.cell.w - this.cell.w * widthHeightOffset, this.cell.y + this.cell.h - this.cell.h * widthHeightOffset, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
        // bottom left
        this.cG.rect(this.cell.x, this.cell.y + this.cell.h - this.cell.h * widthHeightOffset, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);

    }

    roundCorners = function() {
      let colors = this.colorList(true);

      this.cG.fill(colors[0].h, colors[0].s, colors[0].l, this.opacity);
      let widthHeightOffset = noise(this.cell.index) * 1.35 - 0.1;
      //top left
      this.cG.ellipse(this.cell.x, this.cell.y, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
      //top right
      this.cG.ellipse(this.cell.x + this.cell.w, this.cell.y, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
      // bottom right
      this.cG.ellipse(this.cell.x + this.cell.w, this.cell.y + this.cell.h, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
      // bottom left
      this.cG.ellipse(this.cell.x, this.cell.y + this.cell.h, this.cell.w * widthHeightOffset, this.cell.h * widthHeightOffset);
    }

    cross = function(crosses = 6) {
      let colors = this.colorList(true);
      this.cG.noFill();
      let colorIndex = 0;

      let incriment = 1 / crosses;
      for (var i = 1; i > 0.01; i-=incriment) {

        if (colorIndex > colors.length - 1) {
            colorIndex = 0;
        }

        this.cG.stroke(colors[colorIndex].h, colors[colorIndex].s, colors[colorIndex].l, this.opacity);
        let widthHeightOffset = noise(this.cell.index) * i;
        this.cG.strokeWeight(this.cell.w * widthHeightOffset);
        this.cG.line(this.cell.x, this.cell.cY, this.cell.x + this.cell.w, this.cell.cY);
        this.cG.line(this.cell.cX, this.cell.y, this.cell.cX, this.cell.y + this.cell.h);

        colorIndex++;
      }

      this.cG.noStroke();
    }

    times = function(crosses = 6) {
      let colors = this.colorList(true);
      this.cG.noFill();
      let colorIndex = 0;

      let incriment = 1 / crosses;
      for (var i = 1; i > 0.01; i-=incriment) {

        if (colorIndex > colors.length - 1) {
            colorIndex = 0;
        }

        this.cG.stroke(colors[colorIndex].h, colors[colorIndex].s, colors[colorIndex].l, this.opacity);
        let widthHeightOffset = noise(this.cell.index) * i;
        this.cG.strokeWeight(this.cell.w * widthHeightOffset);
        this.cG.line(this.cell.x, this.cell.y, this.cell.x + this.cell.w, this.cell.y + this.cell.h);
        this.cG.line(this.cell.x + this.cell.w, this.cell.y, this.cell.x, this.cell.y + this.cell.h);

        colorIndex++;
      }

      this.cG.noStroke();
    }
}
