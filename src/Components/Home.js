import React from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'

const Background = styled.div`
    background-color: #C2DFFF;
    height: 100vh;
    width: 100vw;
    text-align: center;
    padding: 20px
`

const Button = styled.button`
    padding: 10px;
    margin: 10px;
    background-color: white;
    border-width: 2px;
    box-shadow: none;
    border-color: black;
    color: black;

`
const Footer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 15vw;
    background-color: #222;
`
const Menu = styled.div`
    display: inline-flex;
`

const LogoSpace = styled.div`

`
const Logo = styled.img`
    width: 200px;
    height: 200px;
`
var i = Math.floor(Math.random() * (55) )
class Home extends React.Component{
    constructor(props){
        super(props)
    }

    testGameAsGameOwner = () => {
        Cookies.set('game_owner', 1)
        Cookies.set('room', "test")

    }
    
    testGameAsPlayer = () => {
        Cookies.set('game_owner', 0)
        Cookies.set('room', "test")
        Cookies.set('player', "TEST" + i)
    }
    
    render(){
        return(
          <Background>
            
            <LogoSpace>
                <Logo src="https://source.unsplash.com/random/800x800"/>
                
                {/* <h1> What you want </h1>

                <p>The about page and stuff whatever you want to add</p> */}
            </LogoSpace>

            <Menu>
                <a href='/create-game'>
                    <Button id='create-game'>
                        Create a Game
                    </Button>
                </a>

                <br/>
                
                <a href='/enter-room'>
                    <Button id='join-room'>
                        Join a Room
                    </Button>
                </a>
            </Menu>

            <br/>
            <a href='/game'>
                <button onClick={this.testGameAsGameOwner.bind(this)}>Test game as game owner</button>
            </a>

            <a href= '/game'>
                <button onClick={this.testGameAsPlayer.bind(this)}>Test game as player</button>
            </a>

                
            {/* <Footer>

            </Footer> */}
          </Background>
        )
    }
}

export default Home
