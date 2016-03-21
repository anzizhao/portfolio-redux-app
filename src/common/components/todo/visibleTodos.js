import {  setVisibilityFilter, VisibilityFilters } from '../../actions/todo/actions'
import * as todoActions  from '../../actions/todo/actions'
import { eFilename }  from '../../constants'

import {fromJS, Map, List} from 'immutable'

// sort rule:   src file ->  complete status -> metric -> tag -> date -> key word 
export default function selectTodos(state) { 
   const  { visibilityFilter, sort, selectFiles, selectTags, filter}  = state  
   return _selectTodos(state.todos, visibilityFilter, sort, selectFiles, selectTags, filter)
}

export function _selectTodos(_todos, visibilityFilter, sort, selectFiles, selectTags, filter) { 
   let todos = selectFile( _todos, selectFiles) 
       todos = filterItemStatus(todos, visibilityFilter)
       todos = filterMertics (todos, sort )
       todos = filterTags(todos, selectTags)
       todos = filterText (todos, filter.get("todoText"))
       return todos
}


// src file 
function selectFile (todos, files) {
    //select file 数组为空, 返回为空
    if ( ! files ||  files.size === 0) {
        return List() 
        //return todos 
    } else {
        // 一些特殊的值 全部 没有源文件的
        let tmp 
        tmp = files.find(file => {
            return file.text === eFilename.all 
        }) 
        if ( tmp ) {
            return todos 
        }
        return todos.filter(todo =>{
            let tf = todo.get('fromfile')
            let result = files.find(f =>{
                return tf === f.text 
            })
            return result ? true: false
        })

        //return file.text === fromfile || fromfile === eFilename.browser || fromfile === '' 
    }
}

function filterMertics (todos, cmd) {
    let cmds = todoActions.sorts   
    switch (cmd) {
        case cmds.SORT_IMPORTANCE_UP:
            return todos.sort((a, b)=>{
                return a.get("importance") - b.get("importance")
        })
        case cmds.SORT_IMPORTANCE_DOWN:
            return todos.sort((a, b)=>{
                return b.get("importance") - a.get("importance")
        })
        case cmds.SORT_URGENCY_UP:
            return todos.sort((a, b)=>{
                return a.get("urgency") - b.get("urgency")
        })
        case cmds.SORT_URGENCY_DOWN:
            return todos.sort((a, b)=>{
                return b.get("urgency") - a.get("urgency")
        })
        case cmds.SORT_DIFFICULTY_UP:
            return todos.sort((a, b)=>{
                return a.get("difficulty") - b.get("difficulty")
        })
        case cmds.SORT_DIFFICULTY_DOWN:
            return todos.sort((a, b)=>{
                return b.get("difficulty") - a.get("difficulty")
        })
        //cmds.SORT_ORIGIN
        default: 
            return todos.sort((a, b)=>{
                return b.get("id") - a.get("id")
        })
    }
}


function filterItemStatus (todos, filter) { 
   switch (filter) {
       case VisibilityFilters.SHOW_COMPLETED:
           return   todos.filter(todo => todo.get("completed"))  
       case VisibilityFilters.SHOW_ACTIVE:
           return  todos.filter(todo => !todo.get("completed") ) 

       case VisibilityFilters.SHOW_ALL:
       default:
           return todos
   }
}

function filterTags (todos, selectTags ) {
    if(selectTags.size === 0) {
        return todos 
    }
    return todos.filter(todo =>{
        let result = todo.get("tags").find(tag => {
            let result = selectTags.find( selTag => selTag.text === tag.text ) 
            return result ? true: false 
        })
        return result ? true: false 
    })
}

function filterText (todos, text ) {
    if(!text||  text === '' ) {
        return todos 
    }
    let reg = new RegExp( text )

    return todos.filter(todo => reg.test( todo.get('text') )
    )
}
