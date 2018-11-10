const Room = require('./utils/rooms.js')

module.exports = (app, io, rooms,room) => {
    let k = 0

    turnCall = (socket) => {
        
    }

    app.get('/game', (req, res) => {
        console.log("called game route")

        let connected = false
        //define sequence later
        let seq = ['A', 'C', 'D', 'B']
        let i = 0
        let game_started = false

        io.sockets.on('connection', (socket)=>{
            console.log("socket connected")
            if(!connected){
                room.addPlayer(k, {socketid: socket.id})
                k++
                connected = true
            }
            

            //join the room in the cookie later
            socket.join("room")
            console.log("people in room",rooms["room"].players)
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
                    socket.emit('wrong-command')
                }
            })

            socket.on('shuffle-teams', () => {
                // room.shuffleTeams()
                // console.log("teams are", rooms["room"].teams)

                room.teams[0].push(room.players["0"])
                room.teams[1].push(room.players["1"])

                console.log(room.teams)

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