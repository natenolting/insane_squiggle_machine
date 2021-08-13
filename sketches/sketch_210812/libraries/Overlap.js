class Overlap {
  constructor(container, shape, lerpInc=0.01) {
    this.container = container;
    this.shape = shape;
    this.shapePoints = [];
    this.lerpInc = lerpInc;
  }

  // https://www.geeksforgeeks.org/how-to-get-bounding-box-of-different-shapes-in-p5-js/
  // Draws bounding-box around the shape
  getShapeBoundingBox = function () {
    let x = [];
    let y = [];

    for (let i = 0; i < this.shape.length; i++) {
      x.push(this.shape[i].x);
      y.push(this.shape[i].y);
    }

    let rx = min(x);
    let ry = min(y);
    let w = max(x) - rx;
    let h = max(y) - ry;
    return { x: rx, y: ry, w: w, h: h };
  };

  // https://www.geeksforgeeks.org/how-to-get-bounding-box-of-different-shapes-in-p5-js/
  // Draws bounding-box around the container
  getContainerBoundingBox = function () {
    let x = [];
    let y = [];

    for (let i = 0; i < this.container.length; i++) {
      x.push(this.container[i].x);
      y.push(this.container[i].y);
    }

    let rx = min(x);
    let ry = min(y);
    let w = max(x) - rx;
    let h = max(y) - ry;
    return { x: rx, y: ry, w: w, h: h };
  };

  findOverlap = function () {
    let containerBB = this.getContainerBoundingBox();
    //console.log(this.container);
    //console.log(containerBB);
    for (var lerpStartY = 0; lerpStartY < 1; lerpStartY += this.lerpInc) {
      let ly = lerp(containerBB.y, containerBB.y + containerBB.h, lerpStartY);
      for (var lerpStartX = 0; lerpStartX < 1; lerpStartX += this.lerpInc) {
        let lx = lerp(containerBB.x, containerBB.x + containerBB.w, lerpStartX);
        let inContainer = collidePointPoly(lx, ly, this.container);
        let inShape = collidePointPoly(lx, ly, this.shape);
        if (inContainer && inShape) {
          this.shapePoints.push(createVector(lx, ly));
        }

      }
    }

    return this.shapePoints;
  };
}
