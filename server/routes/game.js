const Room = require('./utils/rooms.js')
const Player = require('./utils/player.js')

// let k = 0

module.exports = (app, io, rooms) => {
    var shuffled = false
    let game_started = false
    const time_until_start = 5000

    app.get('/game', (req, res) => {
        var room = rooms[req.cookies.room]

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
        // setTurn = (team) => {
        //     let rand = Math.floor(Math.random() * (team.players.length) )
        //     console.log("random number:", rand);

        //     io.to(team.players[rand].socketid).emit('your-turn')
        // }

        /*
        *   Starts the game by generating random sequence
        *   and displaying it for the users on screen
        */

        clearCookies = () =>{
            res.clearCookie("player")
            res.clearCookie("room")
            res.clearCookie("game_owner")
        }

        startGame = (socket, room, seq) => {
            console.log("called start game");

            // for(let key of room.players){
            //     shuffleIcons(key.socketid)
            // }

            console.log("teams in start game:", room.teams);

            socket.to(room.key).emit('game-started', {seq:seq[0], teams: room.teams})
            socket.emit('game-started', {seq:seq[0], teams:room.teams})

            console.log("end of clal game");
        }

        /*
        *   When players first connect, have them join the room
        *   through their socket. Rooms are not persistant through
        *   routes. 
        */
        onPlayerFirstConnect = (socket) => {
            console.log("socket connected");
            console.log(req.cookies);

            let name = req.cookies.player
            console.log("cookie ofr name", name);

            console.log("player obj", room.players[name]);
            //mark that player has connected successfully to the game
            // room.players[name].connected = true

            //only for testing purposes- room should be already
            //populated in real game
            // let player = new Player(req.cookies.player, socket.id)
            // player.room = req.cookies.room
            // room.addPlayer(req.cookies.player, player)
            
            room.setSocketId(name, socket.id)

            socket.join(room.key)
            // console.log("people in room", room.players)
        }
        onGameOwnerFirstConnect = (socket) => {
            console.log("socket conncected");
            console.log(req.cookies);

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

        /*
        *   If anyone has not connected to the game, kick them out
        *   of the room
        */
        checkForGhosts = () => {
            //remove disconnected player from players list
            for(let player in room.players){
                if(!player.connected){
                    delete player
                }
            }

            //remove disconnected player from team
            for(let team of room.teams){
                for(let player of team.players){
                    if(!player.connected){
                        delete player
                    }
                }
            }
        }

        endGame = (team) => {
            //finish for when game ends
        }

        //wait for players to connect before starting the game
        setTimeout(() => {
            checkForGhosts()
        }, time_until_start)

        console.log("called game route")
        let connected = false
        
        //define sequence later
        let seq = ['A', 'C', 'D', 'B']
        
        io.sockets.on('connection', (socket)=>{

            if(req.cookies.game_owner === "1"){
                if(!connected){
                    onGameOwnerFirstConnect(socket)
                    connected = true
                }
            }
            else if(req.cookies.game_owner === "0"){
                if(!connected){
                    onPlayerFirstConnect(socket)
                    connected = true
                }
            }
            
            socket.on('disconnect', () => {
                console.log("someone disconnected");
                room.removePlayer(socket.id)
            })

            socket.on('shuffle', () => {
                if(!shuffled){
                    room.shuffleTeams()
                    shuffled = true
                }
            })

            socket.on('start-game', () => {
                console.log("got start game emit in server");
                console.log("room object", room);
                if(!game_started){
                    startGame(socket, room, seq)
                    game_started = true
                }
            })
            
            socket.on('input-command', (msg) => {
                //make sure it listens only to client that emitted
                if(socket.id === msg.socketid){
                    var team = room.whichTeam({socketid: socket.id})
                    //implementation for score

                    //implentation for "race" - there is a sequence 
                    
                    // if(checkCommand(seq[team.sequence], msg.command)){
                    //     if(team.sequence >= sequence.length){
                    //         endGame(team)
                    //     }else{
                    //         team.sequence += 1

                    //         broadcastToTeam(team, 'correct-command', seq[team.sequence])
                    //         setTurn(team)
                    //     }
                    // }else{
                    //     io.to(socket.id).emit('wrong-command')
                    // }
                }
            })
        })

        res.sendStatus(200)

    })
}
