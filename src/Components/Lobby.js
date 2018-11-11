import React from 'react'
<<<<<<< HEAD
import io from 'socket.io-client'
=======
import io from 'socket.io-client';
<<<<<<< HEAD
>>>>>>> ab097aff910b59256e9863f31c3f841cc98a316b
import Cookies from 'js-cookie'
=======
import Cookies from 'js-cookie';
>>>>>>> c6225542bff8766c8ecdeaf1da21aa23dadc20f1

class Lobby extends React.Component{
    constructor(props){
    super(props)

<<<<<<< HEAD
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
=======
      this.state = {socket: false, players: "", teams:[], code:""}
>>>>>>> c6225542bff8766c8ecdeaf1da21aa23dadc20f1
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

<<<<<<< HEAD
        let room = Cookies.get('room')
        console.log("room cookie ", room)
        this.setState({room: room})
=======
        socket.on("shuffledTeams", (data) => {
          console.log(data)
          this.setState({teams: data})

          // for(let i = 0; i < data.length(); i++){
          //   for(let i = 0; i < data[i].length(); i++){
          //
          //   }
          // }
        })
>>>>>>> c6225542bff8766c8ecdeaf1da21aa23dadc20f1
    }





    render(){
      return(
        <div>
<<<<<<< HEAD
<<<<<<< HEAD
          <div id='code'>code: {this.state.room}</div>
=======
          <div id='code'>room code: <span>{this.state.room}</span></div>
>>>>>>> ab097aff910b59256e9863f31c3f841cc98a316b
=======
          <div id='code'>code:
            <input type="text"
              ref={(input) => { this.shuffleBtn = input; }}
              value={this.state.code} autoFocus/>
          </div>
>>>>>>> c6225542bff8766c8ecdeaf1da21aa23dadc20f1
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
