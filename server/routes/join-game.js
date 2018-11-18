module.exports = (app, rooms) => {

    app.post('/enter-room', (req, res) => {

        //console.log("Joined room", req.body.room)
        if(req.body.room){

            //check if room exists
            if(rooms[req.body.room] === undefined){
                console.log("invalid key")
                res.json(false)
            }
            else{
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
                res.json(true)

            }
        }
    })

    app.post('/enter-name', (req, res) => {
        if(req.body.nickname){

            //if name exists in room
            if(!rooms[req.cookies.room].hasPlayer(req.body.nickname)){

                //map a player to a room- only name and if connected for now
                var val = {name: req.body.nickname, connected: false, socketid: 0}
                rooms[req.cookies.room].addPlayer(req.body.nickname, val)

                if(rooms[req.cookies.room].hasPlayer(req.body.nickname)){
                    console.log('successfully added player to room')
                }

                res.clearCookie('player')
                res.cookie('player', req.body.nickname, {
                    secure: false,
                    overwrite: true
                })

                console.log("Player cookie was successfully made")
                res.json(true)

            }else{
                //player exists in room, tell client not to redirect
                res.json(false)
            }


        }
    })


}
