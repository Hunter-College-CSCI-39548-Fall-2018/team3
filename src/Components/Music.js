import React from 'react'
// import soundFile from "../static/sounds/Lullatone_-_Whistling_in_an_Office.mp3";
// import soundFile from "./Lullatone_-_Whistling_in_an_Office.mp3";

class Music extends React.Component {
    constructor(props) {
      super(props);
      this.audio = new Audio(this.props.url);
      this.audio.loop = true;
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