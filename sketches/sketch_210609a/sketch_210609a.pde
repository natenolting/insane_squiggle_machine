import java.util.UUID;

int cols = 6;
int rows = 6;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
// https://colorpalettes.net/color-palette-4288/
color c1 = #99998f;
color c2 = #cbb796;
color c3 = #f8a73f;
color c4 = #db5c01;
color c5 = #1b1612;
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

        //right
        vertex(gW*r,gH*c);
        vertex(gW*(r+1),gH*c);
        vertex(gW*r,gH*(c+1));
      } else {

        // left
        vertex(gW*r,gH*c);
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
  save("result-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

void keyPressed() {
  if(keyCode == 10) {
    redraw();
  }
}
