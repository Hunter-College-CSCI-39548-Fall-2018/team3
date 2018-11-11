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

  setTeam(teams){
    this.teams = teams
  }

  setPlayers(players){
    this.players = players
  }

  addPlayer(player, value){
    // this.players.push(player)
    this.players[player] = value

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
    //chunk is playes per team
    var i,j,temparray,chunk = 4;
    let newArr = _.shuffle(this.players);
    console.log("new arr",newArr);

  }
}

module.exports = Room
