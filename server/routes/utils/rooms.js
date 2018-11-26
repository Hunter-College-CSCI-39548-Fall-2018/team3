const _ = require('underscore')

class Room{
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

  setPlayers(players){
    this.players = players
  }

  addPlayer(player, value){
    this.players[player] = value
  }

  getGameStatus(){
    return this.start
  }

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
      this.start = true;   //activated for the first time
      let updated_time = setInterval( () => {
          this.time -=1;
          if(this.time === 0){
              clearInterval(updated_time);
          }
          // console.log(this.time);
          // console.log("updated time", updated_time);3
          socket.emit('time-left', this.time);
          socket.broadcast.emit('time-left', this.time);
      },
      1000);
    }
  }

  countPlayers(){
    let count = 0
    for(let key in this.players){
      count++
    }
    return count
  }

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
}

module.exports = Room
