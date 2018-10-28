const express = require('express'), app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path');
// Used to load the port in the .env file included
// require('dotenv').load();
console.log("file being server yes")
app.use(cors())
app.use(cookieParser())

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)
const io = require('socket.io').listen(server)

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client connected')

  socket.on('test', () => {
    console.log('test emit made')
  })

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.use(express.static(path.join(__dirname, '..', 'dist')));
const routes = require('./routes')
app.use('/', routes);

app.set('views', __dirname + '../src/views')
var rooms = {}

require('./routes/create-game')(app, rooms)
require('./routes/join-game')(app, rooms)
require('./routes/lobby')(app, io, rooms)
require('./routes/game')(app, io, rooms)

console.log('Listening on port ' + PORT);
module.exports = io
