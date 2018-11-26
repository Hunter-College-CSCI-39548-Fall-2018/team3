module.exports = (app, io, rooms) => {

  app.get('/lobby', (req, res) => {
    console.log("lobby post was called")
    var connected = false

    onPlayerFirstConnect = (socket) => {
      let room = req.cookies.room
      let player = rooms[req.cookies.room].players[req.cookies.player]
      let name = req.cookies.player

      // tell everyone that player has joined, get current users in lobby
      socket.emit('get-curr-users', rooms[room].players)

      // Add new player to the Room Object
      rooms[room].addPlayer(name, {name: name, socketid: socket.id})

      // player.socketid = socket.id
      socket.join(room)

      // Notify that a new user has joined
      socket.to(room).emit('new-player', name)
    }

    onGameOwnerFirstConnect = (socket) => {
      rooms[req.cookies.room].setGameOwner(socket.id)

      //just so game owner is in the room and can see what's going on
      socket.join(req.cookies.room)
    }
    onPlayerDisconnect = (socket) =>{
      let room = rooms[req.cookies.room]
      room.removePlayer(socket.id)
      //update lobby page for everyone still connected
      socket.to(req.cookies.room).emit('player-disconnected', room.players)
    }

    onGameOwnerDisconnect = (socket) => {
      //disconnect and redirect everyone in room 
      socket.to(req.cookies.room).emit('force-disconnect')

      delete rooms[req.cookies.room]
      console.log('state of room after disc', rooms)
    }

    io.sockets.on('connection', (socket) => {
      socket.on('disconnect', () => {
        //when room doesn't exist anymore (after game owner disconnects),
        //ignore if is game owner or not, just disconnect
        if(rooms[req.cookies.room]){
          if(rooms[req.cookies.room].game_owner === socket.id){
            onGameOwnerDisconnect(socket)
            console.log("GAME OWNER DISCONNECTS:")
          }
          else{
            //if room still exists and player disconnects
            onPlayerDisconnect(socket)
            console.log("PLAYER DISCONNECTS:")
          }
        }
      })

      socket.on('shuffle-teams', () => {
          var currentRoom = rooms[req.cookies.room]
          currentRoom.shuffleTeams()
          var newTeams = currentRoom.returnTeams();

          //console.log("I am in shuffleTeams socket")
          //console.log(newTeams)
          socket.broadcast.emit("shuffled-teams", {team: currentRoom.teams})
          console.log(currentRoom)
      })

      if(req.cookies.game_owner === '0'){
        //make sure to emit user has joined only once
        if(!connected){
          onPlayerFirstConnect(socket)
          connected = true
        }
      }    
      else if(req.cookies.game_owner === '1'){
        // Only the game owner can start the timer
        socket.on('start-time', (data) => {
          // Get the room object by the cod e name
          let currentRoom = rooms[req.cookies.room]
          
          // Start the timer for that specific room
          currentRoom.startTimer(socket);
          
          //console.log(data)
        });

        //socket.join(req.cookies.room)
        socket.on('kick', (who) => {
          console.log("before", rooms[req.cookies.room].players)
          socket.emit("redirect-user",rooms[req.cookies.room].players[who]['socketid'])
          socket.broadcast.emit("redirect-user",rooms[req.cookies.room].players[who]['socketid'])
          delete rooms[req.cookies.room].players[who]
          console.log("after", rooms[req.cookies.room].players)

          socket.emit('updatePlayers',rooms[req.cookies.room].players)
          socket.broadcast.emit('updatePlayers',rooms[req.cookies.room].players)
        })

        if(!connected){
          onGameOwnerFirstConnect(socket)
          connected = true
        }
      }
    })
    res.sendStatus(200)
  })
}