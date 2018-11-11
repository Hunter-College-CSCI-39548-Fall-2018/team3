import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';

class Lobby extends React.Component{
    constructor(props){
    super(props)

      this.state = {socket: false, players: "", teams:[], code:""}
    }
    componentDidMount(){
        let code = Cookies.get("room")
        this.setState({code:code});
        this.shuffleBtn.focus();
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

    shuffleTeams = () => {
      let socket = this.state.socket
      socket.emit("shuffleTeams")

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

        socket.on("shuffledTeams", (data) => {
          console.log(data)
          this.setState({teams: data})

          // for(let i = 0; i < data.length(); i++){
          //   for(let i = 0; i < data[i].length(); i++){
          //
          //   }
          // }
        })
    }





    render(){
      return(
        <div>
          <div id='code'>code:
            <input type="text"
              ref={(input) => { this.shuffleBtn = input; }}
              value={this.state.code} autoFocus/>
          </div>
          <div id='players'>players: {this.state.players}</div>
          <div><button id="shuffle" onClick={this.shuffleTeams}>Shuffle Teams</button></div>

          <div id="teams">
            {this.state.teams}
          </div>
        </div>
      )
    }

}

export default Lobby
