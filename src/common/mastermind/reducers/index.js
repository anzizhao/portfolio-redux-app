import game from './game'
import replay from './replay'

export default function (state = {}, action ) {
    return {
        game:game(state.game, action),
        replay: replay(state.replay, action)
    }
}
