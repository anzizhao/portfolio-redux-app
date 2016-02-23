import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
var {storeTodoState, storeTodoTags, exportFile } = require('../../util')

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO, DEL_TODO, SAVE_TODO } from '../../actions/todo/actions'

import * as todoActions  from '../../actions/todo/actions'

var uuid = require('uuid');

const { SHOW_ALL } = VisibilityFilters
const { SORT_ORIGIN } = todoActions.sorts 

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

function sort (state = SORT_ORIGIN , action) {
    let cmds = todoActions
    switch (action.type) {
        case cmds.SET_SORT:
            return action.cmd 
        default:
            return state
    }
}

function addTagsItem(state, item ){
    //array find not found return undefine 
    let index = state.find((ele, index, arr) => {
        if ( ele.text === item.text )  {
            return true
        }
        return false
    })
    if ( ! index ) {
        let newItem = {
            id: item.text,
            text: item.text 
        }
        state.push(newItem)
    } 

    return state 
}

function tags (state = [], action) {
    let cmds = todoActions
    let newItem, index 
    switch (action.type) {
        case cmds.INIT_TAGS:
            return action.tags 

            
        case todoActions.IMPORT_TODO:
            // 新加的  跟原来的比较  uuid是否相同  日期更新
            // add array 
            for(let item of action.tags )  {
                addTagsItem(state,{ text: item.text })
            }
            storeTodoState(state);
            return state 

            return state;
        case cmds.ADD_TAGS:
            if ( action.tags ) {
                // add array 
                for(let item of action.tags )  {
                    addTagsItem(state,{ text: item.text })
                }
            } else {
                // add item 
                addTagsItem(state,{text: action.text} )
            
            }
            //store tags
            storeTodoTags(state)           
            return state 

        default:
            return state
    }
}


function todo(state, action) {
    let tmp
    // 特殊的 先特别对待
    if ( action.type ===   todoActions.ADD_TODO ) {
            return  {
                id: action.id,
                text: action.text,
                completed: false,
                collapse: true,
                urgency: 2,
                importance: 2,
                difficulty: 2,
                timestamp: Date.now(),
                process: [],
                conclusion: null,
                uuid: uuid.v1(),
                tags: ( action.tags && action.tags instanceof Array )? action.tags : []
            }
    }
    // common code 
    if (state.id !== action.id) {
        return state
    }
    let index, process 
    switch (action.type) {
        case COMPLETE_TODO:
            return {
                ...state,
                completed: true
            }
        case todoActions.UNCOMPLETE_TODO:
            return {
                ...state,
                completed: false 
            }

        case todoActions.ADD_TODO_SUB_PROCESS:
        case todoActions.ADD_TODO_SUB_CONCLUSION:
            state.process = state.process || [] 
            tmp = {
                id:   state.process.length,
                text: '', 
                createTime: Date.now(),
                lastTime: Date.now(),
                type: todoActions.todoSubItemType.process,  // 0 progress 1 conclusion  
                status: todoActions.todoSubItemStatus.edit, // 0 show  1 edit 
            }
            if ( action.type === todoActions.ADD_TODO_SUB_PROCESS ){
                // find the max id  
                let id 
                if( state.process.length ) {
                    let maxItem = state.process.reduce((f, s)=>{
                        return f.id > s.id ? f: s 
                    }) 
                    tmp.id = maxItem.id 
                }
                state.process.push(tmp) 
            } else {
                tmp.type = todoActions.todoSubItemType.conclusion
                state.conclusion = tmp 
            }
            return state             

        case todoActions.SAVE_TODO_SUB_PROCESS:
            process = state.process || [] 
            index = process.findIndex((ele, index, arr) => {
                                if ( ele.id === action.processId )  {
                                    return true
                                }
                                return false
            })
            if ( index === -1 ){
                return state
            }
            let selItem = process[index]
            selItem.lastTime = Date.now()
            selItem.status = todoActions.todoSubItemStatus.show  
            selItem.text = action.item.text
            selItem.tags = action.item.tags 

            return state

        case todoActions.SAVE_TODO_SUB_CONCLUSION:
            state.conclusion.text = action.text
            state.conclusion.lastTime = Date.now() 
            state.conclusion.status = todoActions.todoSubItemStatus.show 
            return state

        case todoActions.TOEDIT_TODO_SUB_PROCESS:
            process = state.process  
            index = process.findIndex((ele, index, arr) => {
                                if ( ele.id === action.processId )  {
                                    return true
                                }
                                return false
            })
            if ( index === -1 ){
                return state
            }
            selItem = process[index]

            selItem.status = todoActions.todoSubItemStatus.edit
            return state

        case todoActions.TOEDIT_TODO_SUB_CONCLUSION:
            state.conclusion.status = todoActions.todoSubItemStatus.edit

            return state

        case todoActions.TODEL_TODO_SUB_PROCESS:
            process = state.process  
            index = process.findIndex((ele, index, arr) => {
                                if ( ele.id === action.processId )  {
                                    return true
                                }
                                return false
            })
            state.process = [
                ...process.slice(0, index),
                ...process.slice(index+1),
            ] 
            return state

        case todoActions.TODEL_TODO_SUB_CONCLUSION:
            state.conclusion = null 
            return state

        default:
            return state
    }
}

