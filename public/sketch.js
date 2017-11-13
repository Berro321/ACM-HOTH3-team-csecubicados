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
  socket.on('wordIs',isWordRight);
  socket.on('clear',clearCanvas);

  //Game variables
  isDrawer = false;
  word = "";
}

function clearCanvas(){
  clear();
  background(51);
}
function setWord(data){
  word = data.wordSend;
  isDrawer = true;

}

var timeout = undefined;

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
    fill(0);
    text(word,width/2,50);
    document.getElementById("response").innerHTML = 'Your word is: ' + word;
  }
}

      function checkWord() {
        if(isDrawer){return;}
        var word2 = document.getElementById("answer").value;
        console.log("sending: " + word2);
        socket.emit('wordCheck',word2);
      }
function clearRound(){
  if (timeout !== undefined) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(function() {
    timeout = undefined;
    callNewRound();
  }, 500);
}

function isWordRight(data){
        if(data == true){
          document.getElementById("response").innerHTML = 'correct';
          //clear();
          //background(51);
            if (timeout !== undefined) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(function() {
    timeout = undefined;
    callNewRound();
  }, 500);
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