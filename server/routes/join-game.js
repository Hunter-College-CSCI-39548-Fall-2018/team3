const Player = require('./utils/player.js')

module.exports = (app, rooms) => {

    app.post('/enter-room', (req, res) => {
        if(req.body.room){
            //check if room exists
            if(rooms[req.body.room] === undefined){
                console.log("invalid key")
                res.json({keyValid:false})
            }
            else{
                if (rooms[req.body.room].start === false) {
                    res.clearCookie('room')
                    //set cookie for room user is joinings
                    res.cookie('room', req.body.room, {
                        secure: false,
                        overwrite: true,
                    })

                    res.clearCookie('game_owner')
                    //to signify that user who is joining is not game owner
                    res.cookie('game_owner', 0 , {
                        secured: false,
                        overwrite: true
                    })


                    console.log('completely find key')
                    console.log("Cookies: ", req.cookies)
                    res.json({keyValid:true})
                }
                else {
                    res.json({gameStart:true})
                }
            }
        }
    })

    app.post('/enter-name', (req, res) => {
        if(req.body.nickname){

            //if name exists in room
            if(!rooms[req.cookies.room].hasPlayer(req.body.nickname)){

                let player = new Player(req.body.nickname, 0)
                player.connected = false
                
                rooms[req.cookies.room].addPlayer(req.body.nickname, player)

                res.clearCookie('player')
                res.cookie('player', req.body.nickname, {
                    secure: false,
                    overwrite: true
                })

                res.json(true)

            }else{
                //player exists in room, tell client not to redirect
                res.json(false)
            }


        }
    })


}
