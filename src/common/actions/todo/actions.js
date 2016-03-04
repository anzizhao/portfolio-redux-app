var {storeTodoState, storeTodoTags , storeTodoFromfiles}  = require('../../util')
//init 
export const INIT_ALL = 'INIT_ALL' 
export const INIT_TODO = 'INIT_TODO' 
export const INIT_TAGS= 'INIT_TAGS' 
export const INIT_FROMFILES = 'INIT_FROMFILES' 
//todo 
export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const UNCOMPLETE_TODO = 'UNCOMPLETE_TODO'
export const DEL_TODO = 'DEL_TODO'

export const EXPORT_TODO = 'EXPORT_TODO' 
export const IMPORT_TODO = 'IMPORT_TODO' 
export const CLEAR_ALL_TODO = 'CLEAR_ALL_TODO' 
export const SAVE_TODO = 'SAVE_TODO' 
export const EDIT_TODO = 'EDIT_TODO' 
export const UNEDIT_TODO = 'UNEDIT_TODO' 

export const CHANGE_TODO_FROMFILE= 'CHANGE_TODO_FROMFILE'   //修改fromfile
export const TOCHANGE_TODO_FROMFILE= 'TOCHANGE_TODO_FROMFILE'  // 去修改fromfile

export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const SET_SORT = 'SET_SORT'
export const SET_SELECT_FILE= 'SET_SELECT_FILE'
export const ADD_SELECT_FILE= 'ADD_SELECT_FILE'
export const DEL_SELECT_FILE= 'DEL_SELECT_FILE'


export const EXPORT_SELECT  = 'EXPORT_SELECT'
export const DEL_SELECT  = 'DEL_SELECT'

export const SIGN_STAR= 'SIGN_STAR' 
export const ADD_TODO_TAG = 'ADD_TODO_TAG'

export const SET_MODE = 'SET_MODE'   //set todo mode 
export const TOGGLE_MODE = 'TOGGLE_MODE'   //set todo mode 
export const SET_TODO_SELECT = 'SET_TODO_SELECT'   //select todo 
export const SET_TODO_SELECT_ALL= 'SET_TODO_SELECT_ALL'   //set all todo  select 

//sub todo 
export const ADD_TODO_SUB_PROCESS  = 'ADD_TODO_SUB_PROCESS' 
export const ADD_TODO_SUB_CONCLUSION = 'ADD_TODO_SUB_CONCLUSION' 
export const SAVE_TODO_SUB_PROCESS = 'SAVE_TODO_SUB_PROCESS' 
export const SAVE_TODO_SUB_CONCLUSION = 'SAVE_TODO_SUB_CONCLUSION' 
export const TOEDIT_TODO_SUB_PROCESS = 'TOEDIT_TODO_SUB_PROCESS' 
export const TOEDIT_TODO_SUB_CONCLUSION = 'TOEDIT_TODO_SUB_CONCLUSION' 
export const TODEL_TODO_SUB_PROCESS = 'TODEL_TODO_SUB_PROCESS' 
export const TODEL_TODO_SUB_CONCLUSION = 'TODEL_TODO_SUB_CONCLUSION' 

//tags
export const ADD_TAGS = 'ADD_TAGS' 

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

export const todoSubItemStatus= {
  show: 0,
  edit: 1,
}
export const todoSubItemType = {
  process: 0,
  conclusion: 1,
}

export const todoMode = {
  default: 0, //默认模式
  select: 1,  // 选择模式
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

export function setSelectMode () {
  return { type: SET_MODE,  mode: todoMode.select }
}
export function setDefaultMode () {
  return { type: SET_MODE,  mode: todoMode.default }
}

export function toggleSelectMode () {
  return { type: TOGGLE_MODE,  mode: todoMode.select }
}



export function exportTodo () {
    return { type: EXPORT_TODO }
}

export function importTodo (fileJson, fromfile) {
    return { type: IMPORT_TODO, fileJson, fromfile }
}

export function clearAllTodo () {
    return { type: CLEAR_ALL_TODO }
}

let nextTodoId = 0
export function addTodo (text, tags) {
    return {
        type: ADD_TODO, 
        tags,
        text
    }
}

export function initTodo () {
    return {
      type: INIT_TODO,
    }
}

export function initTags () {
    const db = storeTodoTags()
    return {
      type: INIT_TAGS,
      tags:  db,
    }
}

export function initFromfiles() {
    return {
      type: INIT_FROMFILES,
    }
}

export function initAll () {
    return {
      type: INIT_ALL,
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
    return { type: ADD_TODO_SUB_PROCESS, id:todoId }
}
export function addTodoSubConclusion (todoId ) {
    return { type: ADD_TODO_SUB_CONCLUSION, id:todoId }
}
export function saveTodoSub(todoId, processId, type, item ) {
    if ( type === todoSubItemType.process ) {
        return { type: SAVE_TODO_SUB_PROCESS, id:todoId, processId, item } 
    } else if ( type === todoSubItemType.conclusion ){
        return { type: SAVE_TODO_SUB_CONCLUSION, id:todoId,  text: item.text }  
    }
}

export function toeditTodoSub (todoId, processId, type ) {
    if ( type === todoSubItemType.process ) {
        return { type: TOEDIT_TODO_SUB_PROCESS, id:todoId, processId } 
    } else if ( type === todoSubItemType.conclusion ){
        return { type: TOEDIT_TODO_SUB_CONCLUSION, id:todoId } 
    }
}

export function todelTodoSub (todoId, processId, type ) {
    if ( type === todoSubItemType.process ) {
        return { type: TODEL_TODO_SUB_PROCESS, id:todoId, processId } 
    } else if ( type === todoSubItemType.conclusion ){
        return { type: TODEL_TODO_SUB_CONCLUSION, id:todoId } 
    }
}



export function addTags (id, text) {
    return { type: ADD_TAGS, id, text} 
}

export function addTagsBatch (tags) {
    return { type: ADD_TAGS, tags } 
}


export function addTodoTags (id, tags) {
    return { type: ADD_TAGS, id, tags} 
}

export function selectTodo (id, select  ) {
    return { type:  SET_TODO_SELECT, id, select } 
}

export function selectAllTodo ( select  ) {
    return { type:  SET_TODO_SELECT_ALL,  select } 
}

export function exportSelect () {
    return { type:  EXPORT_SELECT } 
}
export function delSelect () {
    return { type:  DEL_SELECT } 
}


export function selectFile(files){
    return { type:  SET_SELECT_FILE, files} 
}

export function toggleSelectFile (file, toSelect ){
    if( toSelect ) {
        return { type:  ADD_SELECT_FILE, file } 
    } else {
        return { type:  DEL_SELECT_FILE, file } 
    }
}

export function changeFromfile ( id, fromfile){
    return { type: CHANGE_TODO_FROMFILE, id, fromfile} 
}

export function toChangeFromfile ( id, show ){
    return { type: TOCHANGE_TODO_FROMFILE, id, show} 
}

