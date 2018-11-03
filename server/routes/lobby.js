module.exports = (app, io, rooms) => {
    var curr_users = []
    app.get('/lobby', (req, res) => {
        console.log("lobby post was called")

        io.sockets.on('connection', (socket) => {
            console.log("is room in cookie", req.cookies)
            var player = rooms[req.cookies.room].players[req.cookies.player]

            var name = req.cookies.player
            var room = req.cookies.room

            console.log("if player connected", player.connected)
            //make sure to emit user has joined only once
            if(!player.connected){
                curr_users.push(name)
                socket.emit('get-curr-users', curr_users)

                //save state of users in lobby
                player.socketid = socket.id
                player.connected = true


                //join when get to lobby
                //rooms are forgotten after reroute
                socket.join(room)
                console.log('joined the room:', room)
                socket.to(room).emit('new-player', name)
            }

            // res.send(200)
        })

        // var player = req.cookies.player
        // var code = req.cookies.code;
        // console.log("this is the room code " + res.cookie.code);

        // res.render('lobby', {/*code:req.cookies.code, */player: req.cookies.player})
    })
}
