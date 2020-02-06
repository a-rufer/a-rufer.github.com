class Circle {

  private float speedX = 10;
  private float speedY = 10;
  private float r = 0;
  private float g = 0;
  private float b = 0;
  private int xpos;
  private int ypos;
  private int size = 80;
  private int rangeX;
  private int rangeY;
  
  Circle (int x, int y, int rangeX, int rangeY) {
    xpos = x;
    ypos = y;
    this.rangeX = rangeX;
    this.rangeY = rangeY;
    speedX = random(-5, 5);
    speedY = random(-5, 5);
    r = random(0, 255);
    g = random(0, 255);
    b = random(0, 255);
  }
  
   void update() {
     xpos += speedX;
     ypos += speedY;
     if (xpos <= 0 || xpos >= rangeX) {
       speedX = -speedX;
     }
     if (ypos <= 0 || ypos >= rangeY) {
       speedY = -speedY;
     }
     drawSelf();
   }
   
   void incrSize(int x){
    size += x; 
   }
   
   void drawSelf() {
     fill(r, g, b);
     noStroke();
     ellipse(xpos, ypos, size, size);
   }
   
   void collide(float x, float y) {
     speedX += x;
     speedY += y;
   }
   
   int getX() {
     return xpos;
   }
   int getY() {
     return ypos;
   }
   int getSize() {
     return size;
   }
  
  
  
}
