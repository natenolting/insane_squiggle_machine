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
