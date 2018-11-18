import React from 'react'
import io from 'socket.io-client'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Lobby extends React.Component{
    constructor(props){
    super(props)

      this.state = {
        players: "",
        room: "",
        socket: false,
        connected: true
      }
    }

    componentDidMount(){
        let code = Cookies.get("room")
        this.setState({code:code});

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

    setCurrUsers = (curr_users) => {
        let players = ""
            console.log('attempting to add current users')

            for(let key in curr_users){
                players += (" " + key)
            }

            this.setState({players: players})
    }

    handleEvents = () => {
        let socket = this.state.socket

        socket.on('get-curr-users', (curr_users) => {
            this.setCurrUsers(curr_users)
        })

        socket.on('new-player', (name) => {
          console.log('received new player')
          this.setState({players: this.state.players + " " + name})
        })

        socket.on('player-disconnected', (curr_users) => {
            console.log("player disocnnected");
            this.setCurrUsers(curr_users)
        })

        socket.on('force-disconnect', () => {
            this.setState({connected: false})
        })

        let room = Cookies.get('room')
        console.log("room cookie ", room)
        this.setState({room: room})
    }

    render(){
        if(this.state.connected){
            return(
                <div>
                <div id='code'>code: {this.state.room}</div>
    
                <div id='players'>players: {this.state.players}</div>
                </div>
            )
        }
        else{
            console.log("disconnected should have what");

            //if game owner disconnected, disconnect all players in lobby
            return(<Redirect to='/'></Redirect>)
        }
        
    }

}

export default Lobby
