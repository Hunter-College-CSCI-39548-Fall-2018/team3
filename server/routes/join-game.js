module.exports = (app, rooms) => {

    app.post('/enter-room', (req, res) => {
        console.log("Joined room", req.body.room)
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
                console.log('completely find key')

                if(req.cookies.room){
                    console.log("Room cookie was successfully made")
                    res.json(true)
                }
            }
        }
    })

    app.post('/enter-name', (req, res) => {
        console.log("Nickname is", req.body.nickname);
        if(req.body.nickname){
            console.log("room stored in cookies: ", req.cookies.room)
            
            //if name exists in room
            if(!rooms[req.cookies.room].hasPlayer(req.body.name)){

                //map a player to a room- only name and if connected for now
                var val = {name: req.body.name, connected: false, socketid: 0}
                rooms[req.cookies.room].addPlayer(req.body.name, val)

                res.clearCookie('player')
                res.cookie('player', req.body.name, {
                    secure: false,
                    overwrite: true
                })
                
                if(req.cookies.player){
                    console.log("Player cookie was successfully made")
                    res.json(true)
                }
            }else{
                //player exists in room, tell client not to redirect
                res.json(false)
            }
            
          
        }
    })


}
