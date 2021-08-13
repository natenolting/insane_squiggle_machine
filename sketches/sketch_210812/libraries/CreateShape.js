class CreateShape {
  constructor(x1, x2, y1, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  /**
  Create a rectangular shape
  */
  rectangle = function() {
    return [
      createVector(this.x1, this.y1),
      createVector(this.x2, this.y1),
      createVector(this.x2, this.y2),
      createVector(this.x1, this.y2),
    ];
  };

  /**
  Create a pill shape
  inspired from https://editor.p5js.org/ebenjmuse/sketches/Sk2uaKN9-
  */
  pill = function () {
    // fill(0,0,0, 50);
    // rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);

    let v = [];

    // radius of pill arc
    let radius;

    // offset to set the arcs off to
    let offset;

    let n = 4;
    let points = Math.pow(10, n);

    //angle between points
    let pointAngle = 360 / points;

    if (this.x2 - this.x1 > this.y2 - this.y1) {
      // horizal pill
      // console.log('horizontal pill');
      radius = (this.y2 - this.y1) / 2;

      // ellipse(this.x1 + radius, this.y1 + radius, 10);
      // ellipse(this.x2 - radius, this.y2 - radius, 10);

      offset = dist(this.x1 + radius, this.y1 + radius, this.x2 - radius, this.y2 - radius);
      // console.log(offset);
      for (let angle = 270; angle > 90; angle = angle - pointAngle) {
        //convert angle to radians for x and y coordinates
        let x = cos(radians(angle)) * radius;
        let y = sin(radians(angle)) * radius;

        // noFill();
        // stroke(0,0,0,50);
        //draw a line from each point back to the centre
        // line(radius, radius, x + radius, y + radius);

        v.push(createVector(x + radius + this.x1, y + radius + this.y1));
      }

      // Set the offset
      v.push(createVector(v[v.length - 1].x + offset, v[v.length - 1].y));

      // Add arcs
      for (let angle = 90; angle > 0; angle = angle - pointAngle) {
        //convert angle to radians for x and y coordinates
        let x = cos(radians(angle)) * radius;
        let y = sin(radians(angle)) * radius;

        // noFill();
        // stroke(0,0,0,50);
        //draw a line from each point back to the centre
        // line(radius + offset, radius, x+radius + offset, y+radius);

        v.push(createVector(x + radius + this.x1 + offset, y + radius + this.y1));
      }

      for (let angle = 360; angle > 270; angle = angle - pointAngle) {
        //convert angle to radians for x and y coordinates
        let x = cos(radians(angle)) * radius;
        let y = sin(radians(angle)) * radius;

        // noFill();
        // stroke(0,0,0,50);
        //draw a line from each point back to the centre
        // line(radius + offset, radius, x+radius + offset, y+radius);
        v.push(createVector(x + radius + this.x1 + offset, y + radius + this.y1));
      }

      // finish the shape with the offset and bring it back to the start
      v.push(createVector(v[v.length - 1].x - offset, v[v.length - 1].y));
      v.push(createVector(v[0].x, v[0].y));

    } else {
      // vertical pill
      // console.log('vertical pill');
      radius = (this.x2 - this.x1) / 2;

      // ellipse(this.x1 + radius, this.y1 + radius, 5);
      // ellipse(this.x2 - radius, this.y2 - radius, 5);

      // Set the offset
      offset = dist(this.x1 + radius, this.y1 + radius, this.x2 - radius, this.y2 - radius);
      for (let angle = 180; angle < 360; angle = angle + pointAngle) {
        //convert angle to radians for x and y coordinates
        let x = cos(radians(angle)) * radius;
        let y = sin(radians(angle)) * radius;

        // noFill();
        // stroke(0,0,0,50);
        // //draw a line from each point back to the centre
        // line(radius + this.x1, radius + this.y1, x + radius + this.x1, y + radius + this.y1);

        v.push(createVector(x + radius + this.x1, y + radius + this.y1));
      }

      // add the offset
      v.push(createVector(v[v.length - 1].x, v[v.length - 1].y + offset));

      for (let angle = 0; angle < 180; angle = angle + pointAngle) {
        //convert angle to radians for x and y coordinates
        let x = cos(radians(angle)) * radius;
        let y = sin(radians(angle)) * radius;

        // noFill();
        // stroke(0,0,0,50);
        //draw a line from each point back to the centre
        //line(radius + this.x1, radius + this.y1 + offset, x + radius + this.x1, y + radius + this.y1 + offset);
        v.push(createVector(x + radius + this.x1, y + radius + this.y1 + offset));
      }

      // finish the shape with the offset and bring it back to the start
      v.push(createVector(v[v.length - 1].x, v[v.length - 1].y - offset));
      v.push(createVector(v[0].x, v[0].y));

    }

    return v;
  };
}
