const _ = require('underscore')

class Room{
  constructor(){
    this.settings = {
        players_per_team: 0,
        num_teams: 2
    }
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
