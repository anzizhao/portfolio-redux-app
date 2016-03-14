import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
var {storeTodoState, storeTodoTags, storeTodoFromfiles, storeTodoSelectFiles,  exportFile } = require('../../util')

import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO, DEL_TODO, SAVE_TODO } from '../../actions/todo/actions'

import * as todoActions  from '../../actions/todo/actions'
import visibleTodos from '../../components/todo/visibleTodos'

import { eFilename }  from '../../constants'
import { todos }  from './todos'

            
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
export default function todoApp(state = {}, action) {
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
          mode: actionb.currentMode ,   // mode 需要优先处理， 其他需要根据mode来作处理的
          todos:  todos( state.todos, actionb ),
    }
    //if( ! combineState.todos.equals( preTodos ) ) {
        //console.log( 'todos has changed') 
    //}
    // 本级reducers处理 
    const retState = afterReducers(combineState, actionb )

    return retState 
}

