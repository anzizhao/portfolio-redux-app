import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
var {storeTodoState, storeTodoTags, storeTodoFromfiles, storeTodoSelectFiles,  exportFile } = require('../../util')

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO, DEL_TODO, SAVE_TODO } from '../../actions/todo/actions'

import * as todoActions  from '../../actions/todo/actions'
import visibleTodos from '../../components/todo/visibleTodos'

import { eFilename }  from '../../constants'
            
import Immutable, {fromJS, Map, List} from 'immutable'


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
const fromfilesInitState = List([
        { id:0 , text: eFilename.all },
        { id:1 , text: ''}, // 存放浏览器的项
])
function fromfiles (state = fromfilesInitState, action) {
    let cmds = todoActions
    let newItem, index , db
    switch (action.type) {
        case todoActions.INIT_ALL:
        case cmds.INIT_FROMFILES:
            db = storeTodoFromfiles()
            if( db && db[0] &&  db[0].text === eFilename.all ) {
                return List(
                    [
                        ... db
                    ]
                ) 
            } else {
                return List(
                    [
                        ... state, 
                        ... db
                    ]
                ) 
            }
                    //... fromfilesInitState.toArray()
        case cmds.CLEAR_ALL_TODO:
            storeTodoFromfiles([])
            return fromfilesInitState 

        default:
            return state
    }
}


function selectFiles(state = List() , action) {
    let cmds = todoActions
    let newItem, index 
    switch (action.type) {
        case todoActions.INIT_ALL:
        case cmds.INIT_FROMFILES:
            return List( storeTodoSelectFiles() ) 

        case cmds.SET_SELECT_FILE:
            return List( action.files )

        case cmds.CLEAR_ALL_TODO:
            storeTodoSelectFiles([])
            return List()

        case cmds.ADD_SELECT_FILE:
            index =  state.findIndex(file => file.id === action.file.id )
            if ( index !== -1 ) {
                return state 
            }
            return state.push( action.file )

        case cmds.DEL_SELECT_FILE:
            index =  state.findIndex(file => file.id === action.file.id )
            if ( index === -1 ) {
                return state 
            }
            return state.delete(index)

        default:
            return state
    }
}


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
            let t  = action 
            db = visibleTodos (state, t.visibilityFilter, t.sort, t.selectFile )
                            .filter(item =>{
                                // 选择为需要删除的内容
                                return ! item.get("select")
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

                return  [ ...process ] 
        })

        case todoActions.TOEDIT_TODO_SUB_PROCESS:
            return _setTodo(state, action, "process", (todo)=> {
                let process = todo.get("process")
                let index = process.findIndex((ele ) => {

                    return  ele.id === action.processId   
                })
                let selItem = process[index]
                selItem.status = todoActions.todoSubItemStatus.show  

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
    switch (     action.type ) {
        case todoActions.IMPORT_TODO:
            action.todos = action.fileJson.todos || []
            action.tags = action.fileJson.tags || []
            break

        case todoActions.DEL_SELECT:
            t  = state
            action.visibilityFilter = t.visibilityFilter
            action.sort = t.sort 
            action.selectFile = t.selectFile
            break
        case todoActions.ADD_TODO:
            t  = state
            action.fromfile = '' 

            tmp = t.selectFiles.find( file => {
                return file.text === eFilename.all ||  file.text === '' 
            }) 
            if ( tmp ) {
                action.fromfile = '' 
            } else {
                tmp = t.fromfiles.find( file => {
                    return t.selectFiles.some( sfi => sfi.text === file.text ) 
                })
                if ( tmp ) {
                    action.fromfile = tmp.text  
                }
            }
            //let files = t.selectFiles
            //if( files.length && files[0].text  !== '[全部文件]' 
                    //&& files[0].text  !== '[全部文件]' 
              //) {
                //action.fromfile = t.selectFile[0].text
            //}
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
                todos: state.todos.map(todo=> todo.toObject() ).toArray(),
                tags: state.tags 
            }
            filename = `todo_${ new Date().toLocaleDateString() }.json`
            objExportFile(jsonObj, filename )

            return state

        case todoActions.IMPORT_TODO: // 

            let result = state.fromfiles.find(item => {
                return item.text === action.fromfile 
            })
            if (! result ) {
                let id = state.fromfiles.size
                state.fromfiles = state.fromfiles.push({ id,    text: action.fromfile})
                storeTodoFromfiles( state.fromfiles.toArray() )
            } 
            return state

        case todoActions.EXPORT_SELECT:
            let t  = state
            jsonObj = {
                tags: state.tags ,
            }
            //jsonObj.todos = visibleTodos (t.todos.present, t.visibilityFilter, t.sort, t.selectFiles )
            jsonObj.todos = visibleTodos (t.todos, t.visibilityFilter, t.sort, t.selectFiles )
                            .filter(item =>{
                                return item.get("select")
                            })
                            .map(todo => todo.toObject())
                            .toArray()
            if( state.selectFiles.size !==  0 ) {
                filename = state.selectFiles.get(0).text  
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

    // save todos 
    //var preTodos = state.todos 

    // 级reducers 处理
    const combineState =  {
          tags: tags(state.tags, actionb ),
          fromfiles: fromfiles(  state.fromfiles, actionb ),
          visibilityFilter: visibilityFilter(state.visibilityFilter, actionb),
          sort: sort(state.sort, actionb ),
          selectFiles: selectFiles(state.selectFiles, actionb ),
          //todos: undoTodo(state.todos, actionb ),
          todos:  todos( state.todos, actionb ),
          mode: actionb.currentMode ,   // mode 需要优先处理， 其他需要根据mode来作处理的
    }
    //if( ! combineState.todos.equals( preTodos ) ) {
        //console.log( 'todos has changed') 
    //}
    // 本级reducers处理 
    const retState = afterReducers(combineState, actionb )

    return retState 
}



export default todoApp
