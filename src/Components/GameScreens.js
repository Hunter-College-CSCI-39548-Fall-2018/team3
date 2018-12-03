import React from 'react'
import io from 'socket.io-client'
import Cookies from 'js-cookie';

class GameScreens extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {

        return(
        <div>
            <div className="row">
                <div className="col-md-6">
                    <div id="current-icon">
                    </div>

                    <div>
                        Team #
                    </div>

                    <div>
                        9/100
                    </div>
                </div>

                <div className="col-md-6">
                    <div id="current-icon">
                        </div>

                        <div>
                            Team #
                        </div>

                        <div>
                            10/100
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}
export default GameScreens