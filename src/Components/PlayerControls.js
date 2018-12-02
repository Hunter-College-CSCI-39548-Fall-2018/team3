import React from 'react'

class PlayerControls extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <div id="team">{this.props.team}</div>
                {
                    this.props.icons.map(i => {
                        <button onClick={this.props.handleCommand.bind(this, i)}>{i}</button>
                    })
                }
            </div>
        )
    }
}

export default PlayerControls