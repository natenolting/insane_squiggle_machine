import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 200;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
color[] colors  = new int[10];

void setup()
{
  size(1000, 1000);

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

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


void draw() {

  noFill();
  noLoop();
  background(color(0,0,100, 100));

  float a = 0.0;
  float inc = TWO_PI/25.0;
  float prev_x = 0, prev_y = gH, x, y;

  for(int d=1; d <= rows; d++) {
  for(int i=0; i<width; i=i+4) {
    x = i;
    y = d*gH + sin(a) * 40.0;
    line(prev_x, prev_y, x, y);
    prev_x = x;
    prev_y = y;
    a = a + inc;
  }
  x=0;
  y=d*gH;
  prev_x = x;
  prev_y = y;
}

  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);
  int cr1 = colorNumbers.get(0);
  int cr2 = colorNumbers.get(1);
  int cr3 = colorNumbers.get(2);


//   for (int r = 0; r < rows; r++) {
//     for (int c = 0; c < cols; c++) {
//       Circular cir = new Circular(r*gW+gW/2, c*gH+gH/2, r*gW, c*gH, gW, gH, 0.001, false);
//       cir.cirularArc();
//     }
//   }
// }

  // float a = 0.0;
  // float inc = TWO_PI/25.0;
  // float prev_x = 0, prev_y = 50, x, y;
  //
  // for(int i=0; i<width; i=i+4) {
  // x = i;
  // y = height/2 + sin(a) * 40.0;
  // line(prev_x, prev_y, random(width), random(height));
  // prev_x = x;
  // prev_y = y;
  // a = a + inc;
  // }

  // background(color(0,0,100,100));
  //
  // float a = 0.0;
  // float inc = TWO_PI/25.0;
  // float prev_x = 0, prev_y = 50, x, y;
  // int cycles = 10;
  // for(int d = 1; d <= rows; d++) {
  //   for(int i=0; i<100; i=i+gW/d) {
  //     x = i;
  //     y = height/2 + sin(a) * 40.0;
  //     //line(prev_x, prev_y, x, y);
  //     //circle(x, y, 10);
  //     ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  //     for(int ci = 0; ci < colors.length; ci++)
  //     {
  //       colorNumbers.add(ci);
  //     }
  //     Collections.shuffle(colorNumbers);
  //     int cr1 = colorNumbers.get(0);
  //     int cr2 = colorNumbers.get(1);
  //     int cr3 = colorNumbers.get(2);
  //
  //
  //     stroke(colors[cr1]);
  //     strokeWeight(1);
  //     line(prev_x, prev_y, x, y);
  //     prev_x = x;
  //     prev_y = y;
  //     a = a + inc;
  //   }
  //   // stroke(color(0,0,100,100));
  //   // strokeWeight(gW*d);
  //   //circle(width/2, height/2, width-gW*(d+1));
  // }
  // stroke(color(0,0,100,100));
  // strokeWeight(gW*3.25);
  // circle(width/2, height/2, width+gW*3);
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
