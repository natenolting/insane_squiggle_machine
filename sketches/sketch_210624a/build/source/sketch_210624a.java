import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210624a extends PApplet {

// PARAMETERS
float _maxForce = 0.5f; // Maximum steering force
float _maxSpeed = 2; // Maximum speed
float _desiredSeparation = 20;
float _separationCohesionRation = 1.1f;
float _maxEdgeLen = 5;

DifferentialLine _diff_line;

public void setup() {
  

  _diff_line = new DifferentialLine(_maxForce, _maxSpeed, _desiredSeparation, _separationCohesionRation, _maxEdgeLen);

  float nodesStart = 20;
  float angInc = TWO_PI/nodesStart;
  float rayStart = 10;

  for (float a=0; a<TWO_PI; a+=angInc) {
    float x = width/2 + cos(a) * rayStart;
    float y = height/2 + sin(a) * rayStart;
    _diff_line.addNode(new Node(x, y, _diff_line.maxForce, _diff_line.maxSpeed));
  }
}

public void draw() {
  background(0, 5, 10);

  stroke(255, 250, 220);

  _diff_line.run();
  _diff_line.renderLine();

}

class DifferentialLine {
  ArrayList<Node> nodes;
  float maxForce;
  float maxSpeed;
  float desiredSeparation;
  float sq_desiredSeparation;
  float separationCohesionRation;
  float maxEdgeLen;

  DifferentialLine(float mF, float mS, float dS, float sCr, float eL) {
    nodes = new ArrayList<Node>();
    maxSpeed = mF;
    maxForce = mS;
    desiredSeparation = dS;
    sq_desiredSeparation = sq(desiredSeparation);
    separationCohesionRation = sCr;
    maxEdgeLen = eL;
  }

  public void addNode(Node n) {
    nodes.add(n);
  }

  public void addNodeAt(Node n, int index) {
    nodes.add(index, n);
  }

  public void run() {
    differentiate();
    growth();
  }

  public void growth() {
    for (int i=0; i<nodes.size()-1; i++) {
      Node n1 = nodes.get(i);
      Node n2 = nodes.get(i+1);
      float d = PVector.dist(n1.position, n2.position);
      if (d>maxEdgeLen) { // Can add more rules for inserting nodes
        int index = nodes.indexOf(n2);
        PVector middleNode = PVector.add(n1.position, n2.position).div(2);
        addNodeAt(new Node(middleNode.x, middleNode.y, maxForce, maxSpeed), index);
      }
    }
  }

  public void differentiate() {
    PVector[] separationForces = getSeparationForces();
    PVector[] cohesionForces = getEdgeCohesionForces();

    for (int i=0; i<nodes.size(); i++) {
      PVector separation = separationForces[i];
      PVector cohesion = cohesionForces[i];

      separation.mult(separationCohesionRation);

      nodes.get(i).applyForce(separation);
      nodes.get(i).applyForce(cohesion);
      nodes.get(i).update();
    }
  }

  public PVector[] getSeparationForces() {
    int n = nodes.size();
    PVector[] separateForces=new PVector[n];
    int[] nearNodes = new int[n];

    Node nodei;
    Node nodej;

    for (int i=0; i<n; i++) {
      separateForces[i]=new PVector();
    }

    for (int i=0; i<n; i++) {
      nodei=nodes.get(i);
      for (int j=i+1; j<n; j++) {
        nodej=nodes.get(j);
        PVector forceij = getSeparationForce(nodei, nodej);
        if (forceij.mag()>0) {
          separateForces[i].add(forceij);
          separateForces[j].sub(forceij);
          nearNodes[i]++;
          nearNodes[j]++;
        }
      }

      if (nearNodes[i]>0) {
        separateForces[i].div((float)nearNodes[i]);
      }
      if (separateForces[i].mag() >0) {
        separateForces[i].setMag(maxSpeed);
        separateForces[i].sub(nodes.get(i).velocity);
        separateForces[i].limit(maxForce);
      }
    }

    return separateForces;
  }

  public PVector getSeparationForce(Node n1, Node n2) {
    PVector steer = new PVector(0, 0);
    float sq_d = sq(n2.position.x-n1.position.x)+sq(n2.position.y-n1.position.y);
    if (sq_d>0 && sq_d<sq_desiredSeparation) {
      PVector diff = PVector.sub(n1.position, n2.position);
      diff.normalize();
      diff.div(sqrt(sq_d)); //Weight by distacne
      steer.add(diff);
    }
    return steer;
  }

  public PVector[] getEdgeCohesionForces() {
    int n = nodes.size();
    PVector[] cohesionForces=new PVector[n];

    for (int i=0; i<nodes.size(); i++) {
      PVector sum = new PVector(0, 0);
      if (i!=0 && i!=nodes.size()-1) {
        sum.add(nodes.get(i-1).position).add(nodes.get(i+1).position);
      } else if (i == 0) {
        sum.add(nodes.get(nodes.size()-1).position).add(nodes.get(i+1).position);
      } else if (i == nodes.size()-1) {
        sum.add(nodes.get(i-1).position).add(nodes.get(0).position);
      }
      sum.div(2);
      cohesionForces[i] = nodes.get(i).seek(sum);
    }

    return cohesionForces;
  }

  public void renderShape() {
    beginShape();
    for (int i=0; i<nodes.size(); i++) {
      vertex(nodes.get(i).position.x, nodes.get(i).position.y);
    }
    endShape(CLOSE);
  }

  public void renderLine() {
    for (int i=0; i<nodes.size()-1; i++) {
      PVector p1 = nodes.get(i).position;
      PVector p2 = nodes.get(i+1).position;
      line(p1.x, p1.y, p2.x, p2.y);
      if (i==nodes.size()-2) {
        line(p2.x, p2.y, nodes.get(0).position.x, nodes.get(0).position.y);
      }
    }
  }
}


class Node {
  PVector position;
  PVector velocity;
  PVector acceleration;

  float maxForce;
  float maxSpeed;

  Node(float x, float y, float mF, float mS) {
    acceleration = new PVector(0, 0);
    velocity =PVector.random2D();
    position = new PVector(x, y);
    maxSpeed = mF;
    maxForce = mS;
  }

  public void applyForce(PVector force) {
    acceleration.add(force);
  }

  public void update() {
    velocity.add(acceleration);
    velocity.limit(maxSpeed);
    position.add(velocity);
    acceleration.mult(0);
  }

  public PVector seek(PVector target) {
    PVector desired = PVector.sub(target, position);
    desired.setMag(maxSpeed);
    PVector steer = PVector.sub(desired, velocity);
    steer.limit(maxForce);
    return steer;
  }
}
  public void settings() {  size(1280, 720, FX2D ); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210624a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
