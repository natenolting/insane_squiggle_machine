import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.*; 
import java.util.UUID; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210617a extends PApplet {




int screenshotCount=1;
// control the size of the grid
int scale = 200;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
int[] colors  = new int[10];

public void setup()
{
  

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

  colorMode(HSB, 359, 100, 100, 100);
  // https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  int c1 = color(73, 38, 93, 100);
  int c2 = color(92, 39, 89, 100);
  int c3 = color(110, 35, 85, 100);
  int c4 = color(141, 41, 78, 100);
  int c5 = color(163, 55, 71, 100);
  int c6 = color(182, 68, 64, 100);
  int c7 = color(194, 87, 68, 100);
  int c8 = color(199, 84, 62, 100);
  int c9 = color(206, 79, 57, 100);
  int c10 = color(206, 80, 47, 100);
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


public void draw() {

  noFill();
  noLoop();
  background(color(0,0,100, 100));

  float a = 0.0f;
  float inc = TWO_PI/25.0f;
  float prev_x = 0, prev_y = gH, x, y;

  for(int d=1; d <= rows; d++) {
  for(int i=0; i<width; i=i+4) {
    x = i;
    y = d*gH + sin(a) * 40.0f;
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


public void keyPressed() {
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
public class Circular {

  public float centerX;
  public float centerY;
  public float containerX;
  public float containerY;
  public float containerW;
  public float containerH;
  public float variance;
  public boolean clipLine;

  public Circular(float cX, float cY, float conX, float conY, float conW, float conH, float v, boolean cl) {
    centerX = cX;
    centerY = cY;
    containerX = conX;
    containerY = conY;
    containerW = conW;
    containerH = conH;
    variance = v;
    clipLine = cl;

  }

  private void drawLine(float x1, float y1, float x2, float y2, float cX, float cY, float cW, float cH)
  {
    if(clipLine) {
      line_clipped(x1, y1, x2, y2, cX, cY, cW, cH);
    } else {
      line(x1, y1, x2, y2);
    }
  }

  public void topRightArc() {

    float lastX, lastY, nextX, nextY;

    for(float a=PI+HALF_PI; a <= PI+HALF_PI+HALF_PI; a+=variance) {
      lastX = centerX + (containerW/2) * cos(a-variance);
      lastY = centerY + (containerH/2) * sin(a-variance);
      nextX = centerX + (containerW/2) * cos(a);
      nextY =  centerY + (containerH/2) * sin(a);
      drawLine(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
    }
  }

  public void bottomRightArc() {

    float lastX, lastY, nextX, nextY;

    for(float a=HALF_PI-QUARTER_PI*2; a <= HALF_PI + variance; a+=variance) {
      lastX = centerX + (containerW/2) * cos(a-variance);
      lastY = centerY + (containerH/2) * sin(a-variance);
      nextX = centerX + (containerW/2) * cos(a);
      nextY =  centerY + (containerH/2) * sin(a);
      drawLine(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
    }
  }


  public void topLeftArc() {

    float lastX, lastY, nextX, nextY;

    for(float a=PI+HALF_PI; a >= PI; a+=-variance) {
      lastX = centerX + (containerW/2) * cos(a+variance);
      lastY = centerY + (containerH/2) * sin(a+variance);
      nextX = centerX + (containerW/2) * cos(a);
      nextY =  centerY + (containerH/2) * sin(a);
      drawLine(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
    }
  }


  public void bottomLeftArc() {

    float lastX, lastY, nextX, nextY;
    for(float a=PI; a >= HALF_PI - variance; a+=-variance) {
      lastX = centerX + (containerW/2) * cos(a+variance);
      lastY = centerY + (containerH/2) * sin(a+variance);
      nextX = centerX + (containerW/2) * cos(a);
      nextY =  centerY + (containerH/2) * sin(a);
      //line(lastX, lastY, nextX, nextY);
      drawLine(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
    }
  }

  public void cirularArc() {
      topRightArc();
      bottomRightArc();
      topLeftArc();
      bottomLeftArc();
  }

  /*
   * Encode a given point (x, y) into the different regions of
   * a clip window as specified by its top-left corner (cx, cy)
   * and it's width and height (cw, ch).
   */
  private int encode_endpoint(
    float x, float y,
    float clipx, float clipy, float clipw, float cliph)
  {
    int code = 0; /* Initialized to being inside clip window */

    /* Calculate the min and max coordinates of clip window */
    float xmin = clipx;
    float xmax = clipx + clipw;
    float ymin = clipy;
    float ymax = clipy + clipw;

    if (x < xmin)       /* to left of clip window */
      code |= (1 << 0);
    else if (x > xmax)  /* to right of clip window */
      code |= (1 << 1);

    if (y < ymin)       /* below clip window */
      code |= (1 << 2);
    else if (y > ymax)  /* above clip window */
      code |= (1 << 3);

    return code;
  }

  private boolean line_clipped(
    float x0, float y0, float x1, float y1,
    float clipx, float clipy, float clipw, float cliph) {

    /* Stores encodings for the two endpoints of our line */
    int e0code, e1code;

    /* Calculate X and Y ranges for our clip window */
    float xmin = clipx;
    float xmax = clipx + clipw;
    float ymin = clipy;
    float ymax = clipy + cliph;

    /* Whether the line should be drawn or not */
    boolean accept = false;

    do {
      /* Get encodings for the two endpoints of our line */
      e0code = encode_endpoint(x0, y0, clipx, clipy, clipw, cliph);
      e1code = encode_endpoint(x1, y1, clipx, clipy, clipw, cliph);

      if (e0code == 0 && e1code == 0) {
        /* If line inside window, accept and break out of loop */
        accept = true;
        break;
      } else if ((e0code & e1code) != 0) {
        /*
         * If the bitwise AND is not 0, it means both points share
         * an outside zone. Leave accept as 'false' and exit loop.
         */
        break;
      } else {
        /* Pick an endpoint that is outside the clip window */
        int code = e0code != 0 ? e0code : e1code;

        float newx = 0, newy = 0;

        /*
         * Now figure out the new endpoint that needs to replace
         * the current one. Each of the four cases are handled
         * separately.
         */
        if ((code & (1 << 0)) != 0) {
          /* Endpoint is to the left of clip window */
          newx = xmin;
          newy = ((y1 - y0) / (x1 - x0)) * (newx - x0) + y0;
        } else if ((code & (1 << 1)) != 0) {
          /* Endpoint is to the right of clip window */
          newx = xmax;
          newy = ((y1 - y0) / (x1 - x0)) * (newx - x0) + y0;
        } else if ((code & (1 << 3)) != 0) {
          /* Endpoint is above the clip window */
          newy = ymax;
          newx = ((x1 - x0) / (y1 - y0)) * (newy - y0) + x0;
        } else if ((code & (1 << 2)) != 0) {
          /* Endpoint is below the clip window */
          newy = ymin;
          newx = ((x1 - x0) / (y1 - y0)) * (newy - y0) + x0;
        }

        /* Now we replace the old endpoint depending on which we chose */
        if (code == e0code) {
          x0 = newx;
          y0 = newy;
        } else {
          x1 = newx;
          y1 = newy;
        }
      }
    } while (true);

    /* Only draw the line if it was not rejected */
    if (accept)
      line(x0, y0, x1, y1);

    return accept;
  }

}
public class Gradient {


  public void gradientEllipse(float centerX, float centerY, float containerW, float containerH, float variance, int stepHeight, int c1, int c2) {

    float lPerc = 0.0f;
    int offset = 0;
    int topCount = 0;
    int bottomCount = 0;

    int topToMddleC =  lerpColor(c1, c2, .5f);
    int middleToBottomC =  lerpColor(c1, c2, 1);
    float nextX, nextY;

    float[][] topLeft = new float[PApplet.parseInt(90/variance)][];
    float[][] topRight = new float[PApplet.parseInt(90/variance)][];
    float[][] bottomLeft = new float[PApplet.parseInt(90/variance)][];
    float[][] bottomRight = new float[PApplet.parseInt(90/variance)][];

    // Top Left Arc
    offset = 0;
    for(float a=PI+HALF_PI; a >= PI; a+=-variance) {
      nextX = centerX + (containerW/2) * cos(a);
      nextY =  centerY + (containerH/2) * sin(a);
      topLeft[offset] = new float[] {nextX, nextY};
      offset++;
    }

    // Top Right Arc
    offset = 0;
    for(float a=PI+HALF_PI; a <= PI+HALF_PI+HALF_PI; a+=variance) {
      nextX = centerX + (containerW/2) * cos(a);
      nextY = centerY + (containerH/2) * sin(a);
      topRight[offset] = new float[] {nextX, nextY};
      offset++;
    }

    // Bottom Left Arc
    offset = 0;
    for(float a=PI; a >= HALF_PI - variance; a+=-variance) {
      nextX = centerX + (containerW/2) * cos(a);
      nextY = centerY + (containerH/2) * sin(a);
      bottomLeft[offset] = new float[] {nextX, nextY};
      offset++;
    }

    // Bottom Right Arc
    offset = 0;
    for(float a=HALF_PI-QUARTER_PI*2; a <= HALF_PI + variance; a+=variance) {
      nextX = centerX + (containerW/2) * cos(a);
      nextY = centerY + (containerH/2) * sin(a);
      bottomRight[offset] = new float[] {nextX, nextY};
      offset++;
    }

    // find the actual number of point from top to middle
    for(int i=0; i < topLeft.length; i++ ) {
      if (topLeft[i] != null && topRight[i] != null) {
      topCount++;
      }
    }

    // find the actual number of point from middle to bottom
    for(int i=0; i < bottomLeft.length; i++ ) {
      if (bottomLeft[i] != null && bottomRight[i] != null) {
      bottomCount++;
      }
    }

    // From the top to the middle draw rectangles with color transition
    for(int i=0; i < topCount; i++ ) {
      lPerc = 0.5f * (((float)i/(float)topCount));
      topToMddleC = lerpColor(c1, c2, lPerc);
      fill(topToMddleC);
      if (topLeft[i] != null && topRight[i] != null) {
        beginShape();
        vertex(topLeft[i][0], topLeft[i][1]);
        vertex(topRight[i][0], topRight[i][1]);
        vertex(topRight[i][0]+stepHeight, topRight[i][1]+stepHeight);
        vertex(topLeft[i][0]+stepHeight, topLeft[i][1]+stepHeight);
        endShape();
      }
    }

    // From the top to the middle draw rectangles with color transition
    for(int i=0; i < bottomCount; i++) {
      lPerc = (1 * (((float)i/(float)bottomCount)));
      middleToBottomC = lerpColor(topToMddleC, c2, lPerc);
      fill(middleToBottomC);
      if (bottomLeft[i] != null && bottomRight[i] != null) {
        beginShape();
        vertex(bottomLeft[i][0], bottomLeft[i][1]);
        vertex(bottomRight[i][0], bottomRight[i][1]);
        vertex(bottomRight[i][0]+stepHeight, bottomRight[i][1]+stepHeight);
        vertex(bottomLeft[i][0]+stepHeight, bottomLeft[i][1]+stepHeight);
        endShape();
      }
    }
  }

}
  public void settings() {  size(1000, 1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210617a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
