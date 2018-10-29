module.exports = (app, io, rooms) => {
    var curr_users = []
    app.get('/lobby', (req, res) => {
        console.log("lobby post was called")

        io.sockets.on('connect', (socket) => {
            //cookie exists, room doesnt
            console.log("room in lobby:", rooms)
            console.log("is room in cookie", req.cookies.room)
            
            // var player = rooms[req.cookies.room].players[req.cookies.player]

            // var name = req.cookies.player
            // var room = req.cookies.room

            // //make sure to emit user has joined only once
            // if(!player.connected){
            //     socket.emit('get-curr-users', curr_users)

            //     //save state of users isn lobby
            //     player.socketid = socket.id
            //     player.connected = true

            //     curr_users.push(name)

            //     //join when get to lobby
            //     //rooms are forgotten after reroute
            //     socket.join(room)
            //     console.log('joined the room:', room)
            //     socket.to(room).emit('new-player', name)
            // }
        })

        // var player = req.cookies.player
        // var code = req.cookies.code;
        // console.log("this is the room code " + res.cookie.code);

        // res.render('lobby', {/*code:req.cookies.code, */player: req.cookies.player})
    })
}
