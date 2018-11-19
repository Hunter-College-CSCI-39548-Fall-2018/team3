import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';

class Lobby extends React.Component{
    constructor(props){

      super(props)
      this.state = {
        players: "",
        room: "",
        teams: [],
        code: "",
        socket: false,
        timeRem: 10
      }
      this.game_owner = Cookies.get("game_owner")
      console.log(this.game_owner);

    }
    componentDidMount(){
        let code = Cookies.get("room");
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

    shuffleTeams = () => {
      let socket = this.state.socket
      socket.emit("shuffle-teams")

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
            let players = ""
            console.log('attempting to add current users')

            for(let key in curr_users){
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

        socket.on('player-disconnected', (curr_users) => {
            console.log("player disocnnected");
            this.setCurrUsers(curr_users)
        })

        socket.on("shuffled-teams", (data) => {
          console.log(data)
          this.setState({teams: data.team})

          // for(let i = 0; i < data.length(); i++){
          //   for(let i = 0; i < data[i].length(); i++){
          //
          //   }
          // }

          let room = Cookies.get('room')
        console.log("room cookie ", room)
        this.setState({room: room})
        })

        socket.on('time-left', (time) => {
          this.setState({timeRem: time});
        });

    }


    

    startTimer = ()=>{
      let socket = this.state.socket
      // console.log("The socket is", this.socket)
      socket.emit("start-time", {room:this.state.code});
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
         <div id = 'timeDisplay'>Time Until Start: {this.state.timeRem} </div>
         {this.game_owner == '1' ? <button onClick={this.startTimer}>Start Timer</button> : ""}
        </div>
      )
    }

}

export default Lobby
