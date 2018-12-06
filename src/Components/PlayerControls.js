import React from 'react'

class PlayerControls extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div style={{height:"100%"}}>
                <h1 style={{width:"100%", height:"10%"}}><strong><i>You're on team {this.props.team}</i></strong></h1>
                
                <div id="icons" style={{float:"left", height:"90%",width:"100%"}}>
                {
                    
                    this.props.icons.map((icon, i) => {
                        {console.log("icon ", icon)}
                        return (
                            
                            <div className="btn-container" key={i}>
                                <button className="btn-controller" onClick={this.props.handleCommand.bind(this, icon.index)}><img style={{height:"128px"}} src={'/images/' + icon.icon} /></button>
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