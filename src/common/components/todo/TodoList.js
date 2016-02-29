import React, { Component, PropTypes } from 'react'
import Todo from './Todo'
import * as todoActions  from '../../actions/todo/actions'

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import FlatButton from 'material-ui/lib/flat-button';
import Checkbox from 'material-ui/lib/checkbox';

import Badge from 'material-ui/lib/badge';
import ClearAllBut from './clearAllBut';

var {exportFile, readFile } = require('../../util')

export default class TodoList extends Component {

    componentDidMount(){
        //document.getElementById('importTodo').addEventListener('change', this.handleFileSelect, false);
        this.refs.importTodo.addEventListener('change', this.handleFileSelect.bind(this), false)

    }

    handleFileSelect(event){
        let files = event.target.files; 
        readFile(files[0], (fileStr)=>{
            let fileJson = JSON.parse(fileStr)
            this.props.actions.importTodo(fileJson) 
        }) 
    }

    handleImportClick(e){
        e.preventDefault();  
        document.getElementById('importTodo').value='';
        document.getElementById('importTodo').click()
    }

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 

    _selectMode(){
        return this.props.mode ===   todoActions.todoMode.select
    }

    renderBanner (){
        const style = this.getStyle() 
        const butLable = this._selectMode() ? "退出选择" : "选择模式"
        return (
            <div  className="todo-list-banner" >
                <div>
                    <FlatButton label=  { butLable }
                        style ={style.selectBut } 
                        primary={true}  />
                </div>
                {
                    this._selectMode() 
                    && 
                     <div style={ style.selectLabel }>
                        <Checkbox
                            label="全选"
                        />
                    </div>
                }

                <div  className="mertic-tips">
                    <span>
                        重要=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 255, 66, 0.56)'}} 
                        />
                        紧急=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(244, 67, 54, 0.56)'}} 
                        />

                        困难=
                        <Badge
                            badgeContent={''}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                            style={ style.badgeContent}
                        />
                    </span>
                    <br/>
                </div>
            </div>
        )
    }

    renderOpGrounp(){
        const { actions } = this.props
        const style = this.getStyle() 
        return (
            this._selectMode() 
            && 
                <div  className="todolistOpGroup">
                    <FlatButton label="导出" 
                        onClick={(e) => this.props.onExportClick() }  
                        style={ style.flatButton }  />
                    <FlatButton label="导入" 
                        onClick={(e) => this.handleImportClick(e) }  
                        style={ style.flatButton }  />
                    <ClearAllBut
                        actions={ actions }
                       />

                </div>
        )
    }

    render() {
        const { actions, tags, mode } = this.props

        const style = this.getStyle() 

        return (           
                <div  className="todoList">
                 { this.renderBanner () }
                <List  style={style.list}>
                {this.props.todos.map((todo, index)  =>
                                      <Todo {...todo}
                                          key={todo.uuid}
                                          index={index}
                                          actions={actions}
                                          allTags={ tags }
                                          mode = { mode }
                                          onClick={() => this.props.onTodoClick} />
                                     )}


                </List>
                <Divider inset={true}/>

                 { this.renderOpGrounp() }
                <input type="file" id="importTodo" ref='importTodo'   style={{ display: 'none'}} />
                <br/>
            </div>
        )
    }
}

TodoList.propTypes = {
  actions: PropTypes.object.isRequired,
  onTodoClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired).isRequired,

  mode: PropTypes.number.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
}

TodoList.style = {
    flatButton: {
        float: "right",
        marginBottom: "10px",
    },
    list: {
        marginBottom: "30px", 
        clear: "both",
    },
    badge: {
        marginTop: '22px',
        width: '20px',
        height: '20px',
    },
    badgeContent:{
        padding: '24px 24px 12px 0' ,
        marginRight: '5px',
    },
    selectLabel:{
        maxWidth: '250px',
        width: '100px',
        fontSize: 'smaller',
        display: 'inline-block',
    },
    selectBut: {
        marginBottom: '10px',
    }
}
