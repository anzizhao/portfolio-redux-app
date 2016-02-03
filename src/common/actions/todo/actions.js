var {storeTodoState} = require('../../util')

export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const DEL_TODO = 'DEL_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const EXPORT_TODO = 'EXPORT_TODO' 
export const INIT_TODO = 'INIT_TODO' 

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

let nextTodoId = 0

export function addTodo(text) {
    return  {
        id: nextTodoId++,
        type: ADD_TODO,
        text
    }
}

export function completeTodo(id) {
  return { type: COMPLETE_TODO, id }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}

export function exportTodo () {
    return { type: EXPORT_TODO }
}

export function initTodo () {
    const db = storeTodoState()
    nextTodoId += db.length;
    return {
      type: INIT_TODO,
      todos:  db,
    }
}

export function delTodo (id) {
    if(! id) {
        return; 
    }
    return { type: DEL_TODO, id }
}

