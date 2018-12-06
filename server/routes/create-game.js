const Room = require('./utils/rooms.js')

module.exports = (app, rooms) => {
    var randomstring = require('randomstring')
 
    // Submit all settings to the lobby
    app.post('/create-game', (req, res) => {
        var room = new Room() 

        //do stuff with options
        var info = {}

        // Insert the settings for the specific Room Object
        if(req.body.num_teams){
            info["num_teams"] = req.body.num_teams
        }

        if(req.body.time){
            info["time"] = req.body.time
        }

        room.setSettings(info)

        // Resstting the player cookie
        res.clearCookie('player')
        //set user to owner of the game
        res.cookie('game_owner', 1, {
            secure: false,
            overwrite: true,
        })


        //generate code and then set key in room object
        var key = randomstring.generate(6)
        room.setKey(key)

        res.clearCookie('room')
        console.log("cookie for key has been set", key)
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
