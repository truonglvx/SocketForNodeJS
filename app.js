// Copyright 2015-2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var url = require('url');

app.get('/', function (req, res) {
  res.status(200).send('Hello, world!');
  console.log('send : hello, world');
});

app.get('/rooms', function(req, res) {
	res.status(200).send('Rooms');
});

app.get('/socket.html', function(req, res){
	var path = url.parse(req.url).pathname;
	fs.readFile(__dirname + path, function(error, data){
		if(error)
		{
			console.log('error : ' + error);
		}
		else
		{
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(data, "utf8");
			res.end();
		}
	});
});

// Start the server
server.listen(process.env.PORT || '55792', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});


var onConnection = function(socket)
{
	console.log('connected: ' + socket.id);
	setInterval(function(){
		socket.emit('date', {"date" : new Date()});
	}, 1000);

	// socket.on('client_data', function(data){
	// 	socket.emit('sync_data', {'sync_data' : 'data form server: ' + data.msg});
	// });
	
	socket.on('disconnect', function(){
			onDisconnect(socket);
	});
	
};

var onDisconnect = function(socket)
{
	console.log('Disconnect: ' + socket.id);
}

io.sockets.on('connection', onConnection);



// [END app]
