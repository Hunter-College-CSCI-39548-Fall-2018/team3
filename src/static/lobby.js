// Allow a different host for dev, staging, and production environments
// const socket = io(document.location.protocol+'//'+document.location.host,{transports: ['websocket'], upgrade: false})

const socket = io('localhost:5000')
var players = document.getElementById('players')

var sock = new SockObject(socket)

//listen for players joining and append them to a div
sock.listenForUsers(players)


//.on - listen for changes in server (events)
