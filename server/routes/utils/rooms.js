const _ = require('underscore')
const Team = require('./teams.js')

class Room{
    constructor(){
        this.settings = {
            players_per_team: 1,
            num_teams: 2
        }
        this.players = {}
        this.key = ""
        this.teams = []
        this.game_owner = "" //track socket id
        this.time = 3;
        this.start = false;
    }

    setGameOwner(socketid){
        this.game_owner = socketid
    }

    setSettings(settings){
        this.settings = settings
    }

    setKey(key){
        this.key = key
    }

    addPlayer(player, value){
        this.players[player] = value
    }
    
    getGameStatus(){
        return this.start
    }

    removePlayer(socketid){
        for (let key in this.players) {
            if(this.players[key].socketid === socketid){
                delete this.players[key]
                break
            }
        }
    }

    removePlayerFromTeam(socketid){
        for(let team of this.teams){
            for(let i = 0; i < team.players.length; i++){
                if(team.players[i].socketid === socketid){
                    team.players.splice(i, 1)
                    return
                }
            }
        }
    }

    hasPlayer(player){
        console.log(this.players)
        return this.players.hasOwnProperty(player)
    }

    createTeams(){
        console.log("calling create teams");
        let teams = this.settings.numOfTeams;

        for(let i = 0; i < teams; i++){
            this.teams.push(new Team());
        }

        console.log("what does teams look like", this.teams);
    }

    startTimer(socket){
        this.start = true;
        let updated_time = setInterval( () => {
            this.time -=1;
            if(this.time === 0){
                clearInterval(updated_time);
            }
            socket.to(this.key).emit('time-left', this.time)
            socket.emit('time-left', this.time);
        }, 1000);
    }

    countPlayers(){
        let count = 0

        //for counting objects
        for(let key in this.players){
            count++
        }
        return count
    }

    whichTeam(player){
        for(let team of this.teams){
            // //find player in a team array
            if(_.findWhere(team.players, player)){
                return team
            }
        }
    }

    shuffleTeams(){
        var chunk = this.settings.players_per_team;
        let newArr = _.shuffle(this.players);

        //_.chunk - second argument takes how many elements in each array 
        var hold_teams = _.chunk(newArr, chunk);

        let temp = hold_teams.map(team => {
            let obj = new Team()
            obj.players = team
            return obj
        })
        this.teams = temp
    }
    
    setSocketId(player, socketid){
        //update socketid in players list
        this.players[player].socketid = socketid

        //update socketid in teams list
        if(this.teams.length > 0){
            for(let team of this.teams){
                for(let user of team.players){
                    if(user.name === player){
                        user.socketid = socketid
                        return 1
                    }
                }
            }
        }

        return 0
    }

    returnTeams(){
        return this.teams
    }
}

module.exports = Room
