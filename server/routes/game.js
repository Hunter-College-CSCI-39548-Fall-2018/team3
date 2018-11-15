const Room = require('./utils/rooms.js')
let i = 0
let k = 0

module.exports = (app, io, rooms,room) => {

    turnCall = (socket) => {
        
    }

    app.get('/game', (req, res) => {
        console.log("called game route")

        let connected = false
        //define sequence later
        let seq = ['A', 'C', 'D', 'B']
        let game_started = false

        io.sockets.on('connection', (socket)=>{
            console.log("socket connected")
            if(!connected){
                room.addPlayer(k, {socketid: socket.id})
                k++
                socket.join("room")
                console.log("people in room",rooms["room"].players)
                connected = true
            }
            socket.on('shuffle-teams', () => {
                room.shuffleTeams()
            })
            socket.on('start-game', () => {
                if(!game_started) {
                    //get random person to input the command 
                    console.log(room.teams[0][0].socketid)
                    io.to(room.teams[0][0].socketid).emit('your-turn', "x")
                    socket.broadcast.emit('start-game', seq[0])
                    socket.emit('start-game', seq[0])
                    game_started = true
                }
            })
            //join the room in the cookie later
            
            // if(!game_started) {
            //     //get random person to input the command 
            //     console.log(room.teams[0][0].socketid)
            //     io.to(room.teams[0][0].socketid).emit('your-turn', "x")
            //     socket.emit('start-game', seq[0])
            //     game_started = true
            // }

            // socket.on('test', (msg) => console.log(msg))
            socket.on('input-command', (command) => {
                
                console.log("got command:", command)
                if(command == seq[i]){
                    i++
                    socket.broadcast.emit('correct-command', seq[i])
                    socket.emit('correct-command', seq[i])
                }else{
                    socket.broadcast.emit('wrong-command')
                    socket.emit('wrong-command')
                }
            })

        })
        //after everyone has joined
        // room.shuffleTeams()
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
