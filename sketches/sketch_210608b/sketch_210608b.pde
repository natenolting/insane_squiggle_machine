int cols = 5;
int rows = 5;
int screenshotCount=1;
// https://colorpalettes.net/color-palette-4288/
color c1 = #252b31;
color c2 = #5e6668;
color c3 = #c1c8c7;
color c4 = #f6fafb;
color c5 = #d49c6b;
color[] colors  = {c1, c2, c3, c4, c5};
int gH, gW;
void setup() {
  size(1080,1080);
  gH = height/rows;
  gW = width/cols;
}

void cell(int r, int c, color bgC, color shapeC) {
  noStroke();
  fill(bgC);
  // create background
  beginShape();
  // top left
  vertex(gW*r,gH*c);
  //top right
  vertex(gW*(r+1),gH*c);
  // bottom right
  vertex(gW*(r+1),gH*(c+1));
  // bottom left
  vertex(gW*r,gH*(c+1));
  endShape();
  // create overlay shape
  fill(shapeC);

  // which overlay to use
  int sT = int(random(3));

  // half circle
  if (sT == 0) {
      int a = int(random(2));
      if(a == 1) {
        //print("LEFT!");
        // left
        arc(gW*r, gH*c+gH/2, gW, gH, radians(-90), radians(90));
      } else {
        //print("RIGHT!");
        // right
        arc(gW*r+gW, gH*c+gH/2, gW, gH, radians(90), radians(270));
      }
  }

  // full circle
  if (sT == 1) {
    ellipse(gW*r+gW/2, gH*c+gH/2, gW, gH);
  }
  // triangle
  if (sT == 2) {
      int t = int(random(2));
      beginShape();
      if(t == 1) {

        //top left
        vertex(gW*r,gH*c);
        vertex(gW*(r+1),gH*c);
        vertex(gW*r,gH*(c+1));
      } else {

        // bottom right
        vertex(gW*(r+1),gH*c);
        vertex(gW*(r+1),gH*(c+1));
        vertex(gW*r,gH*(c+1));
      }
      endShape();
  }

}


void draw() {
  background(0);
  noLoop();
  noStroke();
  for(int c=0; c < cols; c++) {
    for(int r=0; r < rows; r++) {
        // bg color
        int cI = int(random(colors.length));
        // shape color
        int scI = int(random(colors.length));
        // make sure the shape and the background color don't match
        while(scI == cI) {
          scI = int(random(colors.length));
        }
        cell(r, c, colors[cI], colors[scI]);
    }
  }
  save("result"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

void keyPressed() {
  redraw();
}
