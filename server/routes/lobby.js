module.exports = (app, io, rooms) => {
    app.get('/lobby', (req, res) => {
        console.log("lobby post was called")
        var connected = false
        var room = rooms[req.cookies.room]

<<<<<<< HEAD
  app.get('/lobby', (req, res) => {
    console.log("lobby post was called")
    var connected = false

    onPlayerFirstConnect = (socket) => {
      let room = req.cookies.room
      let player = rooms[req.cookies.room].players[req.cookies.player]
      let name = req.cookies.player

      

      // Add new player to the Room Object
      rooms[room].addPlayer(name, {name: name, socketid: socket.id})


      // tell everyone that player has joined, get current users in lobby
      socket.emit('get-curr-users', rooms[room].players)

      // player.socketid = socket.id
      socket.join(room)

      // Notify that a new user has joined
      socket.to(room).emit('new-player', rooms[room].players)
    }

    onGameOwnerFirstConnect = (socket) => {
      rooms[req.cookies.room].setGameOwner(socket.id)

      //just so game owner is in the room and can see what's going on
      socket.join(req.cookies.room)
    }
    onPlayerDisconnect = (socket) =>{
      let room = rooms[req.cookies.room]
      room.removePlayer(socket.id)
      //update lobby page for everyone still connected; I dont think this works
      socket.to(req.cookies.room).emit('player-disconnected', room.players)
    }

    onGameOwnerDisconnect = (socket) => {
      //disconnect and redirect everyone in room; I dont think this works
      socket.to(req.cookies.room).emit('force-disconnect')

      for (player in rooms[req.cookies.room].players){
        socket.emit("redirect-user",rooms[req.cookies.room].players[player]['socketid'])
        socket.broadcast.emit("redirect-user",rooms[req.cookies.room].players[player]['socketid'])
      }

      delete rooms[req.cookies.room]
      console.log('state of room after disc', rooms)
    }

    io.sockets.on('connection', (socket) => {

      if(req.cookies.game_owner === '0'){
        //make sure to emit user has joined only once
        if(!connected){
          onPlayerFirstConnect(socket)
          connected = true
=======
        clearCookies = (socket) => {
            socket.emit('clearCookie')
>>>>>>> 669c4990cebde0f35138f0574dfbc2381888d54c
        }

        onPlayerFirstConnect = (socket) => {
            let name = req.cookies.player

            //get current users in lobby
            socket.emit('get-curr-users', room.players)

            // let player = new Player(name, socket.id)
            // room.addPlayer(name, player)
            room.setSocketId(name, socket.id)
            socket.join(room.key)

            console.log("player in room", room.players[name]);


            // Notify that a new user has joined
            socket.to(room.key).emit('new-player', name)
        }
        onPlayerDisconnect = (socket) =>{
            room.removePlayer(socket.id)

            //update lobby page for everyone still connected
            socket.to(room.key).emit('player-disconnected', room.players)

            clearCookies(socket)
        }

        onGameOwnerFirstConnect = (socket) => {
            room.setGameOwner(socket.id)
            socket.join(room.key)
        }
<<<<<<< HEAD
      })

      socket.on('shuffle-teams', () => {
          var currentRoom = rooms[req.cookies.room]
          currentRoom.shuffleTeams()
          var newTeams = currentRoom.returnTeams();

          //console.log("I am in shuffleTeams socket")
          //console.log(newTeams)

          // Emitting only to other players and not game owner
          // socket.to(req.cookies.room).emit("shuffled-teams", {team: currentRoom.teams})
          
          // Emitting only to other players and not game owner
          // socket.to(req.cookies.room).broadcast.emit("shuffled-teams", {team: currentRoom.teams})
          
          io.in(req.cookies.room).emit("shuffled-teams", {team: currentRoom.teams})
          console.log("shuffled teams currentRoom", currentRoom)
      })      
    })
    res.sendStatus(200)
=======
        onGameOwnerDisconnect = (socket) => {
            //disconnect and redirect everyone in room
            socket.to(room.key).emit('force-disconnect')
            
            delete room
            console.log('state of room after disc', rooms)

            clearCookies()
        }

        io.sockets.on('connection', (socket) => {
            if(req.cookies.game_owner === '0'){
                //make sure to emit user has joined only once
                if(!connected){
                    onPlayerFirstConnect(socket)
                    connected = true
                }
            }    

            else if(req.cookies.game_owner === '1'){
                if(!connected){
                    onGameOwnerFirstConnect(socket)
                    connected = true
                }
            }

            socket.on('start-time', () => {                
                // Start the timer for that specific room
                room.startTimer(socket);
            })

            socket.on('disconnect', () => {
                console.log("disconnect time", room.time);

                //if the countdown timer hasnt gone down yet all the way and someone disconnects,
                //do everything as originally intended
                if(room.time > 1){
                    console.log("this shouldnt hapen");
                    //when room doesn't exist anymore (after game owner disconnects),
                    //ignore if is game owner or not, just disconnect
                    if(room){
                        if(rooms[req.cookies.room].game_owner === socket.id){
                            onGameOwnerDisconnect(socket)
                        }
                        else{
                            //if room still exists and player disconnects
                            onPlayerDisconnect(socket)
                        }
                    }
                }
            })

            socket.on('shuffle-teams', () => {
                room.shuffleTeams()

                socket.to(room.key).emit("shuffled-teams", room.teams)
                socket.emit("shuffled-teams", room.teams)
                console.log(room)
            })

            socket.on('kick', (who) => {
                //redirect user back to home, delete user from room object
                socket.to(room.players[who].socketid).emit('force-disconnect')
                delete room.players[who]

                socket.emit('get-curr-users', room.players)
                socket.to(room.key).emit('get-curr-users', room.players)
            })
        })
        res.sendStatus(200)
>>>>>>> 669c4990cebde0f35138f0574dfbc2381888d54c
  })
}