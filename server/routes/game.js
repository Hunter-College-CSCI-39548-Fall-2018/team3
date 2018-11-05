module.exports = (app, io, rooms) => {
    app.get('/game', (req, res) => {
        console.log("called game route")

        let seq = ['A', 'C', 'D', 'B']
        let i = 0
        let game_started = false

        io.sockets.on('connection', (socket)=>{
            console.log("socket connected")

            if(!game_started) {
                socket.emit('start-game', seq[0])
                game_started = true
            }

            // socket.on('test', (msg) => console.log(msg))
            socket.on('input-command', (command) => {

                console.log("got command:", command)
                if(command == seq[i]){
                    i++
                    socket.emit('correct-command', seq[i])
                }else{
                    socket.emit('wrong-command', seq[i])
                }
            })
            
        })

        res.sendStatus(200)
        //not game owner- is player
        // if(req.cookies.game_owner == '0'){
        //     io.sockets.on('connection', (socket) => {
        //         socket.on('get-command', (command) => {
        //             console.log(command)
        //         })

        //         socket.on('test', (msg) => console.log(msg))
        //     })
        // }
    })
}