class Player {
    constructor(name, socketid){
        this.room = ""
        this.name = name
        this.socketid = socketid
        this.connected = false
    }

}

module.exports = Player