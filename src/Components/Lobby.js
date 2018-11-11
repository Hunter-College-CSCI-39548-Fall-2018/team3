import React from 'react'
<<<<<<< HEAD
import io from 'socket.io-client'
=======
import io from 'socket.io-client';
>>>>>>> ab097aff910b59256e9863f31c3f841cc98a316b
import Cookies from 'js-cookie'

class Lobby extends React.Component{
    constructor(props){
    super(props)

      this.state = {
<<<<<<< HEAD
            socket: false, 
            players: "",
            room: ""
        }
=======
        players: "",
        room: "",
        socket: false
      }

>>>>>>> ab097aff910b59256e9863f31c3f841cc98a316b
    }
    componentDidMount(){
        fetch('http://localhost:3000/lobby', {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => {
            console.log("res status is", res.status)
            const socket = io.connect('http://localhost:3000/', {
                transports: ['websocket'],
                upgrade: false
            })

            //everything is asynchronous, so need to set socket state and then do all stuff after using callback
            this.setState({socket:socket}, () => {
                this.handleEvents()
            })
         })
        .catch((err) =>console.log(err))
    }

    handleEvents = () => {
        let socket = this.state.socket

        socket.on('get-curr-users', (curr_users) => {
            let players = ""
            console.log('attempting to add current users')

            for(let key of curr_users){
                players += (" " + key)
            }

            this.setState({players: players})
        })

        socket.on('new-player', (name) => {
          let player = ""
          console.log('received new player')
          player += (" " + name)

          this.setState({players: this.state.players + player})
        })

        let room = Cookies.get('room')
        console.log("room cookie ", room)
        this.setState({room: room})
    }

    render(){
      return(
        <div>
<<<<<<< HEAD
          <div id='code'>code: {this.state.room}</div>
=======
          <div id='code'>room code: <span>{this.state.room}</span></div>
>>>>>>> ab097aff910b59256e9863f31c3f841cc98a316b
          <div id='players'>players: {this.state.players}</div>
        </div>
      )
    }

}

export default Lobby
