class Cell {
  constructor(row = 0, col = 0, x = 0, y = 0, w = 25, h = 25, used = false, cellIndex = 0) {
    this.index = cellIndex;
    this.row = row;
    this.col = col;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cX = this.x + this.w / 2;
    this.cY = this.y + this.h / 2;
    this.used = used;

  }
}

class Cells {

  constructor(cols = 10, rows = 10, cW = 25, cH = 25) {
    this.cols = cols;
    this.rows = rows;
    this.cW = cW;
    this.cH = cH;
    this.width = this.cols * this.cW;
    this.height = this.rows * this.cH;
  }

  populateCells = function (
    genExtraLarge = false,
    extraLargeChance = 25,
    extraLargeMultiplier = 5
  ) {
    // extra large multiple
    let eM = 1;
    let newCells = [];
    let newExtraLargeCells = [];
    let extraLargeHit;
    let cellIndex = 0;
    let largeCellIndex = 0;
    for (var c = 0; c < this.cols; c++) {
      for (var r = 0; r < this.rows; r++) {
        let newCell = new Cell(
          r,
          c,
          c * this.cW,
          r * this.cH,
          this.cW,
          this.cH,
          false,
          cellIndex
        );
        cellIndex++;

        // extra large multiple
        extraLargeHit = Math.ceil(Math.random() * extraLargeChance);
        eM = Math.ceil(Math.random() * extraLargeMultiplier);
        newCells.push(newCell);

        if (
          genExtraLarge
          && extraLargeHit === extraLargeChance
          && newCell.x + newCell.w + (this.cW * eM) < this.width
          && newCell.y + newCell.h + (this.cH * eM) < this.height
        ) {
          let extraLargeCell = new Cell(
            r,
            c,
            c * this.cW,
            r * this.cH,
            newCell.w + (this.cW * eM),
            newCell.h + (this.cH * eM),
            false,
            largeCellIndex
          );

          extraLargeCell.colStart = extraLargeCell.col;
          extraLargeCell.colEnd = extraLargeCell.col + (extraLargeCell.w / this.cW) - 1;

          extraLargeCell.rowStart = extraLargeCell.row;
          extraLargeCell.rowEnd = extraLargeCell.row + (extraLargeCell.h / this.cH) - 1;

          largeCellIndex++;
          newExtraLargeCells.push(extraLargeCell);
        }
      }
    }

    // check for large cells that overlap others down the line
    for (var i = 0; i < newExtraLargeCells.length; i++) {
      for (var e = i + 1; e < newExtraLargeCells.length; e++) {
        if (this.intersection(newExtraLargeCells[i], newExtraLargeCells[e])) {
          newExtraLargeCells[e].used = true;
        }
      }
    }

    // filter out overlapping
    _.remove(newExtraLargeCells, function (o) { return o.used; });

    // check for normal cells that are overlapped by the large cells
    for (var i = 0; i < newCells.length; i++) {
      for (var e = 0; e < newExtraLargeCells.length; e++) {
        if (this.intersection(newCells[i], newExtraLargeCells[e])) {
          newCells[i].used = true;
        }
      }
    }

    // filter out overlapping
    _.remove(newCells, function (o) { return o.used; });


    // find adjacent cells to large Cells
    for (var i = 0; i < newExtraLargeCells.length; i++) {
      newExtraLargeCells[i].adjacentCells = _.filter(newCells, function (e) {
            return e.col >= newExtraLargeCells[i].colStart - 1
            && e.col <= newExtraLargeCells[i].colEnd + 1
            && e.row >= newExtraLargeCells[i].rowStart - 1
            && e.row <= newExtraLargeCells[i].rowEnd + 1;
          });

    }

    return [newCells, newExtraLargeCells];
  };

  // https://editor.p5js.org/eric/sketches/HkW2DRKnl
  intersection = function (rect1, rect2) {
    let x1 = rect2.x;
    let y1 = rect2.y;
    let x2 = x1 + rect2.w;
    let y2 = y1 + rect2.h;
    if (rect1.x > x1) { x1 = rect1.x; }

    if (rect1.y > y1) { y1 = rect1.y; }

    if (rect1.x + rect1.w < x2) { x2 = rect1.x + rect1.w; }

    if (rect1.y + rect1.h < y2) { y2 = rect1.y + rect1.h; }

    return (x2 <= x1 || y2 <= y1) ? false : { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  };

};
