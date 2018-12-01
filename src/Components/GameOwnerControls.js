import React from 'react'

class GameOwnerControls extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <div id='sequence'>
                    {/* {this.props.sequence} */}
                </div>
                <button onClick={this.props.handleShuffle.bind(this)}>test shuffle</button>
                <button onClick={this.props.startGame.bind(this)}>start game</button>
                {   
                    console.log("this is teams", this.props.teams)
                    // this.props.teams.map((team) => {
                    //     <li>1{team.sequence}</li>
                    // })
                }
            </div>
        )
    }
}

export default GameOwnerControls