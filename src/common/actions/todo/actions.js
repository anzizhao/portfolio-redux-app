var {storeTodoState} = require('../../util')

export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const UNCOMPLETE_TODO = 'UNCOMPLETE_TODO'
export const DEL_TODO = 'DEL_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const SET_SORT = 'SET_SORT'
export const EXPORT_TODO = 'EXPORT_TODO' 
export const IMPORT_TODO = 'IMPORT_TODO' 
export const INIT_TODO = 'INIT_TODO' 
export const SAVE_TODO = 'SAVE_TODO' 
export const EDIT_TODO = 'EDIT_TODO' 
export const UNEDIT_TODO = 'UNEDIT_TODO' 
export const SIGN_STAR= 'SIGN_STAR' 

export const ADD_TODO_SUB_PROCESS  = 'ADD_TODO_SUB_PROCESS' 
export const ADD_TODO_SUB_CONCLUSION = 'ADD_TODO_SUB_CONCLUSION' 

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const sorts = {
    SORT_ORIGIN: 'SORT_ORIGIN',
    SORT_IMPORTANCE_UP: 'SORT_IMPORTANCE_UP',
    SORT_IMPORTANCE_DOWN: 'SORT_IMPORTANCE_DOWN',
    SORT_URGENCY_UP:'SORT_URGENCY_UP',
    SORT_URGENCY_DOWN: 'SORT_URGENCY_DOWN',
    SORT_DIFFICULTY_UP: 'SORT_DIFFICULTY_UP',
    SORT_DIFFICULTY_DOWN :'SORT_DIFFICULTY_DOWN'
}

export function completeTodo(id) {
  return { type: COMPLETE_TODO, id }
}
export function uncompleteTodo(id) {
  return { type: UNCOMPLETE_TODO, id }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}

export function setSort (cmd) {
  return { type: SET_SORT, cmd }
}

export function exportTodo () {
    return { type: EXPORT_TODO }
}

export function importTodo (todos) {
    return { type: IMPORT_TODO,  todos }
}

let nextTodoId = 0
export function addTodo (text) {
    return {
        type: ADD_TODO, 
        id : nextTodoId ++, 
        text
    }
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
    return { type: DEL_TODO, id }
}

export function saveTodo (id, item) {
    return { type: SAVE_TODO, id, ...item }
}
export function editTodo (id ) {
    return { type: EDIT_TODO, id }
}
export function uneditTodo (id ) {
    return { type: UNEDIT_TODO, id }
}

export function signStar (id, count ) {
    return { type: SIGN_STAR, id, count  }
}

export function addTodoSubProcess (todoId ) {
    return { type: ADD_TODO_SUB_PROCESS, todoId }
}
export function addTodoSubConclusion (todoId ) {
    return { type: ADD_TODO_SUB_CONCLUSION, todoId }
}

