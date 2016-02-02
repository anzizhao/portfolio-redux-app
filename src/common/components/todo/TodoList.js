import React, { Component, PropTypes } from 'react'
import Todo from './Todo'

var {exportFile} = require('../../util')

export default class TodoList extends Component {
    //handleExport(e) {
        //e.preventDefault()
        //const jsonFile = JSON.stringify( this.props.todos);
        //const filename = `todo_${ new Date().toLocaleDateString() }.json`;
        //exportFile(jsonFile, filename);
    //}
    render() {
        return (
            <div>
                <ul>
                {this.props.todos.map(todo =>
                                      <Todo {...todo}
                                      key={todo.id}
                                      onClick={() => this.props.onTodoClick(todo.id)} />
                                     )}
                                     </ul>
                 <button onClick={(e) => this.props.onExportClick() }>
                     导出待做事情 
                 </button>
            </div>
        )
    }
}

TodoList.propTypes = {
  onTodoClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
}
