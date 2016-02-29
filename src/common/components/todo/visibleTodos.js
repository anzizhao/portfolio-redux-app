import {  setVisibilityFilter, VisibilityFilters } from '../../actions/todo/actions'
import * as todoActions  from '../../actions/todo/actions'



function selectFile (todos, fromfile) {
    if ( fromfile  === '') {
        return todos 
    } else {
        return todos.filter(item => {
            return item.fromfile === fromfile 
        }) 
    }
}

function sortTodos (todos, cmd) {
    let cmds = todoActions.sorts   
    switch (cmd) {
        case cmds.SORT_IMPORTANCE_UP:
            return todos.sort((a, b)=>{
                return a.importance - b.importance 
        })
        case cmds.SORT_IMPORTANCE_DOWN:
            return todos.sort((a, b)=>{
                return b.importance - a.importance 
        })
        case cmds.SORT_URGENCY_UP:
            return todos.sort((a, b)=>{
                return a.urgency- b.urgency
        })
        case cmds.SORT_URGENCY_DOWN:
            return todos.sort((a, b)=>{
                return b.urgency- a.urgency
        })
        case cmds.SORT_DIFFICULTY_UP:
            return todos.sort((a, b)=>{
                return a.difficulty - b.difficulty
        })
        case cmds.SORT_DIFFICULTY_DOWN:
            return todos.sort((a, b)=>{
                return b.difficulty - a.difficulty
        })
        //cmds.SORT_ORIGIN
        default: 
            return todos.sort((a, b)=>{
                return b.id - a.id
        })
    }
}


export default function selectTodos(_todos, filter, sort, selectedFile ) { 
   const todos = selectFile(_todos, selectedFile) 
   switch (filter) {
       default:
           case VisibilityFilters.SHOW_ALL:
           return sortTodos( todos, sort)
       case VisibilityFilters.SHOW_COMPLETED:
           return sortTodos(  todos.filter(todo => todo.completed) , sort)
       case VisibilityFilters.SHOW_ACTIVE:
           return sortTodos(todos.filter(todo => !todo.completed), sort)
   }
}

