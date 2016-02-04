import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
var {storeTodoState, exportFile } = require('../../util')

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO, DEL_TODO, SAVE_TODO } from '../../actions/todo/actions'

const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

function todo(state, action) {
    switch (action.type) {
        case ADD_TODO:
            return {
            id: action.id,
            text: action.text,
            completed: false
        }
        case COMPLETE_TODO:
            if (state.id !== action.id) {
            return state
        }
        return {
            ...state,
            completed: true
        }
        default:
            return state
    }
}

function todos(state = [], action) {
    let db = {};
    switch (action.type) {
        case INIT_TODO:
                return action.todos

        case EXPORT_TODO:
            const jsonFile = JSON.stringify(state);
            const filename = `todo_${ new Date().toLocaleDateString() }.json`;
            exportFile(jsonFile, filename);
            return state;

        case ADD_TODO:
            db = [
                todo(undefined, action),
        ...state
            ]
            storeTodoState(db);
            return db;

        case DEL_TODO:
            db = state.filter((item)=>{ return item.id == action.id ? false: true } ) 
            storeTodoState(db);
            return db;

        case SAVE_TODO:
            let index = state.findIndex((ele, index, arr) => {
                                if ( ele.id === action.item.id )  {
                                    return true
                                }
                                return false
            })
            let changeItem = Object.assign({}, state[index]) 
            changeItem.text = action.item.text
            db = [
                ...state.slice(0, index),
                changeItem,
                ...state.slice(index+1),
            ]
            storeTodoState(db);
            return db;

        case COMPLETE_TODO:
            db = state.map(t =>
                             todo(t, action)
                            )
            storeTodoState(db);
            return db;
        
        default:
            return state
    }
}


const todoApp = combineReducers({
    visibilityFilter,
    todos: undoable(todos, { filter: distinctState() })
})

export default todoApp
