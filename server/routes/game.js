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
        for(let team of room.teams){
            //call one person in each team to input command
            let team_member = Math.floor(Math.random() * (team.players.length-1) )
            
            //team is the team
            //team.players[i] is the person on the team
            io.to(team.players[team_member].socketid).emit('your-turn')
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

    /*
    *   Broadcast to everyone in the player's team
    *   with only the event
    */
    broadcastToTeam = (team, event) => {
        for(let key of team.players){
            io.to(key.socketid).emit(event)
        }
    } 

    /* 
    *   Broadcast to everyone in the player's team with a message
    */
    broadcastToTeam = (team, event, msg) => {
        for(let key of team.players){
            io.to(key.socketid).emit(event, msg)
        }
    }

    var shuffled = false
    let game_started = false

    app.get('/game', (req, res) => {
        console.log("called game route")
        let connected = false
        
        //define sequence later
        let seq = ['A', 'C', 'D', 'B']

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
                if(!shuffled){
                    room.shuffleTeams()
                    shuffled = true
                }
            })

            socket.on('start-game', () => {
                if(!game_started){
                    startGame(socket, seq)
                    game_started = true
                }
            })
            
            socket.on('input-command', (command) => {
                console.log("got command:", command)
                var team = room.whichTeam({socketid: socket.id})
                if(checkCommand(seq[team.sequence], command)){
                    team.sequence += 1

                    broadcastToTeam(team, 'correct-command', seq[team.sequence])
                    setTurn()
                }else{
                    broadcastToTeam(team, 'wrong-command')
                }
            })
        })
        res.sendStatus(200)

    })
}
