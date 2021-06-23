
import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 30;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows;
float gH, gW;

// How many colors will we use
color[] colors  = new int[10];

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
  colors[4] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;
  colors[9] = c10;
  // color c1 = color(60,8.53,100);
  // color c2 = color(38,31,75,100);
  // color c3 = color(32,80,90,100);
  // color c4 = color(19, 96, 82, 100);
  // color c5 = color(30, 29, 8, 100);
  //
  // colors[0] = c1;
  // colors[1] = c2;
  // colors[2] = c3;
  // colors[3] = c4;
  // colors[4] = c5;


}


void draw() {
  noLoop();
  strokeWeight(5);
  noFill();
  background(color(0,0,100, 100));


  ArrayList<Coordinate> coordinates = new ArrayList();
  stroke(colors[9]);
  strokeWeight(5);
  beginShape(POINTS);
  int coordStart = 0;
  for(int r = 0; r < rows + 1; r++) {
    for(int c = 0; c < cols + 1; c++) {
      coordinates.add(new Coordinate(c, r, c*gW, r*gH));
      vertex(c*gW,r*gH);
    }
  }
  endShape();


    // // crop
    // smooth();
    // stroke(color(0,0,100,100));
    // strokeWeight(gW*10);
    // ellipse(width/2, height/2, width+gW*10, height+gH*10);

  // beginShape(POINTS);
  // for(int r = 0; r < rows + 1; r++) {
  //   for(int c = 0; c < cols + 1; c++) {
  //     ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  //     for(int ci = 0; ci < colors.length; ci++)
  //     {
  //       colorNumbers.add(ci);
  //     }
  //     Collections.shuffle(colorNumbers);
  //
  //     stroke(hue(colors[colorNumbers.get(0)]), saturation(colors[colorNumbers.get(0)]), brightness(colors[colorNumbers.get(0)]), 25);
  //     strokeWeight(5);
  //     vertex(float(c)*gW, float(r)*gH);
  //   }
  // }
  // endShape();

}




void keyPressed() {
  // save a screenshot if 's' is presed
  if(key == 's') {
    save("result-h-"+nf(height)+"-w-"+nf(width)+"-s-"+nf(scale)+"-r-"+nf(rows)+"-c-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is presed
  if(keyCode == 10) {
    redraw();
  }
}
