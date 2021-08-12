class Overlap {
  constructor(container, shape) {
    this.container = container;
    this.shape = shape;
    this.shapePoints = [];
    this.lerpInc = 0.01;
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

  /**
    Borroed from https://stackoverflow.com/a/29915728/405758
    array of coordinates of each vertex of the polygon
    var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
    inside([ 1.5, 1.5 ], polygon); // true
  */
  // inside = function (point, vs) {
  //   // ray-casting algorithm based on
  //   // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
  //
  //   const x = point[0];
  //   const y = point[1];
  //   let ins = false;
  //
  //   for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
  //     const xi = vs[i][0];
  //     const yi = vs[i][1];
  //     const xj = vs[j][0];
  //     const yj = vs[j][1];
  //
  //     let intersect = ((yi > y) != (yj > y))
  //         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
  //     if (intersect) ins = !ins;
  //   }
  //
  //   return ins;
  // };


  // findOverlapPoints(cX, cY, x1, x2, y1, y2) {
  //   let shapePoints = [];
  //   for (var lerpStart = 0; lerpStart < 1; lerpStart += this.lerpInc) {
  //     let lX = lerp(x1, x2, lerpStart);
  //     let lY = lerp(y1, y2, lerpStart);
  //     let last = createVector(cX, cY);
  //
  //     for (var lerpStartA = 0; lerpStartA < 1; lerpStartA += this.lerpInc) {
  //       let lXa = lerp(cX, lX, lerpStartA);
  //       let lYa = lerp(cY, lY, lerpStartA);
  //       let inContainer = collidePointPoly(lXa, lYa, this.container);
  //       let inShape = collidePointPoly(lXa, lYa, this.shape);
  //       if (inContainer && inShape) {
  //         last = createVector(lXa, lYa);
  //         continue;
  //       }
  //
  //       if ((!inContainer && inShape) || (inContainer && !inShape)) {
  //         shapePoints.push(last);
  //         break;
  //       }
  //     }
  //   }
  //
  //   return shapePoints;
  // }
}
