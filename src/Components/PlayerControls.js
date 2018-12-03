import React from 'react'

class PlayerControls extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div style={{height:"100%"}}>
                <div id="team">{this.props.team}</div>
                
                <div id="icons" style={{float:"left", height:"100%",width:"100%"}}>
                {
                    
                    this.props.icons.map((icon, i) => {
                        return (
                            <div className="btn-container" key={i}>
                                <button className="btn-controller" onClick={this.props.handleCommand.bind(this, icon)}>{icon}</button>
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