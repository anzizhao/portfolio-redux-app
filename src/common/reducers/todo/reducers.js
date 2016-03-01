import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
var {storeTodoState, storeTodoTags, storeTodoFromfiles,  exportFile } = require('../../util')

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO, DEL_TODO, SAVE_TODO } from '../../actions/todo/actions'

import * as todoActions  from '../../actions/todo/actions'
import visibleTodos from '../../components/todo/visibleTodos'
            
import {fromJS, Map, List} from 'immutable'


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

function selectFile (state = [], action) {
    let cmds = todoActions
    switch ( action.type) {
        case cmds.SET_SELECT_FILE:
            return action.files
        default:
            return state
    }
}


function mode (state = todoActions.todoMode.default, action) {
    let cmds  = todoActions
    switch (action.type) {
        case cmds.SET_MODE:
            return action.mode  
        case cmds.TOGGLE_MODE:
            if( action.mode === cmds.todoMode.select && state !==  cmds.todoMode.select ) {
                //关注的selectmode 且原来的不是select mode， 改为select mode
                return  todoActions.todoMode.select 
            }
            return todoActions.todoMode.default
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
        case todoActions.INIT_ALL:
            return storeTodoTags()

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

function fromfiles (state = [], action) {
    let cmds = todoActions
    let newItem, index 
    switch (action.type) {
        case todoActions.INIT_ALL:
            return storeTodoFromfiles()

        case cmds.INIT_FROMFILES:
            return action.fromfiles

        case cmds.CLEAR_ALL_TODO:
            storeTodoFromfiles([]);
            return [];
        default:
            return state
    }
}


function todo(state=Map(), action) {
    let tmp
    // 特殊的 先特别对待
    if ( action.type ===   todoActions.ADD_TODO ) {
            return Map( {
                id: action.id,
                text: action.text,
                completed: false,
                collapse: true,
                urgency: 2,
                importance: 2,
                difficulty: 2,
                timestamp: Date.now(),
                process: [],
                select: false,   //是否被选择
                fromfile: action.fromfile ,  //从那个文件导入
                conclusion: null,
                uuid: uuid.v1(),
                tags: ( action.tags && action.tags instanceof Array )? action.tags : []
            })
    }
    // common code 
    if (state.id !== action.id) {
        return state
    }
    let index, process, item 
    switch (action.type) {
        case COMPLETE_TODO:
            return state.set("completed", true)

        case todoActions.UNCOMPLETE_TODO:
            return state.set("completed", false)

        case todoActions.SAVE_TODO:
            //let item = Object.assign({}, state[index]) 
            let item =  state  
            item.text = action.text 
            item.urgency = action.urgency 
            item.importance = action.importance
            item.difficulty = action.difficulty
            item.collapse = true
            item.timestamp = Date.now()
            item.tags = action.tags
            return state.set("text", action.text)
                        .set("urgency", action.urgency)
                        .set("importance", action.importance)
                        .set("difficulty", action.difficulty)
                        .set("collapse", action.collapse)
                        .set("timestamp", Date.now())
                        .set("tags", action.tags)

        case todoActions.SET_TODO_SELECT: 
            return state.set("select", action.select)

        case todoActions.ADD_TODO_SUB_PROCESS:
        case todoActions.ADD_TODO_SUB_CONCLUSION:
            if ( ! state.get("process") ){
                state = state.set("process", []) 
            }
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
                if( state.get("process").size ) {
                    let maxItem = state.get("process").reduce((f, s)=>{
                        return f.id > s.id ? f: s 
                    }) 
                    tmp.id = maxItem.id  + 1
                }
                state= state.update("process", process =>  process.push(tmp))

            } else {
                tmp.type = todoActions.todoSubItemType.conclusion
                state= state.set("conclusion", tmp)
            }
            return state             

        case todoActions.SAVE_TODO_SUB_PROCESS:
            if ( ! state.get("process") ){
                state = state.set("process", []) 
            }
            process = state.get("process")

            index = process.findIndex((ele, index, arr) => {
                                if ( ele.id === action.processId )  {
                                    return true
                                }
                                return false
            })
            if ( index === -1 ){
                return state
            }

            return state.update("process", process =>  {
                let selItem = process[index]
                selItem.lastTime = Date.now()
                selItem.status = todoActions.todoSubItemStatus.show  
                selItem.text = action.item.text
                selItem.tags = action.item.tags 
                return process
            })

        case todoActions.TOEDIT_TODO_SUB_PROCESS:
            process = state.get("process")

            index = process.findIndex((ele, index, arr) => {
                                if ( ele.id === action.processId )  {
                                    return true
                                }
                                return false
            })
            if ( index === -1 ){
                return state
            }
            return state.update("process", process =>  {
                let selItem = process[index]
                selItem.status = todoActions.todoSubItemStatus.edit
                return process
            })


        case todoActions.SAVE_TODO_SUB_CONCLUSION:
            return state.update("conclusion", item =>  {
                item.text = action.text
                item.lastTime = Date.now() 
                item.status = todoActions.todoSubItemStatus.show 
                return item  
            })


        case todoActions.TOEDIT_TODO_SUB_CONCLUSION:
            return state.update("conclusion", item =>  {
                item.status = todoActions.todoSubItemStatus.edit
                return item  
            })

        case todoActions.TODEL_TODO_SUB_PROCESS:
            process = state.get("process")
            index = process.findIndex((ele, index, arr) => {
                                if ( ele.id === action.processId )  {
                                    return true
                                }
                                return false
            })
            return state.update("process", process =>  {
                return  [
                    ...process.slice(0, index),
                    ...process.slice(index+1),
                ] 
            })

        case todoActions.TODEL_TODO_SUB_CONCLUSION:
            return state.update("conclusion", item =>  {
                return null 
            })

        default:
            return state
    }
}

function todos(state = List(), action) {
    let db    
    let tmp
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

        //case todoActions.INIT_TODO:
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
             db = List()
             for(let i of sortTodos ) {
                  match = false 
                  i.fromfile = action.fromfile
                  match = state.findIndex((value, index ) =>{
                      if ( value.get("uuid") === i[uuid] )  {
                          return true
                      }
                      return false
                  })

                  if ( match !== -1 ) {
                      if( i[timestamp] > state.get(tmp).get("timestamp") ){
                          state = state.set(tmp, i)
                      } 
                  } else {
                      i.id = nextId + 1
                      nextId += 1
                      db = db.push( Map(i) )
                  }
            }
            db = db.merge(state) 
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
                action.id = maxItem.id + 1
            }
            db =  state.push( todo(undefined, action)) 
            storeTodoState(db.toObject());
            return db;

        case todoActions.DEL_TODO:
            //db = state.filter((item)=>{ return item.id == action.id ? false: true } ) 
            tmp = state.findIndex((item)=>  { return item.id == action.id ? false: true} )
            if ( tmp === -1 ) {
                return state 
            }
            db =  state.deleteIn(tmp) 
            storeTodoState(db.toObject());
            return db;

        case todoActions.DEL_SELECT:
            let t  = action 
            db = visibleTodos (state, t.visibilityFilter, t.sort )
                            .filter(item =>{
                                return item.get("select")
                            })
            storeTodoState(db.toObject());
            return db 

        case todoActions.SET_TODO_SELECT:
            // may be 后面增加错误信息的提示
            if ( action.currentMode !== todoActions.todoMode.select ) {
                return state 
        }
            tmp = state.findIndex(t =>{
                return t.get("id") === action.id 
            })
            if ( tmp === -1 ) {
                return state  
            }
            db = state.update(tmp , value => {
                value.set("select", action.select)
            })
            storeTodoState(db.toObject());
            return db;

        case todoActions.SET_TODO_SELECT_ALL:
            if ( action.currentMode !== todoActions.todoMode.select ) {
                return state 
            }

            db = state.map(t => {
                t.set("select", action.select) 
            })

            storeTodoState(db.toObject())
            return db  


        case todoActions.COMPLETE_TODO: 
        case todoActions.UNCOMPLETE_TODO: 
        case todoActions.SAVE_TODO:
        case todoActions.ADD_TODO_SUB_PROCESS:
        case todoActions.ADD_TODO_SUB_CONCLUSION:
        case todoActions.SAVE_TODO_SUB_PROCESS:
        case todoActions.SAVE_TODO_SUB_CONCLUSION:
        case todoActions.TOEDIT_TODO_SUB_PROCESS:
        case todoActions.TOEDIT_TODO_SUB_CONCLUSION:
        case todoActions.TODEL_TODO_SUB_PROCESS:
        case todoActions.TODEL_TODO_SUB_CONCLUSION:

            tmp = state.findIndex(t =>{
                return t.get("id") === action.id 
            })
            if ( tmp === -1 ) {
                return state  
            }
            db = state.update(tmp , value => {
                return value.set("select", todo(value, action) )
            })

            storeTodoState(db.toObject())
            return db;

        case todoActions.EDIT_TODO:
            db = state.map((todo) => {
                                tmp = todo.get("id") === action.id ? false: true
                                return  todo.set("collapse", tmp)
            })

            storeTodoState(db.toObject())
            return db;

        case todoActions.UNEDIT_TODO:
            tmp = state.findIndex(t =>{
                return t.get("id") === action.id 
            })
            if ( tmp === -1 ) {
                return state  
            }
            db = state.update(tmp , value => {
                return value.set("collapse", todo(value, action) )
            })

            storeTodoState(db.toObject())
            return db;

        case todoActions.SIGN_STAR:
            tmp = state.findIndex(t =>{
                return t.get("id") === action.id 
            })
            if ( tmp === -1 ) {
                return state  
            }
            db = state.update(tmp , value => {
                return value.set("urgency", action.count )
            })
            storeTodoState(db.toObject())
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

// state 不做修改
function beforeReducers(state, action){
    action.currentMode = mode(state.mode, action) 

    let tmp , t 
    switch (action.type) {
        case todoActions.IMPORT_TODO:
            action.todos = action.fileJson.todos || []
            action.tags = action.fileJson.tags || []
            break

        case todoActions.DEL_SELECT:
            t  = state
            action.visibilityFilter = t.visibilityFilter
            action.sort = t.sort 
            break
        case todoActions.ADD_TODO:
            t  = state
            action.fromfile = '' 

            tmp = t.selectFile.find(file => {
                return file.text === '[全部文件]'  ||  file.text === '[浏览器的]' 
            }) 
            let files = t.selectFile
            if( files.length && files[0].text  !== '[全部文件]' 
                    && files[0].text  !== '[全部文件]' 
              ) {
                action.fromfile = t.selectFile[0].text
            }
            break

    }
    return action 
}

function objExportFile(obj, filename) {
    const jsonFile = JSON.stringify( obj )
    exportFile(jsonFile, filename);
}

function afterReducers ( state={} ,  action ) {
    let jsonObj , filename  
    switch (action.type) {
        case todoActions.EXPORT_TODO:
            jsonObj = {
                //todos: state.todos.present.toObject(),
                todos: state.todos.toObject(),
                tags: state.tags 
            }
            filename = `todo_${ new Date().toLocaleDateString() }.json`
            objExportFile(jsonObj, filename )

            return state

        case todoActions.IMPORT_TODO:
            // 
            let fromfiles = state.fromfiles
            let result = fromfiles.find(item => {
                return item.text === action.fromfile 
            })
            if (! result ) {
                fromfiles.push({text: action.fromfile})
                storeTodoFromfiles(fromfiles)
            } 
            return state

        case todoActions.EXPORT_SELECT:
            let t  = state
            jsonObj = {
                tags: state.tags ,
            }
            //jsonObj.todos = visibleTodos (t.todos.present, t.visibilityFilter, t.sort, t.selectFile )
            jsonObj.todos = visibleTodos (t.todos, t.visibilityFilter, t.sort, t.selectFile )
                            .filter(item =>{
                                return item.select 
                            })
            if( state.selectFile.length !==  0 ) {
                filename = state.selectFile[0].text  
            } else {
                filename = `todo_${ new Date().toLocaleDateString() }.json`
            }

            objExportFile(jsonObj, filename )
            return state
    }
    return state 
}

//需要在todoApp 这里完成完成导入导出  因为处理完的tags 和 todos 
function todoApp(state = {}, action) {
    
    const actionb = beforeReducers(state,  action) 
    //const undoTodo = undoable(todos, { filter: distinctState() })

    // 下
    // 级reducers 处理
    const combineState =  {
          tags: tags(state.tags, actionb ),
          fromfiles: fromfiles(  state.fromfiles, actionb ),
          visibilityFilter: visibilityFilter(state.visibilityFilter, actionb),
          sort: sort(state.sort, actionb ),
          selectFile: selectFile(state.selectFile, actionb ),
          //todos: undoTodo(state.todos, actionb ),
          todos:  todos( state.todos, actionb ),
          mode: actionb.currentMode ,   // mode 需要优先处理， 其他需要根据mode来作处理的
        
    }
    // 本级reducers处理 
    const retState = afterReducers(combineState, actionb )

    return retState 
}



export default todoApp
