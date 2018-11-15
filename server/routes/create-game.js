const Room = require('./utils/rooms.js')

module.exports = (app, rooms) => {
    var randomstring = require('randomstring')

    // Submit all settings to the lobby
    app.post('/create-game', (req, res) => {
        var room = new Room()

        //do stuff with options
        var info = {}
        if(req.body.players_per_team){
            info["playersPerTeam"] = req.body.players_per_team
        }

        if(req.body.numOfteams){
            info["numOfTeams"] = req.body.numOfteams
        }

        if(req.body.numOfIcons){
            info["numOfIcons"] = req.body.numOfIcons
        }

        res.clearCookie('player')
        //set user to owner of the game
        res.cookie('game_owner', 1, {
            secure: false,
            overwrite: true
        })


        room.setSettings(info)

        //generate code and then set key in room object
        var key = randomstring.generate(6)
        room.setKey(key)

        res.cookie('room', key, {
            secure: false,
            overwrite: true
        })

        //map room key to room object
        rooms[room.key] = room


        console.log(rooms)

        res.json(true)
    })
}
