const Room = require('./utils/rooms.js')
let i = 0
let k = 0

module.exports = (app, io, rooms,room) => {
    //uncomment later for when you're not testing
    //var room = rooms[req.cookies.room]


    /*
    *   Calls a random player in each team 
    *   and tells them it is his turn. Only
    *   that person can input a command
    */
    setTurn = () => {
        console.log("state of teams:", room.teams);
        for(let team of room.teams){
            //call one person in each team to input command
            console.log("teams in room:", room.teams);
            console.log("single team in room:", team);
            let team_member = Math.floor(Math.random() * (team.length-1) )
            console.log("person to go is:", team[team_member].socketid);
            
            //team is the team
            //team[i] is the person on the team
            io.to(team[team_member].socketid).emit('your-turn')
        }
    }

    /*
    *   Starts the game by generating random sequence
    *   and displaying it for the users on screen
    */
    startGame = (socket, seq) => {
        console.log("start game is called");
        setTurn()

        socket.broadcast.emit('start-game', seq[0])
        socket.emit('start-game', seq[0])
    }

    /*
    *   When players first connect, have them join the room
    *   through their socket. Rooms are not persistant through
    *   routes. 
    */
    onFirstConnect = (socket) => {
        console.log("socket connected");
        room.addPlayer(k, {socketid: socket.id})

        //for testing purposes- gives different name for each iteration of player
        k++

        //join the room in the cookie later
        socket.join("room")
        console.log("people in room", room.players)

    }

    checkCommand = (seq, command) => {
        return seq == command
    }

    app.get('/game', (req, res) => {
        console.log("called game route")
        let connected = false

        //define sequence later
        let seq = ['A', 'C', 'D', 'B']
        let game_started = false

        // var l_room = rooms[req.cookies.room]        
        io.sockets.on('connection', (socket)=>{

            //if game owner
            // if(l_room.game_owner === socket.id){
            //      socket.emit('split-page-into-teams', l_room.settings.num_teams) 
            // }
            // else{
            
            // }

            socket.on('disconnect', () => {
                console.log("someone disconnected");
                room.removePlayer(socket.id)
            })

            if(!connected){
                onFirstConnect(socket)
                connected = true
            }

            socket.on('shuffle-teams', () => {
                room.shuffleTeams()
            })

            socket.on('start-game', () => {
                if(!game_started){
                    startGame(socket, seq)
                    game_started = true
                }
            })

            socket.on('input-command', (command) => {
                console.log("got command:", command)
                if(checkCommand(seq[i], command)){
                    i++
                    setTurn()
                    socket.broadcast.emit('correct-command', seq[i])
                    socket.emit('correct-command', seq[i])
                }else{
                    socket.broadcast.emit('wrong-command')
                    socket.emit('wrong-command')
                }
            })
        })
        res.sendStatus(200)

    })
}
