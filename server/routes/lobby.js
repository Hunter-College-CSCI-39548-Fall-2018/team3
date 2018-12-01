const Player = require('./utils/player.js')

module.exports = (app, io, rooms) => {
    app.get('/lobby', (req, res) => {
        console.log("lobby post was called")
        var connected = false

        onPlayerFirstConnect = (socket) => {
            let room = req.cookies.room
            let name = req.cookies.player

            // tell everyone that player has joined, get current users in lobby
            socket.emit('get-curr-users', rooms[room].players)

            let player = new Player(name, socket.id)
            rooms[room].addPlayer(name, player)
            socket.join(room)

            // Notify that a new user has joined
            socket.to(room).emit('new-player', name)
        }

        clearCookies = () => {
            res.clearCookie("player")
            res.clearCookie("room")
            res.clearCookie("game_owner")
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

            clearCookies()
        }

        onGameOwnerDisconnect = (socket) => {
            //disconnect and redirect everyone in room
            socket.to(req.cookies.room).emit('force-disconnect')

            delete rooms[req.cookies.room]
            console.log('state of room after disc', rooms)

            clearCookies()
        }

        io.sockets.on('connection', (socket) => {
            console.log(socket.id);
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
                let currentRoom = rooms[req.cookies.room]
                
                // Start the timer for that specific room
                currentRoom.startTimer(socket);
            })

            socket.on('disconnect', () => {
                //when room doesn't exist anymore (after game owner disconnects),
                //ignore if is game owner or not, just disconnect
                // if(rooms[req.cookies.room]){
                //     if(rooms[req.cookies.room].game_owner === socket.id){
                //         onGameOwnerDisconnect(socket)
                //     }
                //     else{
                //         //if room still exists and player disconnects
                //         onPlayerDisconnect(socket)
                //     }
                // }
            })

            socket.on('shuffle-teams', () => {
                var room = rooms[req.cookies.room]
                room.shuffleTeams()

                socket.broadcast.emit("shuffled-teams", room.teams)
                console.log(room)
            })

            socket.on('kick', (who) => {
                //redirect user back to home, delete user from room object
                socket.to(rooms[req.cookies.room].players[who].socketid).emit('force-disconnect')
                delete rooms[req.cookies.room].players[who]

                socket.emit('get-curr-users',rooms[req.cookies.room].players)
                socket.broadcast.emit('get-curr-users',rooms[req.cookies.room].players)
            })
        })
        res.sendStatus(200)
  })
}