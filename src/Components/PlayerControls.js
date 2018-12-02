import React from 'react'

class PlayerControls extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <div id="team">{this.props.team}</div>
                
                <div id="icons">
                {
                    
                    this.props.icons.map((icon, i) => {
                        return (
                            <div key={i}>
                                <button onClick={this.props.handleCommand.bind(this, icon)}>{icon}</button>
                            </div>
                        )
                    })
                }
                </div>
                
            </div>
        )
    }
}

export default PlayerControls