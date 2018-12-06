import React from 'react'

class Countdown extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        return(
            <div style={{textAlign: "center", width: "100%", padding: "20px"}}>
                <h1 style={{ fontSize : "60px"}}>
                    <strong> Time left [ {this.props.time.min}:
                    {this.props.time.sec < 10? '0' + this.props.time.sec : this.props.time.sec} ]
                    </strong>
                </h1>
            </div>
        )
        
    }
}

export default Countdown