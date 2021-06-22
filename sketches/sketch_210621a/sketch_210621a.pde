
import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 100;
String screenshotSet = UUID.randomUUID().toString();
int cols = 0;
int rows = 0;
float gH = 0.0;
float gW = 0.0;

// How many colors will we use
color[] colors  = new int[10];

void setup()
{
  size(1000, 1000);

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = width/cols;
  gW = height/rows;

  if ((width % (float(cols) * gW)) > 0.0) {
      float gWOffset = width % (float(cols) * gW);
      gW += gWOffset/float(rows);
  }

  if ((width % (float(rows) * gH)) > 0.0) {
      float gHOffset = width % (float(rows) * gH);
      gH += gHOffset/float(rows);
  }


  colorMode(HSB, 359, 100, 100, 100);
  // https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  color c1 = color(73, 38, 93, 100);
  color c2 = color(92, 39, 89, 100);
  color c3 = color(110, 35, 85, 100);
  color c4 = color(141, 41, 78, 100);
  color c5 = color(163, 55, 71, 100);
  color c6 = color(182, 68, 64, 100);
  color c7 = color(194, 87, 68, 100);
  color c8 = color(199, 84, 62, 100);
  color c9 = color(206, 79, 57, 100);
  color c10 = color(206, 80, 47, 100);
  colors[0] = c1;
  colors[1] = c2;
  colors[2] = c3;
  colors[3] = c4;
  colors[3] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;
  colors[9] = c10;

}

void findSpace(int[][] coord) {
  int start = 0;
  // find the first availible starting point
  for(int i=0; i < 1000; i++) {
      int id = floor(random(coord.length));
      if (coord[id] != null && coord[id][2] != 1) {
        start = id;
        break;
      }
  }
  if (coord[start][2] != 1) {
    float startX = float(coord[start][0])*gW;
    float startY = float(coord[start][1])*gH;
    float endX = 0;
    float endY = 0;
    coord[start][2] = 1;
    strokeWeight(20);
    stroke(colors[1]);
    // first get the furthest we can go in the x direction
    for(int i = start + 1; i < coord.length; i++) {
      if (coord[i] == null) {
        break;
      }

      if(coord[i][2] == 1) {
        break;
      }

      if (float(coord[i][0])*gW <= float(cols)*gW) {
        endX = float(coord[i][0])*gW;
        if(ceil(endX) >= ceil(float(cols)*gW)) {
          break;
        }
      }

      try {
        if (coord[i+1][0] == 0 || coord[i+1][2] == 1) {
            break;
        }
      }
      catch(ArrayIndexOutOfBoundsException exception) {
          // carry on
      }
    }

    // next get the furthest we can go in the y direction
    for(int i=start + cols; i < coord.length; i++) {
      if (coord[i] == null || coord[i][2] == 1) {
        break;
      }

      if(coord[i][1] == rows || ceil(float(coord[i][1])*gH) >= ceil(float(rows)*gH)) {
        break;
      }

      if (float(coord[i][1])*gH <= float(rows)*gH) {
        endY = float(coord[i][1])*gH;
        if(ceil(endY) >= ceil(float(rows)*gH)) {
          break;
        }
      }
    }

    // now we have the rectangle x and y we can find the inside also

    noStroke();
    fill(colors[int(random(10))]);
    beginShape();
    for(int i = 0; i < coord.length; i++) {

        if(float(coord[i][0])*gW >= startX
          && float(coord[i][0])*gW+gW <= endX
          && float(coord[i][1])*gH >= startY
          && float(coord[i][1])*gH+gH <= endY
        ) {
        coord[i][2] = 1;

        vertex(float(coord[i][0])*gW, float(coord[i][1])*gH);
        vertex(float(coord[i][0])*gW+gW, float(coord[i][1])*gH);
        vertex(float(coord[i][0])*gW+gW, float(coord[i][1])*gH+gH);
        vertex(float(coord[i][0])*gW, float(coord[i][1])*gH+gH);
        endShape(CLOSE);
      }

    }

    stroke(colors[0]);
    strokeWeight(5);
    noFill();
    beginShape();
    vertex(startX, startY);
    vertex(endX, startY);
    vertex(endX, endY);
    vertex(startX, endY);
    endShape(CLOSE);
  }
}


void draw() {
  noLoop();
  strokeWeight(5);
  noFill();
  background(color(0,0,100, 100));

  int[][] coordinates = new int[int(rows*cols)][];
  int coordStart = 0;
  for(int r = 0; r < rows; r++) {
    for(int c = 0; c < cols; c++) {
      coordinates[coordStart] = new int[] {c, r, 0};
      coordStart++;
      stroke(colors[5]);
      strokeWeight(5);
      point(float(c)*gW, float(r)*gH);
      if(c == cols - 1) {
        point(float(c + 1)*gW, float(r)*gH);
      }
      if(r == rows - 1) {
        point(float(c)*gW, float(r + 1)*gH);
      }

      if(r == rows - 1 && c == cols - 1) {
        point(float(cols) * gW, float(rows) * gH);
      }
    }
  }
  for(int i=0; i < 1000; i++) {
    findSpace(coordinates);
  }


  //print(" x1/x2/x3/x4 -  " + startX +'/'+ startY +'/'+endX +'/'+endY +'/');

}

void keyPressed() {
  // save a screenshot if 's' is presed
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is presed
  if(keyCode == 10) {
    redraw();
  }
}
