module.exports = (app, io, rooms) => {
    var curr_users = []
    var time = 10;
    var start = false;
    var timeRemaining = 0;
    
    // function startTimer(){
    //     //hasn't been activated before
    //     if(start === false){
    //         start = true;   //activated for the first time
    //         var updated_time = setInterval( () => {
    //             time -=1;
    //             if(time === 0){
    //                 clearInterval(updated_time);
    //             }
    //             console.log(time);
    //             //console.log("updated time", updated_time);3
    //             // io.socket.emit('timeLeft', time);
    //         },
    //         1000);
    //     }
    // }

    app.get('/lobby', (req, res) => {
        console.log("lobby post was called")

        io.sockets.on('connection', (socket) => {

            console.log("is room in cookie", req.cookies);
            if(req.cookies.game_owner === '0'){
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
            }
            else if(req.cookies.game_owner === '1'){
                //just so game owner is in the room and can see what's going on
                socket.join(req.cookies.room)
                //listen for startTime button from the front end
                socket.on('startTime', () => {
                    //console.log(data)
                    if(start === false){
                        start = true;   //activated for the first time
                        var updated_time = setInterval( () => {
                            time -=1;
                            if(time === 0){
                                clearInterval(updated_time);
                            }
                            console.log(time);
                            // console.log("updated time", updated_time);3
                            socket.emit('timeLeft', time);
                            socket.broadcast.emit('timeLeft', time);
                        },
                        1000);
                    }
                });
                // socket.on('timeLeft', time);
            }
        })

        res.sendStatus(200)

        // var player = req.cookies.player
        // var code = req.cookies.code;
        // console.log("this is the room code " + res.cookie.code);

        // res.render('lobby', {/*code:req.cookies.code, */player: req.cookies.player})
    })
}
