module.exports = (app, io, rooms) => {
    var game_started = false

    const time_until_start = 3000
    const total_icons = 4
    const end_score = 30

    var game_connected = []

    var on_game = false
    app.get('/game', (req, res) => {
        console.log("called game route") 

        on_game = true
        res.sendStatus(200)
    })

    io.sockets.on('connection', (socket)=>{
        if(on_game){
            //get cookie in headers of socket connection
            getCookie = (cookie) => {
                let cookies = socket.handshake.headers['cookie']
                let cookie_split = cookies.split("; ")

                for(let cookies of cookie_split){
                    if(cookie === "player"){
                        if(cookies[0] === 'p'){
                            let player = cookies.split("=")
                            return player[1]
                        }
                    }
                    else if(cookie === "game_owner"){
                        if(cookies[0] === 'g'){
                            let game_owner = cookies.split("=")
                            return game_owner[1]
                        }
                    }     
                    else if(cookie === "room"){
                        if(cookies[0] === 'r'){
                            let room = cookies.split("=")
                            return room[1]
                        }
                    }
                }
            }

            var room = rooms[getCookie("room")]

            /*
            *   When players first connect, have them join the room
            *   through their socket. Connections are not persistant through
            *   routes. 
            */
            onPlayerFirstConnect = () => {            
                //indicate player has connected
                game_connected.push(socket.id)
                let name = getCookie("player")

                //mark that player has connected successfully to the game
                room.players[name].connected = true

                //update socketid of player 
                room.setSocketId(name, socket.id)

                socket.join(room.key)
            }
            onPlayerDisconnect = () => {
                //remove player by socket id
                room.removePlayer(socket.id)
                room.removePlayerFromTeam(socket.id)
            }
            
            onGameOwnerFirstConnect = () => {
                for(let key of room.teams){
                    console.log("what does team slook iek", key.players);
                }

                //wait for players to connect before starting the game
                // setTimeout(() => {
                //     room.checkForGhosts()
                // }, time_until_start)

                game_connected.push(socket.id)
        
                room.game_owner = socket.id
                socket.join(room.key)
            }
            onGameOwnerDisconnect = () => {
                //disconnect and redirect everyone in room
                io.to(room.key).emit('force-disconnect')
                
                delete room
            }

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

            startGame = () => {
                let curr_icon = generateCurrIcon()

                for(let team of room.teams){
                    team.curr_icon = curr_icon
                }
                socket.to(room.key).emit('game-started', room.teams)

                // socket.emit('game-started', room.teams)
                console.log("end of clal game");
            }

            checkCommand = (curr_icon, command) => {
                return curr_icon === command
            }

            checkIfWon = (team) => {
                if(team.score > end_score){
                    endGame(team)
                }
            }
        
            endGame = (team) => {
                //finish for when game ends
                console.log("game has ended");
            }

            //to track if a user has connected for the first time
            if(game_connected.indexOf(socket.id) === -1){
                if(getCookie("game_owner") === "0"){
                    onPlayerFirstConnect()
                }
                else if(getCookie("game_owner") === "1"){
                    onGameOwnerFirstConnect()
                }
            }
            
            socket.on('disconnect', () => {
                if(room){
                    if(getCookie("game_owner") === "1"){
                        onGameOwnerDisconnect()
                    }else{
                        //if room still exists and player disconnects
                        onPlayerDisconnect()
                    }
                }
            })

            socket.on('start-game', () => {
                if(!game_started){
                    startGame()
                    game_started = true
                }
            })
            
            socket.on('input-command', (msg) => {    
                //make sure it listens only to client that emitted
                if(socket.id === msg.socketid){
                    console.log("got command", msg.command);
                    var team = room.whichTeam({socketid: socket.id})

                    if(team === -1){
                        console.log("wiat this team doesnt eist");
                    }else{
                        if(checkCommand(team.curr_icon, msg.command)){
                            team.score += 1
                            team.curr_icon = generateCurrIcon()

                            io.to(room.game_owner).emit('correct-command', room.teams)
                        }else{
                            team.score -= 1
                            io.to(room.game_owner).emit('wrong-command', room.teams)
                        }
                        checkIfWon(team)
                    }
                }
            })
        }

        
    })
}


