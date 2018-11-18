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

            player.socketid = socket.id
            socket.join(room)

            socket.to(room).emit('new-player', name)
        }

        onPlayerDisconnect = (socket) =>{
            let room = rooms[req.cookies.room]
            room.removePlayer(socket.id)

            //update lobby page for everyone still connected
            socket.to(req.cookies.room).emit('player-disconnected', room.players)
        }

        onGameOwnerDisconnect = (socket) => {
            console.log("rooms before discoincnncet", rooms);

            //disconnect and redirect everyone in room 
            socket.to(req.cookies.room).emit('force-disconnect')

            //remove room object
            delete rooms[req.cookies.room]
            console.log("state of rooms after everyon edisocnenc", rooms);
        }

        io.sockets.on('connection', (socket) => {
            console.log("is room in cookie", req.cookies)

            socket.on('disconnect', () => {
                if(rooms[req.cookies.room].game_owner === socket.id){
                    onGameOwnerDisconnect(socket)
                }else{
                    onPlayerDisconnect(socket)
                }
            })

            if(req.cookies.game_owner === '0'){
                //make sure to emit user has joined only once
                if(!connected){
                    onPlayerFirstConnect(socket)
                    connected = true
                }
            }
            else if(req.cookies.game_owner === '1'){
                if(!connected){
                    rooms[req.cookies.room].setGameOwner(socket.id)

                    //just so game owner is in the room and can see what's going on
                    socket.join(req.cookies.room)

                    connected = true
                }

            }
        })

        res.sendStatus(200)
    })
}
