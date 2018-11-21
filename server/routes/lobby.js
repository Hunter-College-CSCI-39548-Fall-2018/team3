module.exports = (app, io, rooms) => {

    function startTimer(){
        //hasn't been activated before
        if(start === false){
            start = true;   //activated for the first time
            var updated_time = setInterval( () => {
                time -=1;
                if(time === 0){
                    clearInterval(updated_time);
                }
                console.log(time);
                //console.log("updated time", updated_time);3
                // io.socket.emit('timeLeft', time);
            },
            1000);
        }
    }

    app.get('/lobby', (req, res) => {
        console.log("lobby post was called")
        var connected = false

        onPlayerFirstConnect = (socket) => {
            let room = req.cookies.room
            let player = rooms[req.cookies.room].players[req.cookies.player]
            let name = req.cookies.player

            // tell everyone that player has joined, get current users in lobby
            socket.emit('get-curr-users', rooms[room].players)

            player.socketid = socket.id
            socket.join(room)

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
                    }
                    else{
                        //if room still exists and player disconnects
                        onPlayerDisconnect(socket)
                    }
                }
            })

            socket.on('shuffle-teams', () => {
                var currentRoom = rooms[req.cookies.room]
              currentRoom.shuffleTeams()
              var newTeams = currentRoom.returnTeams();
              console.log("I am in shuffleTeams socket")
              console.log(newTeams)
              socket.emit("shuffled-teams", {team: newTeams})
            })

            if(req.cookies.game_owner === '0'){
                //make sure to emit user has joined only once
                if(!connected){
                    onPlayerFirstConnect(socket)
                    connected = true
                }
            }
            else if(req.cookies.game_owner === '1'){
                socket.on('start-time', (data) => {

                    let currentRoom = rooms[req.cookies.room]
                    currentRoom.startTimer(socket);
                    //console.log(data)

                });
                if(!connected){
                    onGameOwnerFirstConnect(socket)
                    connected = true
                }
            }
        })

        res.sendStatus(200)
    })
}
