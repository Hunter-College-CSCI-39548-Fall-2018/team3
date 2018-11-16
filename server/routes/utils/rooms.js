const _ = require('underscore')

class Room{
  constructor(){
    this.settings = {}
    this.players = {}
    this.key = ""
    this.teams = []
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
  
  removePlayer(socketid){
    for (var key in this.players) {
        if(this.players[key].socketid == socketid){
            delete this.players[key]
            break
        }
    }
    console.log("players right now", this.players);
  }

  hasPlayer(player){
    console.log(this.players)
    return this.players.hasOwnProperty(player)
  }

  createTeams(){
    // let teams = this.settings.numOfTeams;
    let teams = 2;
    let templateTeam = [];
    for(let i = 0; i < teams; i++){
      //this.teams.push(templateTeam);
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
    var i,j,temparray,chunk = 4;
    let newArr = _.shuffle(this.players);

    this.teams = _.chunk(newArr, 4);

    console.log("shuffled teams ", this.teams);

  }

  returnTeams(){
    return this.teams
  }
}

module.exports = Room
