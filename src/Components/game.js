// var socket = io('localhost:5000')


class SockObject{
    constructor(sock){
        this.sock = sock
    }

    listenForUsers(div){
        this.sock.on('get-curr-users', (curr_users) => {
            for(var i = 0; i < curr_users.length; ++i){
                // div.append(" " + curr_users[i])
                div += (" " + curr_users[i])
            }
        })

        this.sock.on('new-player', (name) => {
            console.log('received new player')
            // div.append(" " + name)
            div += (" " + name)

        })
    }
}

export default SockObject

