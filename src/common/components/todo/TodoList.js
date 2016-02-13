import React, { Component, PropTypes } from 'react'
import Todo from './Todo'
import * as todoAction  from '../../actions/todo/actions'

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import FlatButton from 'material-ui/lib/flat-button';

var {exportFile} = require('../../util')

export default class TodoList extends Component {
    //handleExport(e) {
        //e.preventDefault()
        //const jsonFile = JSON.stringify( this.props.todos);
        //const filename = `todo_${ new Date().toLocaleDateString() }.json`;
        //exportFile(jsonFile, filename);
    //}
    render() {
        const { actions } = this.props

        const style = {
            flatButton: {
                float: "right",
                marginBottom: "10px",
            },
            list: {
                marginBottom: "30px", 
            }
        };

        return (
            <div>
                <List  style={style.list}>
                {this.props.todos.map((todo, index)  =>
                                      <Todo {...todo}
                                          key={todo.id}
                                          index={index}
                                          actions={actions}
                                          onClick={() => this.props.onTodoClick(todo.id)} />
                                     )}


                </List>
                <Divider inset={true}/>

                <FlatButton label="导出" onClick={(e) => this.props.onExportClick() }  style={ style.flatButton }  />
                <br/>
            </div>
        )
    }
}

TodoList.propTypes = {
  actions: PropTypes.object.isRequired,
  onTodoClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
}
