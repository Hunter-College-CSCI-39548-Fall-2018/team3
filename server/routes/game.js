const Icons = require('./utils/icons.js')
// const Teams = require('./utils/teams.js')

var room = rooms[req.cookies.room];
//holds the prompt icon for the teams in a room
// const prompts = [];
let prompt;
//generates the prompts for each team in the begining
for(let team of room.teams) {
    team.prompt = Icon.generateIcon();
}

// let teamSize = [];
getTeamSize = (room.teams) => {
    for(let i in room.teams) {
        teamSize.push(room.teams.players.length)
    }
    return teamSize;
}

// //holds the icons for each team in the same room
// let teamIcons = [];
// //generate teh array of icons for each player in a team
for(let team of room.teams) {
    let teamIcon = Icons.generateRoundIcons(team.prompt, team.players.length);
    teamIcons.push(teamIcon);
}

module.exports = (app, io, rooms) => {
    const time_until_start = 3000
    const total_icons = 4
    const end_score = 30

    var time
    var game_connected = []
    var on_game = false

    Icons.generateIcon();

    app.get('/game', (req, res) => {
        console.log("called game route") 

<<<<<<< HEAD
        on_game = true
        time = {min: 0, sec: 5}

        res.sendStatus(200)
    })

    io.sockets.on('connection', (socket)=>{
        if(on_game){
            console.log("called game socket sonncection");
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
=======
        }
        /*
        *   Generate the icon to be inputted on the screen
        */
        generateCurrIcon = () => {
            return Math.floor(Math.random() * total_icons)
        }

        /*
        *   Starts the game by generating random icon
        *   and displaying it for the users on screen
        */
        startGame = (socket) => {
            console.log("called start game");
            for(let team of room.teams){
                team.curr_icon = curr_icon
                broadcastToTeam(team, "game-started", room.teams)
>>>>>>> ccf2ed9851bcd14ac0f6b2c8ff7b040a3f3986c6
            }
           

            let curr_icon = generateCurrIcon()
             // for(let key of room.players){
            //     shuffleIcons(key.socketid)
            // }
            

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

                console.log("removed player from disconet in game");
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

            checkIfWon = () => {
                //in case there are multiple teams that win
                // let winning_team = []
                
                var winning_team = room.teams.reduce(function(x, y) {
                    return x.score > y.score ? x : y;
                })         

                return winning_team
            }

            startTimer = () =>{
                let updated_time = setInterval( () => {
                    
                    if(time.sec === 0){
                        time.min -= 1
                        time.sec = 59
                    }else{
                        time.sec -= 1
                    }

                    if(time.min === 0 && time.sec === 0){
                        clearInterval(updated_time);
                        let winning_team = checkIfWon()

                        console.log("winnign team is", winning_team);
                        endGame(winning_team)
                        console.log("gme had ended in server side");
                    }

                    io.to(room.game_owner).emit('time-left', time)
                }, 1000);
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
                startTimer()
                let curr_icon = generateCurrIcon()

                for(let team of room.teams){
                    team.curr_icon = curr_icon
                }
                io.to(room.key).emit('game-started', room.teams)

                // socket.emit('game-started', room.teams)
                console.log("end of clal game");
            }

            checkCommand = (curr_icon, command) => {
                return curr_icon === command
            }

            
            endGame = (team) => {
                //finish for when game ends
                const winInfo = {teamNumber : 1 ,players : team.players, score : team.score}
        		socket.emit('end-game',winInfo)
                console.log("game has ended");
                console.log("team has won", team.score);
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
                startGame()
            })
            
            socket.on('input-command', (msg) => {    
                //make sure it listens only to client that emitted
                if(socket.id === msg.socketid){
                    console.log("got command", msg.command);
                    var team = room.whichTeam({socketid: socket.id})

<<<<<<< HEAD
                    if(team === -1){
                        console.log("wiat this team doesnt eist");
=======
                    if(checkCommand(team.curr_icon, msg.command)){
                        team.score += 1
                        //start a new round
                        team.curr_icon = generateCurrIcon()

                        io.to(room.game_owner).emit('correct-command', room.teams)
>>>>>>> ccf2ed9851bcd14ac0f6b2c8ff7b040a3f3986c6
                    }else{
                        if(checkCommand(team.curr_icon, msg.command)){
                            team.score += 1
                            team.curr_icon = generateCurrIcon()

                            io.to(room.game_owner).emit('correct-command', room.teams)
                        }else{
                            team.score -= 1
                            io.to(room.game_owner).emit('wrong-command', room.teams)
                        }
                    }
                }
            })
<<<<<<< HEAD

			socket.on('restart', () => {

				const currPlayersSockets = Object.values(room.players)

				for (key in currPlayersSockets){
					socket.to(currPlayersSockets[key].socketid).emit('restart')
				}

				socket.emit('GameOwnerRestart')
			})


            //wait until everyone is connected before disabling add event listener
            if(game_connected.length === Object.keys(room.players).length +1){
                console.log("everyon eocnnected");

                //server version of componentWillUnmount
                on_game = false
            }

        }

        
=======
        })
        res.sendStatus(200)
>>>>>>> ccf2ed9851bcd14ac0f6b2c8ff7b040a3f3986c6
    })
}


