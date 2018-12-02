import React from 'react'
<<<<<<< HEAD
//import "./daydream.css"

=======
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
>>>>>>> 669c4990cebde0f35138f0574dfbc2381888d54c
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

            <div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white" id="header">
                <h1 id="logo" className="display-4">BISCUIT.</h1>
                <div className="btn-group">
                    <a href="/create-game" className="btn btn-primary btn-space">Create a Game</a>
                    <a href="/enter-room" className="btn btn-success">Join a Room</a>
                </div>
            </div>

<<<<<<< HEAD
=======
            <Menu>
                <a href='/create-game'>
                    <Button id='create-game'>
                        Create a Game
                    </Button>
                </a>
>>>>>>> 669c4990cebde0f35138f0574dfbc2381888d54c


<<<<<<< HEAD
=======
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
>>>>>>> 669c4990cebde0f35138f0574dfbc2381888d54c
        )
    }
}
export default Home