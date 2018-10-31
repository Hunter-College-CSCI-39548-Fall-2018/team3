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
    // console.log("player in room?",this.players.hasOwnProperty(player))

  }

  hasPlayer(player){
    console.log(this.players)
    return this.players.hasOwnProperty(player)
  }

  createTeams(){
    let teams = this.settings.numOfTeams;
    let templateTeam = [];
    for(let i = 0; i < teams; i++){
      this.teams.push(templateTeam);
    }
  }

  shuffleTeams(){

    // Waiting until the players dictionary can be tested first
    /*
    for (let i = this.teams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.teams[i], this.teams[j]] = [this.teams[j], this.teams[i]]; // eslint-disable-line no-param-reassign
    }
    */
  }
}

module.exports = Room