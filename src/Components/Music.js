import React from 'react'
// import soundFile from "../static/sounds/Lullatone_-_Whistling_in_an_Office.mp3";
// import soundFile from "./Lullatone_-_Whistling_in_an_Office.mp3";

class Music extends React.Component {
    constructor(props) {
      super(props);
      // this.state = { 
        // play: false,
        // lobby: true,
        // url: "./Lullatone_-_Whistling_in_an_Office.mp3"
      // };
      // this.url = "./Lullatone_-_Whistling_in_an_Office.mp3";
      // console.log(this.state.url);
      this.audio = new Audio(this.props.url);
      this.audio.play();
    }
  
    componentWillUnmount(){
      this.audio.pause();
    }

    render() {
      return (
        <div>
          <span></span>
        </div>
      );
    }
  }
  
export default Music