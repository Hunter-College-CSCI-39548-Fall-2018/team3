const express = require('express'), app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const { exec } = require('child_process');

const corsOptions = {
    //Access-Control-Allow-Credentials
    credentials: true,
    origin: '*',
    //Access-Control-Allow-Origin
    //true just specifies request origin 
    origin: true
}

app.use(cors(corsOptions))
app.use(cookieParser())

const PORT = process.env.PORT || 3000
// The reason why I set as 0.0.0.0 is so that
// Express can be accessed remotely 
const server = app.listen(PORT, '0.0.0.0') 
const io = require('socket.io').listen(server)

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


var rooms = {}
const Room = require('./routes/utils/rooms')

//--------------------------------------------------------
//Temporary creation of a random room with players inside
// let room = new Room()
// room.createTeams()
// room.key = "test"
// rooms["test"] = room
//--------------------------------------------------------


// This line is required to serve the React files in Express
app.use(express.static(path.join(__dirname, '..', 'dist')));

require('./routes/create-game')(app, rooms)
require('./routes/join-game')(app, rooms)
require('./routes/lobby')(app, io, rooms)
require('./routes/game')(app, io, rooms)


// Necessary as a catch-all to assist with React-routing
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'dist/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
console.log('Listening on port ' + PORT);

// Testing fix for nodemon
process.on('SIGUSR2', () => { process.exit(0); });
module.exports = io
