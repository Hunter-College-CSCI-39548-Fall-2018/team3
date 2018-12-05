import React from 'react'

class Countdown extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        return(
            <div>
                Time left: {this.props.time.min}
                :
                {this.props.time.sec < 10? '0' + this.props.time.sec : this.props.time.sec}
            </div>
        )
        
    }
}

export default Countdown