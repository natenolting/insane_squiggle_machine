class FillCells {
    constructor(cG, cell, colors) {
        this.cG = cG;
        this.cell = cell;
        this.colors = colors;
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

    pixelated = function (splitW = 10, splitH = 10, shape="square") {
        let w = this.cell.w / splitW;
        let h = this.cell.h / splitH;
        for (var r = 0; r < splitW; r++) {
            for (var c = 0; c < splitH; c++) {
                let thisColor = random(this.colors);
                this.cG.noStroke();
                this.cG.fill(thisColor.h, thisColor.s, thisColor.l, 100);
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

        let colors = helper.shuffleArray([...this.colors]);

        let colorIndex = 0;
        let roll = helper.rollADie(11);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < circles; i++) {
            let {x, y, w, h} = this.position(circles, i, roll);

            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, 100);
            this.cG.ellipse(x, y, w, h);
            colorIndex++;
        }

    };

    diamond = function (diamonds = 4) {

        let colors = helper.shuffleArray([...this.colors]);

        let colorIndex = 0;
        let roll = helper.rollADie(11);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < diamonds; i++) {
            let {x, y, w, h} = this.position(diamonds, i, roll);

            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, 100);
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

        let colors = helper.shuffleArray([...this.colors]);

        let colorIndex = 0;
        let roll = helper.rollADie(11);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < squares; i++) {
            let {x, y, w, h} = this.position(squares, i, roll);

            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, 100);
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
            let colors = helper.shuffleArray([...this.colors]);
            let color1 = colors[0];
            let x = random(this.cell.w);
            let y = random(this.cell.h);
            this.cG.fill(color1.h, color1.s, color1.l, 90);
            this.cG.ellipse(x, y, random(helper.range(1, 3)));
        }
    };
}
