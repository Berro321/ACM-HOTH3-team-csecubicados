var socket;
var isDrawer;
var word;
var username;

function setup(){
  //socket = io();
  //connect to server (change if ip changes)
  socket = io.connect('http://128.97.167.117:3000');
  createCanvas(720,540);
  background(51);

  //runs newDrawing when receives mouse broadcast
  socket.on('mouse', newDrawing);
  socket.on('sendWord', setWord);
  socket.on('wordIs',isWordRight);
  socket.on('restart',restart);
  socket.on('clear',clearCanvas);

  //Game variables
  isDrawer = false;
  word = "";


}

function restart(data){
  isDrawer=false;
  document.getElementById("response").innerHTML = 'Response';
  clearCanvas();
}

function clearCanvas(){
  clear();
  background(51);
}
function clearBoard(){
  if(!isDrawer){return;}
  socket.emit('clearBoard',null);
}
function setWord(data){
  clearCanvas();
  console.log(data);
  word = data;
  isDrawer = true;
  document.getElementById("response").innerHTML = 'Your word is: ' + word;

}

function callNewRound(){
    isDrawer = false;
    document.getElementById("response").innerHTML = 'Response';

  //console.trace();
  // Send that object to the socket
  socket.emit('newRound',null);
}

function newDrawing(data){
  noStroke();
  stroke(255);
  strokeWeight(10);
  console.log("Receiving: " + data.px + " " + data.py);
  line(data.x, data.y, data.px, data.py);
}

function draw(){
  //Nothing
}

function checkWord() {
  if(isDrawer){return;}
    var word2 = document.getElementById("answer").value;
    console.log("sending: " + word2);
    socket.emit('wordCheck',word2);
}

var timeout = undefined;
function clearRound(){
  //if(!isDrawer){return;}
  callNewRound();
}

function isWordRight(data){
        if(data == true){
          document.getElementById("response").innerHTML = 'Correct!';
          restart();
          callNewRound();
        }
        else{
          document.getElementById("response").innerHTML = 'Try Again';
        }
}

function mouseDragged(){
  if(!isDrawer){return;}
  stroke(255);
  strokeWeight(10);
  line(mouseX, mouseY, pmouseX, pmouseY);
  //send mouse data to server
  sendmouse(mouseX,mouseY,pmouseX,pmouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos,pxpos, pypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos
    + " " + pxpos + " " + pypos);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos,
    px: pxpos,
    py: pypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}