module.exports = (app, rooms) => {
    // First page a player or room owner visits
    // app.get('/', (req, res) => {
    //     res.render('index')
    // })

    // app.get('/enter-room', (req, res) =>{
    //     res.render('enter-room')
    // })

    app.post('/enter-room', (req, res) => {
        console.log(req.body)
        if(req.body.room){
            
            //check if room exists
            if(rooms[req.body.room] == undefined){
                console.log("invalid key")
                // res.redirect('/enter-room')
                res.json(false)
            }

            //set cookie for room user is joinings
            res.cookie('room', req.body.room, {
                secure: false,
                overwrite: true
            })
            // res.redirect('/enter-name')
            res.json(true)
        }
    })

    // app.get('/enter-name', (req, res) => {
    //     res.render('enter-name')
    // })

    app.post('/enter-name', (req, res) => {
        if(req.body.name){
            //if name exists in room
            if(!rooms[req.cookies.room].hasPlayer(req.body.name)){

                //map a player to a room- only name and if connected for now
                var val = {name: req.body.name, connected: false, socketid: 0}
                rooms[req.cookies.room].addPlayer(req.body.name, val)

                res.cookie('player', req.body.name, {
                    secure: false,
                    overwrite: true
                })
                res.redirect('/lobby')
            }else{
                res.redirect('/enter-name')
            }
        }
    })

    
}