function todos(state = [], action) {
    let db = []
    let db2 = []
    switch (action.type) {
        case todoActions.INIT_TODO:
                return action.todos

        case todoActions.CLEAR_ALL_TODO:
            storeTodoState([]);
            return [];

        //case todoActions.EXPORT_TODO:
            //const jsonFile = JSON.stringify(state);
            //const filename = `todo_${ new Date().toLocaleDateString() }.json`;
            //exportFile(jsonFile, filename);
            //return state;

        case todoActions.IMPORT_TODO:
            // 新加的  跟原来的比较  uuid是否相同  日期更新
            // uuid 相同的在原来位置  新的在后面加上
            // 1. 对actions的todo项根据id进行排序
            // 2. 找出state的最大的id
            // 3. 匹配uuid, 相同选择更改时间戳大的,不相同的后面添加 id 为nextId  
             let match = false 
             let nextId  
             let sortTodos = action.todos.sort((f, s)=>{
                    return f.id - s.id 
             })
             if ( state.length ) {
                 let maxItem = state.reduce((f, s)=>{
                        return f.id > s.id ? f: s 
                 })
                 nextId = maxItem.id + 1 
             } else {
                nextId = 0 
             }
             for(let i of sortTodos ) {
                  match = false 
                  for( let key  in state){
                        let j = state[key]
                        if ( j.uuid === i.uuid  )  {
                            if( i.timestamp > j.timestamp ){
                                 state[key]= i 
                            } 
                            match = true 
                            break;
                        }
                  }
                  if (! match ){
                      i.id = nextId + 1
                      nextId += 1
                      db.push(i) 
                  }
              }
            db2 = [
                ...db ,
                ...state
            ]
            storeTodoState(db2);
            return db2

        case todoActions.ADD_TODO:
            // find the max id, then plus 1
            if ( state.length === 0 ) {
                action.id = state.length 
            } else {
            
                let maxItem = state.reduce((f, s) => {
                    return f.id > s.id ? f: s 
                })
                action.id = maxItem.id + 1
            }

            db = [
                todo(undefined, action),
                ...state
            ]
            storeTodoState(db);
            return db;

        case todoActions.DEL_TODO:
            db = state.filter((item)=>{ return item.id == action.id ? false: true } ) 
            storeTodoState(db);
            return db;

        case todoActions.SAVE_TODO:
            let index = state.findIndex((ele, index, arr) => {
                                if ( ele.id === action.id )  {
                                    return true
                                }
                                return false
            })
            if( index === -1) {
                return state 
            }

            let changeItem = Object.assign({}, state[index]) 
            changeItem.text = action.text 
            changeItem.urgency = action.urgency 
            changeItem.importance = action.importance
            changeItem.difficulty = action.difficulty
            changeItem.collapse = true
            changeItem.timestamp = Date.now()
            changeItem.tags = action.tags

            db = [
                ...state.slice(0, index),
                changeItem,
                ...state.slice(index+1),
            ]
            storeTodoState(db);
            return db;

        case todoActions.COMPLETE_TODO: 
        case todoActions.UNCOMPLETE_TODO: 
        case todoActions.ADD_TODO_SUB_PROCESS:
        case todoActions.ADD_TODO_SUB_CONCLUSION:
        case todoActions.SAVE_TODO_SUB_PROCESS:
        case todoActions.SAVE_TODO_SUB_CONCLUSION:
        case todoActions.TOEDIT_TODO_SUB_PROCESS:
        case todoActions.TOEDIT_TODO_SUB_CONCLUSION:
        case todoActions.TODEL_TODO_SUB_PROCESS:
        case todoActions.TODEL_TODO_SUB_CONCLUSION:

            db = state.map(t => {
                return  t.id === action.id ? todo(t, action) : t 

            })

            storeTodoState(db);
            return db;

        case todoActions.EDIT_TODO:
            db = state.map((todo) => {
                                todo.collapse = todo.id === action.id ? false: true
                                return todo
            })
            storeTodoState(db);
            return db;

        case todoActions.UNEDIT_TODO:
            db = state.map((todo) => {
                                if(todo.id === action.id ){
                                    todo.collapse =  true
                                }
                                return todo
            })
            storeTodoState(db);
            return db;

        case todoActions.SIGN_STAR:
            db = state.map((todo) => {
                                if( todo.id === action.id ) {
                                    todo.urgency = action.count 
                                }
                                return todo
            })
            storeTodoState(db);
            return db;

        default:
            return state
    }
}


//const todoApp = combineReducers({
    //tags,
    //visibilityFilter,
    //sort,
    //todos: undoable(todos, { filter: distinctState() })
//})

function beforeReducers(action){
    switch (action.type) {
        case todoActions.IMPORT_TODO:
            action.todos = action.fileJson.todos || []
            action.tags = action.fileJson.tags || []
    }
    return action 
}

function afterReducers ( state={} ,  action ) {
    switch (action.type) {
        case todoActions.EXPORT_TODO:
            const jsonObj = {
                todos: state.todos.present,
                tags: state.tags 
            }
            const jsonFile = JSON.stringify( jsonObj )
            const filename = `todo_${ new Date().toLocaleDateString() }.json`;
            exportFile(jsonFile, filename);
    }
    return state 
}

//需要在todoApp 这里完成完成导入导出  因为处理完的tags 和 todos 
function todoApp(state = {}, action) {
    
    const actionb = beforeReducers(action) 
    const undoTodo = undoable(todos, { filter: distinctState() })

    // 小级reducers 处理
    const combineState =  {
          tags: tags(state.tags, actionb ),
          visibilityFilter: visibilityFilter(state.visibilityFilter, actionb),
          sort: sort(state.sort, actionb ),
          todos: undoTodo(state.todos, actionb ),
    }
    // 本级reducers处理 
    const retState = afterReducers(combineState, actionb )

    return retState 
}



export default todoApp
