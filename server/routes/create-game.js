const Room = require('./utils/rooms.js')

module.exports = (app, rooms) => {
    var randomstring = require('randomstring')

    // app.get('/create-game', (req, res) => {
    //     res.render('create-game')
    // })

    // Submit all settings to the lobby
    app.post('/api/create-game', (req, res) => {
        var room = new Room()

        //do stuff with options
        var info = {}
        if(req.body.players_per_team){
            info["playersPerTeam"] = req.body.players_per_team
        }

        if(req.body.numOfteams){
            info["numOfTeams"] = req.body.numOfteams
            //console.log(info.numOfTeams)
        }

        if(req.body.numOfIcons){
            info["numOfIcons"] = req.body.numOfIcons
            //console.log(info.numOfTeams)
        }

        // for (var key in info) {
        //     // do something with key|value
        //     console.log(info[key])
        // }
        // console.log(info)

        //set user to owner of the game
        res.cookie('game_owner', 1, {
            secure: false
        })

        room.setSettings(info)

        //generate code and then set key in room object
        var key = randomstring.generate(6)
        room.setKey(key)

        //map room key to room object
        rooms[room.key] = room


        console.log(rooms)
        // res.redirect('lobby')
        res.redirect('create-game')
    })
}
