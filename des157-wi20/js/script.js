class Circle {

    
  
    constructor(x, y, rangeX, rangeY) {
      this.colors = [[124,165,183], [61,80,102], [138,94,163]];
      this.xpos = x;
      this.ypos = y;
      this.rangeX = rangeX;
      this.rangeY = rangeY;
      this.speedX = random(-5, 5);
      this.speedY = random(-5, 5);
      this.color = this.colors[Math.floor(Math.random() * Math.floor(3))];
      this.r = this.color[0];
      this.g = this.color[1];
      this.b = this.color[2];
      this.size = random(20, 120);
    }
     
    incrSize(x){
        this.size += x; 
     }
     
    drawSelf() {
       fill(this.r, this.g, this.b);
       noStroke();
       ellipse(this.xpos, this.ypos, this.size, this.size);
     }
     
    collide( x,  y) {
        this.speedX += x;
        this.speedY += y;
     }
     
    getX() {
       return this.xpos;
     }
    getY() {
       return this.ypos;
     }
    getSize() {
       return this.size;
     }

    update() {
        this.xpos += this.speedX;
        this.ypos += this.speedY;
        if (this.xpos <= 0 || this.xpos >= this.rangeX) {
            this.speedX = -this.speedX;
        }
        if (this.ypos <= 0 || this.ypos >= this.rangeY) {
            this.speedY = -this.speedY;
        }
        this.drawSelf();

        if (this.speedX > 10) {
            this.speedX--;
        }
        if (this.speedY > 10) {
            this.speedY--;
        }
    }
    
    
    
  }


const X_SIZE = 800;
const Y_SIZE = 250;

var counter = 0;
var circles = [];


function setup() {
  var myCanvas = createCanvas(800, 250);
  background("#000000");
  
  initializeCircles();

  myCanvas.parent(mySketch);
}

function draw() {

  background("#000000");
  
    
  for (let i = 0; i < counter; i++) {
    
    if (mouseX <= circles[i].getX() + circles[i].getSize() 
      && mouseX >= circles[i].getX()
      && mouseY <= circles[i].getY() 
      && mouseY >= circles[i].getY() - circles[i].getSize()) {
        circles[i].collide(getMouseXSpeed(), getMouseYSpeed());
    }
    
    circles[i].update();
  }
    
}

function initializeCircles() {
  for (let i = 0; i < 3; i++) {
    var cNew = new Circle(400, 100, X_SIZE, Y_SIZE);
    circles[i] = cNew;
    counter++;
  }
  console.log(circles);
}

function addCircle() {
  var cNew = new Circle(mouseX, mouseY, X_SIZE, Y_SIZE);
  circles[counter] = cNew;
  counter++;
}

function getMouseXSpeed() {
  return (mouseX - pmouseX) / 7 ;
}
function getMouseYSpeed() {
  return (mouseY - pmouseY) / 7;
}

function mouseClicked() {
  addCircle();
}

