import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
var {storeTodoState, storeTodoTags, storeTodoFromfiles, storeTodoSelectFiles,  exportFile } = require('../../util')

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO, DEL_TODO, SAVE_TODO } from '../../actions/todo/actions'

import * as todoActions  from '../../actions/todo/actions'
import {_selectTodos } from '../../components/todo/visibleTodos'

import { eFilename }  from '../../constants'
            
import Immutable, {fromJS, Map, List} from 'immutable'


var uuid = require('uuid');

const { SHOW_ALL } = VisibilityFilters
const { SORT_ORIGIN } = todoActions.sorts 

function todo(state=Map(), action ) {
    let tmp
    // 特殊的 先特别对待
    if ( action.type ===   todoActions.ADD_TODO ) {
            return Map( {
                id: action.id,
                text: action.text,
                completed: false,
                urgency: 2,
                importance: 2,
                difficulty: 2,
                timestamp: Date.now(),
                process: [],
                fromfile: action.fromfile ,  //从那个文件导入
                conclusion: null,
                uuid: uuid.v1(),
                tags: ( action.tags && action.tags instanceof Array )? action.tags : [],
                // view status 
                collapse: true,
                select: false,   //是否被选择
                toEditFromfile: false,  // 是否去修改from file 
                
            })
    }

    // common code 
    if (state.get('id') !== action.id) {
        return state
    }
    let index, process, item 
    switch (action.type) {
        default:
            return state
    }
}

function _setTodo(state, action, key, fn_value) {
    let tmp = state.findIndex(t =>{
        return t.get("id") === action.id 
    })
    if ( tmp === -1 ) {
        return state  
    }
   let  db = state.update(tmp , todo => {
        return todo.set( key , fn_value(todo) )
    })

    storeTodoState(db.toObject())
    return db 

}

