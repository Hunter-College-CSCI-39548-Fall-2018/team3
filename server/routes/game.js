const assets = require('./utils/icons.js')
const _ = require('underscore')

const dir = require('path').resolve(__dirname, '../../config/public/images')


module.exports = (app, io, rooms) => {
    const time_until_start = 3000
    const total_icons = 4
    const end_score = 30

    var time
    var game_connected = []
    var on_game = false

    app.get('/game', (req, res) => {
        console.log("called game route") 

        on_game = true
        time = {min: rooms[req.cookies.room].settings.time, sec: 5}

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

                console.log("what room's player s look like", room.players)
                console.log("does player exist", room.players[name])

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

                setTimeout(() => {
                    // room.checkForGhosts()
                    startGame()
                }, time_until_start)

                //wait for players to connect before starting the game
                // setTimeout(() => {
                //     room.checkForGhosts()
                // }, time_until_start)

                game_connected.push(socket.id)
        
                room.game_owner = socket.id
                socket.join(room.key)
            }
            onGameOwnerDisconnect = () => {
                console.log("game owner disconnected in game");
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
            *   Generate the icon to be inputted on the screen
            */
            generateCurrIcon = () => {
                return Math.floor(Math.random() * files.length)
            }

            getFiles = () => {
                return assets.readFiles(dir)
            }

            enumerateIcons = (files) => {
                return assets.enumerateIcons(files)
            }

            //returns a number
            getOmittedIcon = (files) => {
                return assets.omitIcon(files)
            }

            const files = getFiles()
            const enum_icons = enumerateIcons(files)
            var omit_icon = getOmittedIcon(files)
            

            // Shuffle icons for player without matching icon
            shuffleGeneralIcons = (omit_icon) => {
                let icons = []
                icons = assets.generateIcons(omit_icon, enum_icons, files)

                return icons
            }

            // Shuffle icons for player with matching icon
            shuffleMatchIcons = (omit_icon) => {
                let icons = []
                icons = assets.generateOmittedIcons(omit_icon, enum_icons, files)
                
                return icons
            }

            shuffleTeamsIcons = (team, omit_icon) => {
                //generate matching icon for random player
                let rand_num = Math.floor(Math.random() * team.players.length)
                let match_icons = shuffleMatchIcons(omit_icon)
                
                io.to(team.players[rand_num].socketid).emit("new-icons", match_icons)


                //generate general icons for everyone else
                let general_icons = []
                for(let i = 0; i < team.players.length; i++){
                    if(i === rand_num) continue

                    general_icons = shuffleGeneralIcons(omit_icon)
                    io.to(team.players[i].socketid).emit("new-icons", general_icons)
                }
            }

            broadcastToTeam = (team, event, msg) => {
                for(let user of team.players){
                    io.to(user.socketid).emit(event, msg)
                }
            }

            startGame = () => {
                startTimer()

                //generate omitted icon
                let omitted_icon = getOmittedIcon(files)

                //go through each team and assign curr icon and shuffle icons for each player in team
                for(let i = 0; i < room.teams.length; i++){
                    room.teams[i].curr_icon = { icon: enum_icons[omitted_icon], index: omitted_icon }

                    shuffleTeamsIcons(room.teams[i], omitted_icon)
                    broadcastToTeam(room.teams[i], 'game-started', {teams: room.teams, team: i})
                }
                
                io.to(room.game_owner).emit('game-started', { teams: room.teams } )

                console.log("end of clal game");
            }

            checkCommand = (curr_icon, command) => {
                return curr_icon === command
            }

            
            endGame = (team) => {
                //finish for when game ends
                const winInfo = {teamNumber : 1 ,players : team.players, score : team.score}
        		socket.to(room.game_owner).emit('end-game',winInfo)
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
                    if(room.game_owner === socket.id){
                        onGameOwnerDisconnect()
                    }else{
                        //if room still exists and player disconnects
                        onPlayerDisconnect()
                    }
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
                        if(checkCommand(team.curr_icon.index, msg.command)){
                            team.score += 1

                            let omit_icon = getOmittedIcon(files)
                            team.curr_icon = { icon: enum_icons[omit_icon], index: omit_icon}
                            
                            shuffleTeamsIcons(team, omit_icon)
                            io.to(room.game_owner).emit('correct-command', room.teams)
                        }else{
                            team.score -= 1
                            io.to(room.game_owner).emit('wrong-command', room.teams)
                        }
                    }
                }
            })

			socket.on('restart', () => {
				for (key in room.players){
					socket.to(room.players[key].socketid).emit('restart')
				}

				io.to(room.game_owner).emit('GameOwnerRestart')
			})


            //wait until everyone is connected before disabling add event listener
            if(game_connected.length === Object.keys(room.players).length +1){
                console.log("everyon eocnnected");

                //server version of componentWillUnmount
                on_game = false
            }

        }

        
    })
}


