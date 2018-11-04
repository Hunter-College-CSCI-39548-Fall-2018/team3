// Allow a different host for dev, staging, and production environments
// const socket = io(document.location.protocol+'//'+document.location.host,{transports: ['websocket'], upgrade: false})
import openSocket from 'socket.io-client'
const socket = openSocket('localhost:3000')

function getUsers(){
    socket.on('get-curr-users', (curr_users) => {
        console.log('attempting to add current users')
        // for(var i = 0; i < curr_users.length; ++i){
        //     // div.append(" " + curr_users[i])

        //     players += (" " + curr_users[i])
        // }
    })
}

export {getUsers}



//.on - listen for changes in server (events)
