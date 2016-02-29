import {  setVisibilityFilter, VisibilityFilters } from '../../actions/todo/actions'
import * as todoActions  from '../../actions/todo/actions'



function selectFile (todos, files) {
    //select file 数组为空, 返回全部
    if ( files.length === 0) {
        return todos 
    } else {
        // 一些特殊的值 全部 没有源文件的
        let tmp 
        tmp = files.find(file => {
            return file.text === '[全部文件]' 
        }) 
        if ( tmp ) {
            return todos 
        }

        files.forEach(file => {
            if ( file.text === '[浏览器的]' ) {
                file.text = '' 
            }
        }) 

        return todos.filter(item =>{
            return files.some(file => {
                return file.text === item.fromfile
            }) 
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


export default function selectTodos(_todos, filter, sort, selectedFiles ) { 
   const todos = selectFile(_todos, selectedFiles) 
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

