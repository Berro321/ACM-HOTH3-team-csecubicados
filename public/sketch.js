var socket;

function setup(){
  socket = io();
  //connect to server (change if ip changes)
  socket = io.connect('http://169.232.241.112:8080');
  createCanvas(500,500);
  background(51);

  //runs newDrawing when receives mouse broadcast
  socket.on('mouse', newDrawing);
}

function newDrawing(data){
  noStroke();
  fill(255);
  ellipse(data.x,data.y,20,20);
}

function draw(){

}

function mouseDragged() {
  // Draw some white circles
  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  // Send the mouse coordinates
  sendmouse(mouseX,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}