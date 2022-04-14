class FillCells {
    constructor(cG, cell, colors) {
        this.cG = cG;
        this.cell = cell;
        this.colors = colors;
        this.helper = new Helpers();
        this.baseStrokeWidth = this.cell.w / 6;
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

    pixelated = function (splitW = 10, splitH = 10) {
        let w = this.cell.w / splitW;
        let h = this.cell.h / splitH;
        for (var r = 0; r < splitW; r++) {
            for (var c = 0; c < splitH; c++) {
                let thisColor = random(this.colors);
                this.cG.noStroke();
                this.cG.fill(thisColor.h, thisColor.s, thisColor.l, 100);
                this.cG.ellipse(
                    this.cell.x + r * w + w / 2,
                    this.cell.y + c * h + h / 2,
                    w,
                    h,
                );
                this.cG.noStroke();
            }
        }
    };

    target = function (circles = 4) {

        let colors = helper.shuffleArray([...this.colors]);

        let colorIndex = 0;
        let roll = helper.rollADie(9);
        // loop over the number of circles and build them from largest to smallest
        for (var i = 0; i < circles; i++) {
            let x, y, w, h, m;
            m = (i * (100 / circles * 0.01));
            switch (roll) {
                case 1:
                    x = this.cell.cX;
                    y = this.cell.cY;
                    w = this.cell.w - (this.cell.w * m);
                    h = this.cell.h - (this.cell.h * m);
                    break;
                case 2:
                    x = 0;
                    y = 0;
                    w = (this.cell.w * 2) - (this.cell.w * m * 2);
                    h = (this.cell.h * 2) - (this.cell.h * m * 2);
                    break;
                case 3:
                    x = this.cell.cX;
                    y = 0;
                    w = this.cell.w - (this.cell.w * m);
                    h = this.cell.h - (this.cell.h * m);
                    break;
                case 4:
                    x = this.cell.w;
                    y = 0;
                    w = (this.cell.w * 2) - (this.cell.w * m * 2);
                    h = (this.cell.h * 2) - (this.cell.h * m * 2);
                    break;
                case 5:
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
                    x = 0;
                    y = this.cell.h;
                    w = (this.cell.w * 2) - (this.cell.w * m * 2);
                    h = (this.cell.h * 2) - (this.cell.h * m * 2);
                    break;
                case 8:
                    x = this.cell.cX;
                    y = this.cell.h;
                    w = this.cell.w - (this.cell.w * m);
                    h = this.cell.h - (this.cell.h * m);
                    break;
                case 9:
                    x = this.cell.w;
                    y = this.cell.h;
                    w = (this.cell.w * 2) - (this.cell.w * m * 2);
                    h = (this.cell.h * 2) - (this.cell.h * m * 2);
                    break;
                default:

            }


            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let color = colors[colorIndex];
            this.cG.fill(color.h, color.s, color.l, 100);
            this.cG.ellipse(x, y, w, h);
            colorIndex++;
        }

    };

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
