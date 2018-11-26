import React from 'react'
//import "./daydream.css"

class Home2 extends React.Component{
    constructor(props){

      super(props)

    }

    render(){
        return(
            <div className="jumbotron bg-primary text-center text-white mb-0 radius-0">
                <div className="container">
                    <h1 className="display-3 text-white text-handwriting text-uppercase">Programmers never</h1>
                    <h1 className="display-1 text-success text-uppercase title-margin-fix">Daydream</h1>
                    <div>
                        <a href="#!"
                            className="btn btn-outline-light btn-lg m-2 btn-hover-text-primary">
                        <span>A Button</span>
                        </a>
                        <a href="#!"
                            className="btn btn-outline-light btn-hover-text-primary btn-lg m-2">
                        <span>Another button</span>
                        </a>
                    </div>
                </div>
            </div>


        )
    }
}
export default Home2