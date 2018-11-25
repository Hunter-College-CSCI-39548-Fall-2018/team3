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
    this.game_owner = "" //track socket id
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
      console.log("calling create teams");
    // let teams = this.settings.numOfTeams;
    let teams = /*this.settings.num_teams*/2;
    let templateTeam = {players: [], sequence:0};
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

  whichTeam(player){
    for(let key of this.teams){
        if(_.findWhere(key.players, player)){
            return key
        }
    }
  }

  shuffleTeams(){
    var chunk = this.settings.players_per_team;
    let newArr = _.shuffle(this.players);

    //_.chunk - second argument takes how many elements in each array 
    var hold_teams = _.chunk(newArr, 2);

    let temp = hold_teams.map(team => {
        let obj = {players: [], sequence: 0}
        obj.players = team
        return obj
    })
    this.teams = temp
    for(let key of this.teams){
        console.log("shuffled teams:", key.players);
    }
  }
}

module.exports = Room
