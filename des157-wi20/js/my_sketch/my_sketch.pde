
int X_SIZE = 800;
int Y_SIZE = 250;

int counter = 0;
Circle[] circles = new Circle[20];


void setup() {
  size(800, 250);
  background(#000000);
  
  initializeCircles();
}

void draw() {
  background(#000000);
  
    
  for (int i = 0; i < counter; i++) {
    
    if (mouseX <= circles[i].getX() + circles[i].getSize() 
      && mouseX >= circles[i].getX()
      && mouseY <= circles[i].getY() 
      && mouseY >= circles[i].getY() - circles[i].getSize()) {
        circles[i].collide(getMouseXSpeed(), getMouseYSpeed());
    }
    
    circles[i].update();
  }
    
}

void initializeCircles() {
  for (int i = 0; i < 3; i++) {
    Circle cNew = new Circle(400, 100, X_SIZE, Y_SIZE);
    circles[i] = cNew;
    counter++;
  }
}

void addCircle() {
  Circle cNew = new Circle(mouseX, mouseY, X_SIZE, Y_SIZE);
  circles[counter] = cNew;
  counter++;
}

float getMouseXSpeed() {
  return (mouseX - pmouseX) / 7 ;
}
float getMouseYSpeed() {
  return (mouseY - pmouseY) / 7;
}

void mouseClicked() {
  addCircle();
}
