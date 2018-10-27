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
    return this.players.hasOwnProperty(player)
  }
}

module.exports = Room