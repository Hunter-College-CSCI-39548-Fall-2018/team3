import React from 'react'
import Countdown from './Countdown'

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
                {console.log("time in compoennt:", this.props.time)}
                <Countdown time={this.props.time}/>
            </div>
        )
    }
}

export default GameOwnerControls