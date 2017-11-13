var socket;
var isDrawer;
var word;

function setup(){
  //socket = io();
  //connect to server (change if ip changes)
  socket = io.connect('http://169.232.241.112:3000');
  createCanvas(720,540);
  background(51);

  //runs newDrawing when receives mouse broadcast
  socket.on('mouse', newDrawing);
  socket.on('sendWord', setWord);

  //Game variables
  isDrawer = true;
  word = "";
}

function setWord(data){
  word = data.wordSend;
  isDrawer = true;
}

var timeout = undefined;
function mousePressed(){
  //prevents double click on mobile applications
  if (timeout !== undefined) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(function() {
    timeout = undefined;
    callNewRound();
  }, 500);
}

function callNewRound(){
    isDrawer = false;
    var data = {
    restart: true
  };

  console.trace();
  // Send that object to the socket
  socket.emit('newRound',data);
}

function newDrawing(data){
  noStroke();
  fill(255);
  ellipse(data.x,data.y,20,20);
}

function draw(){
  if(isDrawer){
    textSize(32);
    fill(255);
    text(word,width/2,50);
  }
}

      function checkWord() {
        var word = document.getElementById("answer").value;
        if(word === 'test'){
          document.getElementById("response").innerHTML = 'correct';
          clear();
          background(51);
        }
        else{
          document.getElementById("response").innerHTML = 'Try Again';
        }
      }

function mouseDragged(){
  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);

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