//requiring Express
var express = require('express');

//creating a new server
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server);

//setting the static folder to node_modules
app.use(express.static(__dirname + '/node_modules'));

//routes http requests to the speicified path 
//with a specific call back function
//The 'res' object represents the HTTP response 
//that an Express app sends when it gets a request. 
app.get('/', function(req, res, next) {
	//sends the file at the specific path
	res.sendFile(__dirname + '/index.html')
});

//io.on is listening for connections
io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data) {
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });

});

//opens a port and listen for requests coming in
server.listen(4200);

