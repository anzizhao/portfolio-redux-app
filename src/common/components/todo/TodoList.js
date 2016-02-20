import React, { Component, PropTypes } from 'react'
import Todo from './Todo'
import * as todoAction  from '../../actions/todo/actions'

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import FlatButton from 'material-ui/lib/flat-button';

import Badge from 'material-ui/lib/badge';

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
        document.getElementById('importTodo').click()
    }

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 

    render() {
        const { actions, tags } = this.props

        const style = this.getStyle() 

        return (           
                <div  className="todoList">
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
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                        />
                    </span>
                    <br/>
                </div>
                <List  style={style.list}>
                {this.props.todos.map((todo, index)  =>
                                      <Todo {...todo}
                                          key={todo.uuid}
                                          index={index}
                                          actions={actions}
                                          allTags={ tags }
                                          onClick={() => this.props.onTodoClick(todo.id)} />
                                     )}


                </List>
                <Divider inset={true}/>

                <div  className="todolistOpGroup">
                    <FlatButton label="导出" onClick={(e) => this.props.onExportClick() }  style={ style.flatButton }  />
                    <FlatButton label="导入" onClick={(e) => this.handleImportClick(e) }  style={ style.flatButton }  />
                </div>
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
    }
}
