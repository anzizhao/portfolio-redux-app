import React, { Component, PropTypes } from 'react'
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import Icon from 'react-fa'


export default class Todo extends Component {

    handleClick(){
        this.props.onClick(key); 
    }
  render() {

      const { id } = this.props
      const icon =(<Icon size="2x" name="times-circle-o" onClick={(e) =>  this.props.actions.delTodo(id)} /> )

    return (
      <ListItem insetChildren={true} primaryText={`${String(this.props.index+1)}.   ${this.props.text}`} 
        style={{
          textDecoration: this.props.completed ? 'line-through' : 'none',
          cursor: this.props.completed ? 'default' : 'pointer'
        }}
        rightIcon={ icon }
      />
    )
  }
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}
