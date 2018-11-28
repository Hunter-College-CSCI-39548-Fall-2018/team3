class Player {
    constructor(name, socketid){
        this.room = ""
        this.name = name
        this.socketid = socketid
        this.game_owner = false
        this.connected = false
    }

}

module.exports = Player