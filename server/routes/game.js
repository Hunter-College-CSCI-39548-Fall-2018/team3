const Room = require('./utils/rooms.js')
const Player = require('./utils/player.js')

// let k = 0

module.exports = (app, io, rooms) => {
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
    startGame = (socket, room, seq) => {
        console.log("called start game");

        // for(let key of room.players){
        //     shuffleIcons(key.socketid)
        // }

        // console.log("start game is called");
        // for(let key of room.teams){
        //     setTurn(key)
        // }
        console.log("who is the room emitting to", room);
        
        socket.to(room).emit('start-game', {seq:seq[0], teams: room.teams})
        socket.emit('start-game', {seq:seq[0], teams:room.teams})
        console.log("end of clal game");
    }

    /*
    *   When players first connect, have them join the room
    *   through their socket. Rooms are not persistant through
    *   routes. 
    */
    onPlayerFirstConnect = (socket, req) => {
        let room = rooms[req.cookies.room]

        console.log("socket connected");

        let player = new Player(req.cookies.player, socket.id)
        player.room = req.cookies.room
        room.addPlayer(req.cookies.player, player)
        
        //when actually keep track of real players
        let name = req.cookies.player
        room.setSocketId(name, socket.id)

        socket.join(req.cookies.room)
        console.log("people in room", room.players)

    }
    onGameOwnerFirstConnect = (socket, req) => {
        let room = req.cookies.room
        room.game_owner = socket.id

        socket.join(room)
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
        var room = rooms[req.cookies.room]
        
        //define sequence later
        let seq = ['A', 'C', 'D', 'B']
        
        io.sockets.on('connection', (socket)=>{
            if(req.cookies.game_owner === "1"){
                if(!connected){
                    onGameOwnerFirstConnect(socket, req)
                    connected = true
                }
            }
            else if(req.cookies.game_owner === "0"){
                if(!connected){
                    onPlayerFirstConnect(socket, req)
                    connected = true
                }
            }

            socket.on('disconnect', () => {
                console.log("someone disconnected");
                room.removePlayer(socket.id)
            })

            socket.on('shuffle-teams', () => {
                if(!shuffled){
                    room.shuffleTeams()
                    shuffled = true
                }
            })

            socket.on('start-game', () => {
                if(!game_started){
                    startGame(socket, room.key, seq)
                    // startGame(socket, {seq:seq, teams: room.teams})
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
