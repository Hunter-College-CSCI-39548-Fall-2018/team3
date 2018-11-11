const express = require('express'), app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const corsOptions = {
    //Access-Control-Allow-Credentials
    credentials: true,
    //Access-Control-Allow-Origin
    //true just specifies request origin
    origin: true
}

app.use(cors(corsOptions))
app.use(cookieParser())

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)
const io = require('socket.io').listen(server)

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var rooms = {}
const Room = require('./routes/utils/rooms')

//--------------------------------------------------------
//Temporary creation of a random room with players inside
let room = new Room()
room.createTeams()
room.key = "room"
rooms["room"] = room
//--------------------------------------------------------


// This line is required to serve the React files in Express
app.use(express.static(path.join(__dirname, '..', 'dist')));
<<<<<<< HEAD
require('./routes/game')(app, io, rooms, room)
=======
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
require('./routes/game')(app, io, rooms)
>>>>>>> ab097aff910b59256e9863f31c3f841cc98a316b
require('./routes/create-game')(app, rooms)
require('./routes/join-game')(app, rooms)
require('./routes/lobby')(app, io, rooms)


console.log('Listening on port ' + PORT);
module.exports = io
