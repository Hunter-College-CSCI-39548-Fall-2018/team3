import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000/', {
    transports: ['websocket'],
    upgrade: false
})

export function getCommand(command){
    console.log("called the func")

    socket.emit('get-command', command)
    socket.emit('test', "pppppp")
}

export default getCommand