class FillCells {
    constructor(cell, colors) {
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
                noStroke();
                let thisColor = random(this.colors);
                fill(thisColor.h, thisColor.s, thisColor.l, 100);
                rect(
                    this.cell.x + r * w,
                    this.cell.y + c * h,
                    w,
                    h,
                );
                noStroke();
            }
        }
    };

    target = function () {
        let centerX = this.cell.x + this.cell.w / 2;
        let centerY = this.cell.y + this.cell.h / 2;
        let colors = helper.shuffleArray([...this.colors]);

        let color1 = colors[0];
        let color2 = colors[1];
        let color3 = colors[2];

        fill(color1.h, color1.s, color1.l, 100);
        ellipse(this.cell.cX, this.cell.cY, this.cell.w);

        fill(color2.h, color2.s, color2.l, 100);
        ellipse(this.cell.cX, this.cell.cY, this.cell.w * .75);

        fill(color3.h, color3.s, color3.l, 100);
        ellipse(this.cell.cX, this.cell.cY, this.cell.w * .5);

        fill(color1.h, color1.s, color1.l, 100);
        ellipse(this.cell.cX, this.cell.cY, this.cell.w * .25);

    };

    or = function () {
        noFill();
        let color = random(this.colors);
        stroke(color.h, color.s, color.l, 100);
        strokeWeight(this.baseStrokeWidth);
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
        let color = random(this.colors);
        stroke(color.h, color.s, color.l, 100);
        strokeWeight(this.baseStrokeWidth);
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

    triangle = function () {
        let diceRoll = this.rollADie(4);
        let colors = helper.shuffleArray(this.colors);
        fill(colors[0].h, colors[0].s, colors[0].l, colors[0].a);
        switch (diceRoll) {
            case 1:
                triangle(
                    this.cell.x,
                    this.cell.y,
                    this.cell.x + this.cell.w,
                    this.cell.y,
                    this.cell.x + this.cell.w / 2,
                    this.cell.y + this.cell.h
                );
                break;
            case 2:
                triangle(
                    this.cell.x,
                    this.cell.y + this.cell.h,
                    this.cell.x + this.cell.w,
                    this.cell.y + this.cell.h,
                    this.cell.x + this.cell.w / 2,
                    this.cell.y
                );
                break;
            case 3:
                triangle(
                    this.cell.x,
                    this.cell.y,
                    this.cell.x + this.cell.w,
                    this.cell.y + this.cell.h / 2,
                    this.cell.x,
                    this.cell.y + this.cell.h
                );
                break;
            case 4:
                triangle(
                    this.cell.x + this.cell.w,
                    this.cell.y,
                    this.cell.x + this.cell.w,
                    this.cell.y + this.cell.h,
                    this.cell.x,
                    this.cell.y + this.cell.h / 2
                );
                break;
        }
    }

    diceRoll = function () {
        let diceRoll = this.rollADie(6);
        let dotW = this.cell.w / 5;
        let dotH = this.cell.h / 5;
        let colors = helper.shuffleArray([...this.colors]);
        fill(colors[0].h, colors[0].s, colors[0].l, 100);
        switch (diceRoll) {
            case 1:
                ellipse(
                    this.cell.x + this.cell.w / 2,
                    this.cell.y + this.cell.h / 2,
                    dotW,
                    dotH
                );
                break;

            case 2:
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
                break;

            case 3:
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
                break;

            case 4:
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
                break

            case 5:
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
                break;

            case 6:
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
                break;
        }
    };

    corner = function () {
        let colors = helper.shuffleArray([...this.colors]);
        let color1 = colors[0];
        let color2 = colors[1];
        let color3 = colors[2];
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
        } else {
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

    arc = function () {
        let baseStrokeWidth = this.cell.w / 10;
        let colors = helper.shuffleArray([...this.colors]);
        let color1 = colors[0];
        let color2 = colors[1];
        let color3 = colors[2];
        let color4 = colors[3];
        let degRange =  random(helper.range(int(baseStrokeWidth * 2), int(360 - baseStrokeWidth * 2)));
        let start = random(degRange);
        let finish = random(degRange);
        stroke(color1.h, color1.s, color1.l, 100);
        angleMode(DEGREES);
        noFill()
        strokeWeight(baseStrokeWidth);
        strokeCap(ROUND);
        arc(
            this.cell.cX,
            this.cell.cY,
            this.cell.w - baseStrokeWidth,
            this.cell.h - baseStrokeWidth,
            start,
            finish,
            OPEN
        );
        stroke(color2.h, color2.s, color2.l, 100);
        arc(
            this.cell.cX,
            this.cell.cY,
            (this.cell.w - baseStrokeWidth * 3),
            (this.cell.h - baseStrokeWidth * 3),
            start,
            finish,
            OPEN
        );
        stroke(color3.h, color3.s, color3.l, 100);
        arc(
            this.cell.cX,
            this.cell.cY,
            (this.cell.w - baseStrokeWidth * 5),
            (this.cell.h - baseStrokeWidth * 5),
            start,
            finish,
            OPEN
        );
        stroke(color4.h, color4.s, color4.l, 100);
        arc(
            this.cell.cX,
            this.cell.cY,
            (this.cell.w - baseStrokeWidth * 7),
            (this.cell.h - baseStrokeWidth * 7),
            start,
            finish,
            OPEN
        );
    }
}
