module.exports = (app, rooms) => {
    // First page a player or room owner visits
    // app.get('/', (req, res) => {
    //     res.render('index')
    // })

    // app.get('/enter-room', (req, res) =>{
    //     res.render('enter-room')
    // })

    app.post('/enter-room', (req, res) => {
        console.log(req.body.room)
        if(req.body.room){

            //check if room exists
            if(rooms[req.body.room] === undefined){
                console.log("invalid key")
                res.send(false)
            }
            else{
                //set cookie for room user is joinings
                res.cookie('room', req.body.room, {
                    secure: false,
                    overwrite: true,
                })
                console.log('completely find key')
                res.send(true)
            }
        }
    })

    // app.get('/enter-name', (req, res) => {
    //     res.render('enter-name')
    // })

    app.post('/enter-name', (req, res) => {
        console.log(req.body.nickname);
        if(req.body.nickname){
            console.log("room stored in cookies: ", req.cookies.room)

            //if name exists in room
            if(!rooms[req.cookies.room].hasPlayer(req.body.name)){

                //map a player to a room- only name and if connected for now
                var val = {name: req.body.name, connected: false, socketid: 0}
                rooms[req.cookies.room].addPlayer(req.body.name, val)

                res.cookie('player', req.body.name, {
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
