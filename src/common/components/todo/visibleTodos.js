import {  setVisibilityFilter, VisibilityFilters } from '../../actions/todo/actions'
import * as todoActions  from '../../actions/todo/actions'
import { eFilename }  from '../../constants'

import {fromJS, Map, List} from 'immutable'


function selectFile (todos, files) {
    //select file 数组为空, 返回全部
    if ( files.size === 0) {
        return todos 
    } else {
        // 一些特殊的值 全部 没有源文件的
        let tmp 
        tmp = files.find(file => {
            return file.text === eFilename.all 
        }) 
        if ( tmp ) {
            return todos 
        }

        // 这里竟然是可以改掉的?  
        //files.forEach(file => {
            //if ( file.text === '存放浏览器项' ) {
                //file.text = '' 
            //}
        //}) 
        return todos.filter(item =>{
            return files.some(file => {
                let fromfile = item.get('fromfile')
                // 不知道为何  会将‘’ 变为存放浏览器项  可变项的不好处
                return file.text === fromfile || fromfile === eFilename.browser || fromfile === '' 
            }) 
        })
    }
}

function sortTodos (todos, cmd) {
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


export default function selectTodos(_todos, filter, sort, selectedFiles ) { 
   const todos = selectFile(_todos, selectedFiles) 
   switch (filter) {
       default:
           case VisibilityFilters.SHOW_ALL:
           return sortTodos( todos, sort)
       case VisibilityFilters.SHOW_COMPLETED:
           return sortTodos(  todos.filter(todo => todo.get("completed") ) , sort)
       case VisibilityFilters.SHOW_ACTIVE:
           return sortTodos( todos.filter(todo => !todo.get("completed") ), sort)
   }
}

