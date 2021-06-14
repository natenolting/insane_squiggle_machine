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

public class sketch_210611a extends PApplet {




int cols = 11;
int rows = 11;
float variance = 0.3f;
int screenshotCount=1;
float gH, gW;
String screenshotSet = UUID.randomUUID().toString();

int cyan = 0xff00a5e8;
int magenta = 0xfff7107e;
int yellow = 0xffffef33;
int black = 0xff090001;
int[] colors  = {cyan, magenta, yellow, black};

public void setup() {
  
  gH = height/rows;
  gW = width/cols;
  background(0);
}

public void topRightArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=PI+HALF_PI; a <= PI+HALF_PI+HALF_PI; a+=v) {
    lastX = centerX + (containerW/2) * cos(a-v);
    lastY = centerY + (containerH/2) * sin(a-v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}

public void bottomRightArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=HALF_PI-QUARTER_PI*2; a <= HALF_PI + v; a+=v) {
    lastX = centerX + (containerW/2) * cos(a-v);
    lastY = centerY + (containerH/2) * sin(a-v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}


public void topLeftArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=PI+HALF_PI; a >= PI; a+=-v) {
    lastX = centerX + (containerW/2) * cos(a+v);
    lastY = centerY + (containerH/2) * sin(a+v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}


public void bottomLeftArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;
  for(float a=PI; a >= HALF_PI - v; a+=-v) {
    lastX = centerX + (containerW/2) * cos(a+v);
    lastY = centerY + (containerH/2) * sin(a+v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    //line(lastX, lastY, nextX, nextY);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}

public void cirularArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float variance) {
    topRightArc(centerX, centerY, containerX, containerY, gW, gH, variance);
    bottomRightArc(centerX, centerY, containerX, containerY, gW, gH, variance);
    topLeftArc(centerX, centerY, containerX, containerY, gW, gH, variance);
    bottomLeftArc(centerX, centerY, containerX, containerY, gW, gH, variance);
}


public void draw() {
  background(255);
  noLoop();
  int pick = PApplet.parseInt(random(4));
  float x, y, segments, cX, cY;
  // drawing here...
  stroke(255);
  strokeWeight(2);
  noFill();
  for(int cc=0; cc < colors.length; cc++) {
    stroke(red(colors[cc]), green(colors[cc]), blue(colors[cc]), 100);
    for(int r = 0; r < rows; r++) {
      for(int c = 0; c < cols; c++) {
        if(pick > 3) {
          pick = 0;
        }
        segments = random(noise(r, c), 10);
        for(float i=0.0f; i < 1000; i+=segments) {

          x = gW*r;
          y = gH*c;
          cX = (gW*r+gW/2);
          cY = (gH*c+gH/2);

          if (pick == 0) {
            cX-=i;
            cY+=i;

          }

          if (pick == 1) {
            cX -=i;
            cY -=i;
          }

          if (pick == 2) {
            cX +=i;
            cY -=i;
          }

          if (pick == 3) {
            cX +=i;
            cY +=i;
          }
          cirularArc(cX, cY, x, y, gW, gH, variance);

        }
        pick++;
      }
    }
}


}

public void keyPressed() {
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
    screenshotCount++;
  }
  if(keyCode == 10) {
    redraw();
  }
}
/*
 * Encode a given point (x, y) into the different regions of
 * a clip window as specified by its top-left corner (cx, cy)
 * and it's width and height (cw, ch).
 */
public int encode_endpoint(
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

public boolean line_clipped(
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
  public void settings() {  size(1000,1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210611a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
