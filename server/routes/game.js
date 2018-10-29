module.exports = (app, io, connected_members) => {
    // app.get('/test-player', (req, res) => {
    //     var game_owner = 0

    //     res.render('test-game', {game_owner: game_owner})
    // })

    // app.get('/test-game', (req, res) => {

    //     // var players = []
    //     // for(key in connected_members){
    //     //     if(connected_members[key] == req.cookies.room){
    //     //         players.push(key)
    //     //         console.log(players)
    //     //     }
    //     // }
    //     //find game owner

    //     var game_owner = 1/*req.cookies.game_owner*/
    //     var sequence = "AABBBAADDERPOK"

    //     var curr_seq = -1

    //     function nextInSequence(seq){
    //         curr_seq++
    //         console.log("curr seq:", curr_seq)

    //         return seq[curr_seq]
    //     }
        
    //     io.sockets.on('connect', (socket) => {
    //         socket.on('correct-command', () => {       

    //             //supposed to do only to room, but broadcast for now
    //             socket.broadcast.emit('next-in-sequence', nextInSequence(sequence))
    //         })
            
    //         socket.on('wrong-command', () => {
    //             console.log('response of wrong command at least')
    //             //some sort of penalty 
    //         })
    //     })
        
    //     res.render('test-game', {game_owner: game_owner})
    // })
}