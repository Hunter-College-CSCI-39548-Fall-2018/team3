<<<<<<< HEAD
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
=======
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
>>>>>>> 5b8997184c3c6b0b7472f6cef2872f76cae518a2
