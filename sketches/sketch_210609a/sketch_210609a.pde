import java.util.UUID;

int cols = 3;
int rows = 3;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
// https://colorpalettes.net/color-palette-4269/
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

// function to find if given point
// lies inside a given rectangle or not.
static boolean FindPointInRectangle(int x1, int y1, int x2, int y2, int x, int y, boolean includeEdge) {

  if(includeEdge && x >= x1 && x <= x2 && y >= y1 && y <= y2) {
    return true;
  }

  if (x > x1 && x < x2 && y > y1 && y < y2) {
    return true;
  }

  return false;
}

void texturizeCell(int w, int h, int x1, int y1, int x2, int y2) {
  for (int x=x1; x < x1+w; x++) {
    for (int y=y1; y < y1+h; y++) {
      if(FindPointInRectangle(x1, y1, x2, y2, x, y, true)) {
          int c = int(random(colors.length));
          float s = random(2);
          //print(" ");
          //print("Size" + s);
          if (int(random(colors.length)) == int(colors.length/2)) {
            fill(colors[c]);
            if ((x==x1 || y==y2) && s >= 1) {
                circle(x+s, y+s, 1);
                //print(" ");
                //print("caught on left");
            } else if ((x==w-1 || y==h-1) && s >= 1) {
                circle(x-s, y-s, 1);
                //print(" ");
                //print("caught on right");
            } else {
                circle(x, y, s);
            }
        }
      }
    }
  }
}

void cell(int r, int c, color bgC, color shapeC) {

  int topLeftX = gW*r;
  int topLeftY = gH*c;

  int topRightX = gW*(r+1);
  int topRightY = gH*c;

  int bottomRightX = gW*(r+1);
  int bottomRightY = gH*(c+1);

  int bottomLeftX = gW*r;
  int bottomLeftY = gH*(c+1);

  noStroke();
  fill(bgC);
  // create background
  beginShape();
  // top left
  vertex(topLeftX,topLeftY);
  //top right
  vertex(topRightX,topRightY);
  // bottom right
  vertex(bottomRightX ,bottomRightY);
  // bottom left
  vertex(bottomLeftX,bottomLeftY);
  endShape();
  // create overlay shape
  fill(shapeC);

  int doTexture = int(random(2));
  if (doTexture == 1) {
  // texturize background
    texturizeCell(gW, gH, topLeftX, topLeftY, bottomRightX, bottomRightY);
  }

  noStroke();
  // which overlay to use
  int sT = int(random(3));

  // half circle
  if (sT == 0) {
      int a = int(random(2));
      if(a == 1) {
        //print("LEFT!");
        // left
        arc(gW*r-1, gH*c+gH/2, gW, gH, radians(-90), radians(90));
      } else {
        //print("RIGHT!");
        // right
        arc(gW*r+gW+1, gH*c+gH/2, gW, gH, radians(90), radians(270));
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
        vertex(topLeftX,topLeftY);
        vertex(topRightX,topRightY);
        vertex(bottomLeftX,bottomLeftY);
      } else {

        // left
        vertex(topLeftX,topLeftY);
        vertex(bottomRightX,bottomRightY);
        vertex(bottomLeftX,bottomLeftY);
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
  save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

void keyPressed() {
  if(keyCode == 10) {
    redraw();
  }
}
