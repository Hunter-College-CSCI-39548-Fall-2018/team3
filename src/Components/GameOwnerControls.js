import React from 'react'
<<<<<<< HEAD
import GameScreensTwo from './GameScreensTwo';
import GameScreensThree from './GameScreensThree';
import GameScreensFour from './GameScreensFour';
=======
import Countdown from './Countdown'
>>>>>>> 8f14334a0143da9ba2bf28b64e124e7be59a555c

class GameOwnerControls extends React.Component{
    constructor(props){
        super(props)
    }
    

    render(){
        return(
            <div>
                <div id='curr-icon'>
                    { console.log("this is teams", this.props.teams)}
                    
                    {console.log("this is teams", this.props.teams)}
                    <GameScreensFour />
                </div>
                <button onClick={this.props.startGame.bind(this)}>start game</button>
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

<<<<<<< HEAD
                } 
=======
                    }
                </div>
                {console.log("time in compoennt:", this.props.time)}
                <Countdown time={this.props.time}/>
                <button onClick={this.props.startGame.bind(this)}>start game</button>
>>>>>>> 8f14334a0143da9ba2bf28b64e124e7be59a555c

            </div>
        )
    }
}

export default GameOwnerControls