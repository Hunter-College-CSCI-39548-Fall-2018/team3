module.exports = (app, io, rooms) => {
    var shuffled = false
    var game_started = false

    const time_until_start = 5000
    const total_icons = 40
    const end_score = 30

    var sockets_connected = []

    app.get('/game', (req, res) => {
        var room = rooms[req.cookies.room]
        var connected = false

        /*
        *   Shuffle icons each turn for all players
        *   TODO: Michelle fill this out thanks
        */
        shuffleIcons = (socket) => {

        }

        /*
        *   Generate the icon to be inputted on the screen
        */
        generateCurrIcon = () => {
            return Math.floor(Math.random() * total_icons)
        }

        clearCookies = (socket) =>{
            //cant clear cookies server side because sends response first
            //(cant set headers after they're sent)
            socket.emit('clear-cookies')
        }

        /*
        *   Starts the game by generating random icon
        *   and displaying it for the users on screen
        */
        startGame = (socket, room) => {
            console.log("called start game");

            // for(let key of room.players){
            //     shuffleIcons(key.socketid)
            // }

            console.log("teams in start game:", room.teams);
            let curr_icon = generateCurrIcon()

            socket.to(room.key).emit('game-started', {icon: curr_icon, teams: room.teams})
            socket.emit('game-started', {icon: curr_icon, teams:room.teams})

            console.log("end of clal game");
        }

        /*
        *   When players first connect, have them join the room
        *   through their socket. Rooms are not persistant through
        *   routes. 
        */
        onPlayerFirstConnect = (socket) => {
            sockets_connected.push(socket.id)

            let name = req.cookies.player

            //mark that player has connected successfully to the game
            // console.log("player in room", room.players[name].connected);
            room.players[name].connected = true
            
            room.setSocketId(name, socket.id)

            socket.join(room.key)
            // console.log("people in room", room.players)
        }
        onPlayerDisconnect = (socket) => {
            let team = room.whichTeam({socketid: socket.id})

            console.log("player removed from room list before:", room.players);
            console.log("player removed from room teams before:", team.players);

            //remove player by socket id
            room.removePlayer(socket.id)
            room.removePlayerFromTeam(socket.id)

            console.log("player removed from room list after:", room.players);
            console.log("player removed from room teams after:", team.players);

            clearCookies(socket)        
        }

        onGameOwnerFirstConnect = (socket) => {
            console.log("socket id for game owner", socket.id);

            sockets_connected.push(socket.id)

            room.game_owner = socket.id
            socket.join(room)
        }
        onGameOwnerDisconnect = (socket) => {
            console.log("players in room on game disc before:", room.players);
            console.log("teams in room on game dsc before:", room.teams);

            //disconnect and redirect everyone in room
            socket.to(room.key).emit('force-disconnect')

            clearCookies(socket)
            delete rooms[req.cookies.room]

            console.log("does gam eexst after disc", rooms);
        }

        checkCommand = (curr_icon, command) => {
            return curr_icon == command
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
        *   of the room. Removes by name, not socket id
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
                for(let i = 0; i < team.players.length; i++){
                    if(!team.players[i].connected){
                        team.players.splice(i, 1)
                    }
                }
            }
        }

        //get the cookie tied to a socket 
        getGameOwnerCookie = (socket) => {
            let cookies = socket.handshake.headers['cookie']
            let cookie_split = cookies.split("; ")

            for(let cookies of cookie_split){
                if(cookies[0] === 'g'){
                    let game_owner = cookies.split("=")
                    return game_owner[1]
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
                
        io.sockets.on('connection', (socket)=>{
            //to track if a user has connected for the first time
            if(sockets_connected.indexOf(socket.id) === -1){
                if(getGameOwnerCookie(socket) === "0"){
                    onPlayerFirstConnect(socket)
                }
                else if(getGameOwnerCookie(socket) === "1"){
                    onGameOwnerFirstConnect(socket)
                }
            }
            
            socket.on('disconnect', () => {
                if(rooms[req.cookies.room]){
                    if(rooms[req.cookies.room].game_owner === socket.id){
                        onGameOwnerDisconnect(socket)
                    }
                    else{
                        //if room still exists and player disconnects
                        onPlayerDisconnect(socket)
                    }
                }
            })

            socket.on('shuffle', () => {
                if(!shuffled){
                    room.shuffleTeams()
                    shuffled = true
                }
            })

            socket.on('start-game', () => {
                if(!game_started){
                    startGame(socket, room)
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
