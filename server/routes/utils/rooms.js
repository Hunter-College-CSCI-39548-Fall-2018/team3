const _ = require('underscore')
const Team = require('./teams.js')

class Room{
<<<<<<< HEAD
  constructor(){
    this.settings = {
        players_per_team: 1,
        num_teams: 2
    }
    this.players = {}
    this.key = ""
    this.teams = []
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

  // Obsolete function
  // setPlayers(players){
  //   this.players = players
  // }

  addPlayer(player, value){
    this.players[player] = value
  }

  // getGameStatus(){
  //   return this.start
  // }

  removePlayer(socketid){
    for (var key in this.players) {
      console.log("HERE is socketid:",this.players[key].socketid)
      if(this.players[key].socketid === socketid){
        console.log("THIS IS THE PLAYER THAT GETS DELETE:",this.players[key])
        console.log("OR:",key)
        delete this.players[key]
        break
      }
    }
  }

  hasPlayer(player){
    console.log(this.players)
    return this.players.hasOwnProperty(player)
  }

  createTeams(){
    // let teams = this.settings.numOfTeams;
    let teams = this.settings.num_teams;
    let templateTeam = [];
    for(let i = 0; i < teams; i++){
      this.teams.push(templateTeam);
    }
  }

  startTimer(socket){
    if(this.start === false){
         //activated for the first time
      let updated_time = setInterval( () => {
          this.time -=1;
          if(this.time === 0){
              clearInterval(updated_time);
              this.start = true;
          }
          // console.log(this.time);
          // console.log("updated time", updated_time);3
          socket.emit('time-left', this.time);
          socket.broadcast.emit('time-left', this.time);
      },
      1000);
    }
  }

  // countPlayers(){
  //   let count = 0
  //   for(let key in this.players){
  //     count++
  //   }
  //   return count
  // }

  shuffleTeams(){
    //substitue for number of players per team later 
    var i,j,temparray
    //console.log("these are the new players", this.players)
    var chunk = this.settings.players_per_team;
    let newArr = _.shuffle(this.players);

    this.teams = _.chunk(newArr, chunk);

    console.log("shuffled teams ", this.teams);

  }

  returnTeams(){
    return this.teams
  }
=======
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
>>>>>>> 669c4990cebde0f35138f0574dfbc2381888d54c
}

module.exports = Room
