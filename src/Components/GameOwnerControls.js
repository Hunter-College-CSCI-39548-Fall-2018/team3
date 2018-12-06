import React from 'react'
import GameScreensTwo from './GameScreensTwo';
import GameScreensThree from './GameScreensThree';
import GameScreensFour from './GameScreensFour';
import Countdown from './Countdown'

class GameOwnerControls extends React.Component{
    constructor(props){
        super(props)
    }
    

    render(){
        if(this.props.teams.length === 2){
            return (<GameScreensTwo time={this.props.time} teams={this.props.teams}/>)
        }
        else if(this.props.teams.length === 3){
            return (<GameScreensThree time={this.props.time} teams={this.props.teams}/>)
        }

        return(
            <div>
                <h1><strong>Waiting to Connect...</strong></h1>
            </div>
        )
    }
}

export default GameOwnerControls