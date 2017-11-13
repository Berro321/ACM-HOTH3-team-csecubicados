//use express library
var express = require('express');

//creating server
var app = express();
var server = app.listen(process.env.PORT || 3000,listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://' + host + ':' + port);
}


app.use(express.static('public'));

console.log("running bois");

//Require socket.io library
var socket = require('socket.io');

//takes care of input/output in library
var io = socket(server);

var noun_s = ["light bulb", "zebra","dog","clowns","table","cable","glasses","mouse"];

var word = getRandomWord(noun_s);

var clients = [];//contains id and position in array

//runs newConnection when a connection occurs
io.sockets.on('connection',newConnection);

function newConnection(socket){
	console.log("new connection:" + socket.id);
	//push a connection clients connected
	clients.push(socket.id);

	//if there is a message that the client receives called 'mouse'
	//execute mouseMsg
	socket.on('mouse',mouseMsg);
	socket.on('newRound', startNewRound);
	socket.on('wordCheck', wordCheck);
	socket.on('clearBoard', clearBoard);

	function clearBoard(data){
		io.emit('clear');
	}

	function wordCheck(data){
		console.log(data);
		var isRight = (data==word);
		console.log(isRight);
		socket.emit('wordIs',isRight);
	}

	function startNewRound(data){
		//io.emit('restart',null);
		word = getRandomWord(noun_s);
		//number between 0 and last element of clients
		var randNum = Math.floor(Math.random() * clients.length);
		console.log("Sending word to: " + clients[randNum]);
		if(clients[randNum] == socket.id)
			socket.emit('sendWord',word);
		else
			socket.broadcast.to(clients[randNum]).emit('sendWord',word);
		console.log("New word set to:" + word);
		//restart client normall for everyone else
		for(var c = 0; c < clients.length;c++)
			if(c != randNum)
				socket.broadcast.to(clients[c]).emit('restart',null);
	}



	function mouseMsg(data){
		//console.log(data);
		//All other clients receive the same data
		socket.broadcast.emit('mouse',data);
		//io.sockets.emit('mouse',data); Sends to everyone, including self
	}

	socket.on('disconnect',function(){
		console.log('User:'+ socket.id +' has disconnected.');
		var num = clients.indexOf(socket.id);
		if(num > -1)
			clients.splice(num,1);

		console.log(clients);
	});
}

function getRandomWord(nouns){

 	 var randNoun = Math.floor(Math.random() * nouns.length);
 	 var randWord = nouns[randNoun]; 
 	 //console.log(randWord);
  return randWord;
}