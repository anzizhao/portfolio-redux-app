import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import Board from '../components/board'
import GameOverDialog from '../components/game-over-dialog'
import {newGame} from '../actions'
import {isGameOver} from '../game'

const PlayGamePage = React.createClass({
    componentWillMount: function () {
        //const { dispatch } = this.props
        //dispatch( newGame())
    },
    render: function() {
        const {dispatch, game} = this.props
        const gameState = game.get('state')
        return (
            <div>
            <header>
            <div>
            <Link to="/mastermind/rules">Game Rules</Link>
            </div>
            </header>

            <div>
            <Board game={game} dispatch={dispatch} />
            {isGameOver(gameState) ?
                <GameOverDialog
            gameState={gameState}
            newGame={() => dispatch(newGame())}/>
            : null}
            </div>
            </div>
        )
    }
})

function mapStateToProps(state) {
    return {
        game: state.mastermind.game 
        //game: state.mastermind.get('game')
    }
}

const PlayGamePageContainer = connect(mapStateToProps)(PlayGamePage)

export default PlayGamePageContainer

module.exports = PlayGamePageContainer
