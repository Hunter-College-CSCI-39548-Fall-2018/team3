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
        else if(this.props.teams.length === 4){
            return (<GameScreensFour time={this.props.time} teams={this.props.teams}/>)
        }

        return(
            <div>
                <div id='teams'>
                    { console.log("this is teams", this.props.teams)}
                    
                    
                </div>
                {
                    this.props.teams.map((team, i) => {
                        console.log("this is score", team.score)
                        return(
                            <div key={i}>
                                <div>input: {team.curr_icon} </div>
                                <div>team: {i} score: {team.score}</div>
                                <br/>
                            </div>
                        )
                    })


                } 

                {console.log("time in compoennt:", this.props.time)}
                <Countdown time={this.props.time}/>

            </div>
        )
    }
}

export default GameOwnerControls