// var socket = io('localhost:5000')


class SockObject{
    constructor(sock){
        this.sock = sock
    }
    getCurrUsers(){
        let players = ""

        this.sock.on('get-curr-users', (curr_users) => {
            console.log('attempting to add current users')
            for(var i = 0; i < curr_users.length; ++i){
                // div.append(" " + curr_users[i])

                players += (" " + curr_users[i])
            }
        })

        return players
    }

    listenForUsers(){
        let player = ""

        this.sock.on('new-player', (name) => {
            console.log('attempting to add new users')

            console.log('received new player')
            // div.append(" " + name)
            player += (" " + name)

            
        })
        return player
    }
}

export default SockObject