export function todos(state = List(), action) {
    let db    
    let tmp
    let isDelSelect 

    switch (action.type) {
        case todoActions.INIT_ALL:
        case todoActions.INIT_TODO:
            //return storeTodoState()
            db = List()
            tmp = storeTodoState()
            for(let key in tmp  ){
                db = db.push( Map( tmp[key]) ) 
            }
            return db 


                //return action.todos 

        case todoActions.CLEAR_ALL_TODO:
            storeTodoState([])
            return List()

        case todoActions.SET_MODE:
        case todoActions.TOGGLE_MODE:
            if ( action.currentMode === todoActions.todoMode.select ) {
                return state.map(item =>{
                    return item.set("select", true)
                })
            }
            return state 
        case todoActions.IMPORT_TODO:
            // 新加的  跟原来的比较  uuid是否相同  日期更新
            // uuid 相同的在原来位置  新的在后面加上
            // 1. 对actions的todo项根据id进行排序
            // 2. 找出state的最大的id
            // 3. 匹配uuid, 相同选择更改时间戳大的,不相同的后面添加 id 为nextId  
             let nextId  
             let sortTodos = action.todos.sort((f, s)=>{
                    return f.id - s.id 
             })
             if ( state.size ) {
                 let maxItem = state.reduce((f, s)=>{
                        return f.id > s.id ? f: s 
                 })
                 nextId = maxItem.get('id') + 1 
             } else {
                nextId = 0 
             }
             db = List()
             for(let i of sortTodos ) {
                  i.fromfile = action.fromfile
                  tmp = state.findIndex((value, index ) =>{
                      return value.get("uuid") === i.uuid 
                  })

                  if ( tmp !== -1 ) {
                      if( i.timestamp > state.get(tmp).get("timestamp") ){
                          state = state.set(tmp, i)
                      } 
                  } else {
                      i.id = nextId + 1
                      nextId += 1
                      db = db.push( Map(i) )
                  }
             }
            db = state.concat(db) 
            storeTodoState(db.toObject());
            return db

        case todoActions.ADD_TODO:
            // find the max id, then plus 1
            if ( state.size === 0 ) {
                action.id = state.size
            } else {
                let maxItem = state.reduce((f, s) => {
                    return f.id > s.id ? f: s 
                })
                action.id = maxItem.get('id') + 1
            }
            db =  state.push( todo(undefined, action)) 
            storeTodoState(db.toObject());
            return db;
        case todoActions.SAVE_TODO:
            let tmp = state.findIndex(t =>{
                return t.get("id") === action.id 
            })
            if ( tmp === -1 ) {
                return state  
            }
            db = state.update(tmp , todo => {
                return todo.set("text", action.text)
                            .set("urgency", action.urgency)
                            .set("importance", action.importance)
                            .set("difficulty", action.difficulty)
                            .set("collapse", action.collapse)
                            .set("timestamp", Date.now())
                            .set("tags", action.tags)
            })

            storeTodoState(db.toObject())
            return db 


        case todoActions.DEL_TODO:
            //db = state.filter((item)=>{ return item.id == action.id ? false: true } ) 
            tmp = state.findIndex((item)=>  { return item.get("id") == action.id  } )
            if ( tmp === -1 ) {
                return state 
            }
            db =  state.delete(tmp) 
            storeTodoState(db.toObject());
            return db;

        case todoActions.DEL_SELECT:
            isDelSelect = true
        case todoActions.DEL_PAGE:
            let t  = action 
            // 找出准备删除项
            tmp  = _selectTodos (state, t.visibilityFilter, t.sort, t.selectFiles, t.selectTags, t.filter)
            if ( isDelSelect ) {
                tmp =  tmp.filter(item =>{
                                return  item.get("select")
                       })
            }

            // 删除选择的项
            db = state.filter(t =>{
                let result =  tmp.find(dt => {
                    return dt.get("id")  === t.get("id") 
                }) 
                return result ? false : true 
            })

            storeTodoState(db.toObject());
            return db 

        case todoActions.SET_TODO_SELECT:
            // may be 后面增加错误信息的提示
            if ( action.currentMode !== todoActions.todoMode.select ) {
                return state 
            }
            return _setTodo(state, action, "select", (todo)=> action.select )


        case todoActions.SET_TODO_SELECT_ALL:
            if ( action.currentMode !== todoActions.todoMode.select ) {
                return state 
            }

            db = state.map(t => {
                return t.set("select", action.select) 
            })

            storeTodoState(db.toObject())
            return db  


        case todoActions.COMPLETE_TODO: 
            return _setTodo(state, action, "completed", (todo)=> true )

        case todoActions.UNCOMPLETE_TODO: 
            return _setTodo(state, action, "completed", (todo)=> false )

        case todoActions.ADD_TODO_SUB_PROCESS:
            return _setTodo(state,action,"process", (todo, action)=> {
            let process = todo.get("process") || [] 
            let tmp = {
                    id: 0 ,
                    text: '', 
                    createTime: Date.now(),
                    lastTime: Date.now(),
                    type: todoActions.todoSubItemType.process,  // 0 progress 1 conclusion  
                    status: todoActions.todoSubItemStatus.edit, // 0 show  1 edit 
                    keyPoint: false,    //false not key process, true key
                    aTag: null,
            }
            // find the max id  
            if( process.length ) {
                let maxItem = process.reduce((f, s)=>{
                    return f.id > s.id ? f: s 
                }) 
                tmp.id = maxItem.id  + 1
            }
            //immutable list, 如果key对应为array, 对array增删 is检测不了变化, 需要创建新的数据
            //process.push(tmp)
            return [
                ...process ,
                tmp 
            ] 
        })

        case todoActions.ADD_TODO_SUB_CONCLUSION:
            return _setTodo(state, action, "conclusion", (todo)=> {
            let tmp = {
                    id: 0 ,
                    text: '', 
                    createTime: Date.now(),
                    lastTime: Date.now(),
                    type : todoActions.todoSubItemType.conclusion,
                    status: todoActions.todoSubItemStatus.edit, // 0 show  1 edit 
                    aTag: null,
            }
            return tmp
        })

        case todoActions.SAVE_TODO_SUB_PROCESS:
            return _setTodo(state, action, "process", (todo)=> {
                let process = todo.get("process")
                let index = process.findIndex((ele ) => {

                    return  ele.id === action.processId   
                })

                let selItem = process[index]
                selItem.lastTime = Date.now()
                selItem.status = todoActions.todoSubItemStatus.show  
                selItem.text = action.item.text
                selItem.tags = action.item.tags 
                selItem.aTag = action.item.aTag

                return  [ ...process ] 
        })

        case todoActions.TOEDIT_TODO_SUB_PROCESS:
            return _setTodo(state, action, "process", (todo)=> {
                let process = todo.get("process")
                let index = process.findIndex((ele ) => {

                    return  ele.id === action.processId   
                })
                let selItem = process[index]
                selItem.status = todoActions.todoSubItemStatus.edit

                return  [ ...process ] 
        })

        case todoActions.TODO_SUB_PROCESS_KEY:
            return _setTodo(state, action, "process", (todo)=> {
                let process = todo.get("process")
                let index = process.findIndex((ele ) => {

                    return  ele.id === action.processId   
                })
                let selItem = process[index]
                selItem.keyPoint =  action.keyPoint 

                return  [ ...process ] 
        })


        case todoActions.SAVE_TODO_SUB_CONCLUSION:
            return _setTodo(state, action, "conclusion", (todo)=> {
                //创建一个新的
                let item = {  ... todo.get("conclusion") }
                item.text = action.text
                item.lastTime = Date.now() 
                item.status = todoActions.todoSubItemStatus.show 
                return item  
        })

        case todoActions.TOEDIT_TODO_SUB_CONCLUSION:
            return _setTodo(state, action, "conclusion", (todo)=> {
                let item = { ...todo.get("conclusion") }
                item.status = todoActions.todoSubItemStatus.edit
                return item  
        })

        case todoActions.TODEL_TODO_SUB_PROCESS:
            return _setTodo(state, action, "process", (todo)=> {
                let process = todo.get("process")
                let index = process.findIndex((ele) => {
                    return  ele.id === action.processId   
                })
                return  [
                    ...process.slice(0, index),
                    ...process.slice(index+1),
                ] 
            })

        case todoActions.TODEL_TODO_SUB_CONCLUSION:
            return _setTodo(state, action, "conclusion", (todo)=> {
                return  ""
            })

        case todoActions.EDIT_TODO:
            return _setTodo(state, action, "collapse", (todo)=> {
                return false 
            })

        case todoActions.UNEDIT_TODO:
            return _setTodo(state, action, "collapse", (todo)=> {
                return true 
            })

        case todoActions.TOCHANGE_TODO_FROMFILE:
            return _setTodo(state, action, "toEditFromfile", (todo)=> {
                return action.show 
            })

        case todoActions.CHANGE_TODO_FROMFILE:
            return _setTodo(state, action, "fromfile", (todo)=> {
                return action.fromfile 
            })

        case todoActions.SIGN_STAR:
            return _setTodo(state, action, "urgency", (todo)=> {
                return action.count 
            })

        default:
            return state
    }
}






