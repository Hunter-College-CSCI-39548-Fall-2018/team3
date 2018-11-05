import React from 'react'
import io from 'socket.io-client';

class Lobby extends React.Component{
    constructor(props){
    super(props)

      this.state = {socket: false, players: ""}
    }
    componentDidMount(){
        fetch('http://localhost:3000/lobby', {
            method: 'GET',
            credentials: 'include'
        })
        //fetch is asynchronous, so need to set socket state and then do all stuff after
        .then((res) => {
            console.log("res status is", res.status)
            const socket = io.connect('http://localhost:3000/', {
                transports: ['websocket'],
                upgrade: false
            })

            this.setState({socket:socket})
            this.handleEvents()
         })
        .catch((err) => {
            console.log(err)
        })
        console.log("on first render?")
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
    }

    render(){
      return(
        <div>
          <div id='code'>code: </div>
          <div id='players'>players: {this.state.players}</div>
        </div>
      )
    }

}

export default Lobby
