import React from 'react'
//import "./daydream.css"

class HomeDesign extends React.Component{
    constructor(props){

      super(props)

    }

    render(){
        return(

            <div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white" id="header">
                <h1 id="logo" className="display-4">BISCUIT.</h1>
                <div className="btn-group">
                    <a href="/create-game-design" className="btn btn-primary btn-space">Create a Game</a>
                    <a href="/enter-room-design" className="btn btn-success">Join a Room</a>
                </div>
            </div>



        )
    }
}
export default HomeDesign