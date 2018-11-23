const Room = require('./utils/rooms.js')

module.exports = (app, rooms) => {
    var randomstring = require('randomstring')

    // Submit all settings to the lobby
    app.post('/create-game', (req, res) => {
        var room = new Room()

        //do stuff with options
        var info = {}
        if(req.body.players_per_team){
            info["players_per_team"] = req.body.players_per_team
        }
        
        if(req.body.num_teams){
            info["num_teams"] = req.body.num_teams
        }

        if(req.body.num_icons){
            info["num_icons"] = req.body.num_icons
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

        res.clearCookie('room')
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
