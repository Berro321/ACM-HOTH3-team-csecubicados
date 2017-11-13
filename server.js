//use express library
var express = require('express');

//creating server
var app = express();
var server = app.listen(process.env.PORT || 8080,listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}


app.use(express.static('public'));

console.log("running bois");

//Require socket.io library
var socket = require('socket.io');

//takes care of input/output in library
var io = socket(server);

//runs newConnection when a connection occurs
io.sockets.on('connection',newConnection);

function newConnection(socket){
	console.log("new connection:" + socket.id);

	//if there is a message that the client receives called 'mouse'
	//execute mouseMsg
	socket.on('mouse',mouseMsg);

	function mouseMsg(data){
		console.log(data);
		//All other clients receive the same data
		socket.broadcast.emit('mouse',data);
		//io.sockets.emit('mouse',data); Sends to everyone, including self
	}
}