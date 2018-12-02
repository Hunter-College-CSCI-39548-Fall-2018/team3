import React from 'react'

class GameOwnerControls extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <div id='curr-icon'>
                    {console.log("this is teams", this.props.teams)}
                    {
                    this.props.teams.map((team, i) => {
                        console.log("this is score", team.score)
                        return(
                            <div key={i}>
                                <div>input: {team.curr_icon} </div>
                                <div>team: {i} {team.score}</div>
                                <br/>
                            </div>

                        )
                    })

                    }
                </div>
                <button onClick={this.props.handleShuffle.bind(this)}>test shuffle</button>
                <button onClick={this.props.startGame.bind(this)}>start game</button>

            </div>
        )
    }
}

export default GameOwnerControls