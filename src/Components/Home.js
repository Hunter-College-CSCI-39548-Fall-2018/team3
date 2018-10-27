import React from 'react'

class Home extends React.Component{
    constructor(props){
        super(props)
    }

    LobbyRoom(event){
    }

    render(){
        return(
          <div>
            <h1> What you want </h1>

            <p>The about page and stuff whatever you want to add</p>

            <br/>

            <a href='/create-game'><button id='create-game'>Create a Game</button></a>

            <br/>

            <a href='/enter-room'><button id='join-room'>Join a Room</button></a>
            <br/>
            <a href='/test-game'><button>Test Game</button></a>
            <a href='/test-player'><button>Test Player</button></a>
          </div>
        )
    }
}

export default Home
