const Room = require('./utils/rooms.js')
let k = 0

module.exports = (app, io, rooms,room) => {
    //uncomment later for when you're not testing
    //var room = rooms[req.cookies.room]


    /*
    *   Shuffle icons each turn for all players
    *   TODO: Michelle fill this out thanks
    */
    shuffleIcons = (socket) => {

    }

    /*
    *   Calls a random player in team 
    *   and tells them it is his turn. Only
    *   that person can input a command
    */
    setTurn = (team) => {
        let rand = Math.floor(Math.random() * (team.players.length) )
        console.log("random number:", rand);

        io.to(team.players[rand].socketid).emit('your-turn')
    }

    /*
    *   Starts the game by generating random sequence
    *   and displaying it for the users on screen
    */
    startGame = (socket, seq) => {
        for(let key of room.players){
            shuffleIcons(key.socketid)
        }

        console.log("start game is called");
        for(let key of room.teams){
            setTurn(key)
        }

        socket.broadcast.emit('start-game', seq[0])
        socket.emit('start-game', seq[0])
        console.log("end of clal game");

        // console.log("clients connected:", io.sockets.clients());
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
    *   Broadcast to everyone in the player's team with a message
    */
    broadcastToTeam = (team, event, msg) => {
        for(let key of team.players){
            io.to(key.socketid).emit(event, msg)
        }
    }

    endGame = (team) => {
        //finish for when game ends
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
            
            socket.on('input-command', (msg) => {
                //make sure it listens only to client that emitted
                if(socket.id === msg.socketid){
                    var team = room.whichTeam({socketid: socket.id})

                    if(checkCommand(seq[team.sequence], msg.command)){
                        if(team.sequence >= sequence.length){
                            endGame(team)
                        }else{
                            team.sequence += 1

                            broadcastToTeam(team, 'correct-command', seq[team.sequence])
                            setTurn(team)
                        }
                    }else{
                        io.to(socket.id).emit('wrong-command')
                    }
                }
            })
        })
        res.sendStatus(200)

    })
}
