
import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
color[] colors  = new int[9];

void setup()
{
  size(1000, 1000);

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

  if ((width % (float(cols) * gW)) > 0.0) {
      float gWOffset = width % (float(cols) * gW);
      gW += gWOffset/float(rows);
  }

  if ((width % (float(rows) * gH)) > 0.0) {
      float gHOffset = width % (float(rows) * gH);
      gH += gHOffset/float(rows);
  }

  colorMode(HSB, 359, 99, 99, 100);
  color c1 = color(331, 100, 93, 100);
  color c2 = color(308, 100, 64, 100);
  color c3 = color(266, 100, 61, 100);
  color c4 = color(262, 100, 59, 100);
  color c5 = color(258, 100, 57, 100);
  color c6 = color(247, 85, 74, 100);
  color c7 = color(234, 78, 91, 100);
  color c8 = color(216, 75, 92, 100);
  color c9 = color(196, 72, 93, 100);
  colors[0] = c1;
  colors[1] = c2;
  colors[2] = c3;
  colors[3] = c4;
  colors[4] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;

}

// Draw a random color from the colors list
color randomColor() {
  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  return colors[colorNumbers.get(0)];
}


void draw() {
  noLoop();
  background(color(0,0,100, 100));
  // for(int r=0; r < rows; r++) {
  //   for(int c=0; c < cols; c++) {
  //
  //         stroke(color(0,0,0,100));
  //         fill(randomColor());
  //         beginShape();
  //         vertex(r*gW, c*gH);
  //         vertex(r*gW+gW, c*gH);
  //         vertex(r*gW+gW, c*gH+gH);
  //         vertex(r*gW, c*gH+gH);
  //         endShape(CLOSE);
  //     }
  //   }

    ArrayList<Coordinate> coordinates = new ArrayList();
    int coordStart = 0;
    for(int r = 0; r < rows + 1; r++) {
      for(int c = 0; c < cols + 1; c++) {
        coordinates.add(new Coordinate(c, r, c*gW, r*gH));
      }
    }
    int start = int(random(coordinates.size()));
    for(int i=0; i < coordinates.size(); i++) {
        if(!coordinates.get(start).used) {
        stroke(color(0,0,0,100));
        fill(randomColor());
        float x = coordinates.get(start).x;
        float y = coordinates.get(start).y;
        float v = random(pow(i, 2));
        float x1 = x;
        float y1 = y;
        float x2 = x+v;
        float y2 = y;
        float x3 = x+v;
        float y3 = y+v;
        float x4 = x;
        float y4 = y+v;
        float w = x2-x1;
        float h = y2-y1;
        boolean coinFlip = boolean(round(random(1)));
        // println(coinFlip);
        beginShape();
        vertex(x1, y1);
        vertex(x2, y2);
        vertex(x3, y3);
        vertex(x4, y4);
        endShape(CLOSE);
        coordinates.get(start).used = true;
        start = int(random(coordinates.size()));
      }
    }

}

void keyPressed() {
  // save a screenshot if 's' is pressed
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is pressed
  if(keyCode == 10) {
    redraw();
  }
}
