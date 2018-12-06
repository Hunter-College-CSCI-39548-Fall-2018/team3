import React from 'react'
//import "./daydream.css"

class Home extends React.Component{
    constructor(props){

      super(props)

    }

    testGameAsGameOwner = () => {
        Cookies.set('game_owner', 1)
        Cookies.set('room', "test")

    }
    
    testGameAsPlayer = () => {
        Cookies.set('game_owner', 0)
        Cookies.set('room', "test")
        Cookies.set('player', "TEST" + i)
    }
    
    render(){
        return(
            <div id="header" style={{backgroundColor:"#e1f7d5"}} className="d-flex align-items-center flex-column justify-content-center h-100" id="header">
                <h1 id="logo" className="display-4">BISCUIT.</h1>
                <div className="btn-group">
                    <a href="/create-game" className="btn btn-primary btn-space">Create a Game</a>
                    <a href="/enter-room" className="btn btn-success">Join a Room</a>
                </div>
            </div>
        )
    }
}
export default Home