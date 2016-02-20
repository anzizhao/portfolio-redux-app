import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Colors from 'material-ui/lib/styles/colors';

export default class TodoMenu extends Component {

    handleDel (e ) {
        //e.stopPropagation()
        const del = this.props.actions.delTodo 
        const id = this.props.todoId 
        del(id) 
    }
    handleComplete (e ) {
        //e.stopPropagation();
        const id = this.props.todoId 
        this.props.actions.completeTodo(id)
    }
    handleUnComplete(e ) {
        //e.stopPropagation();
        const id = this.props.todoId 
        this.props.actions.uncompleteTodo(id)
    }

    handleEdit (e){
        //e.stopPropagation();
        const id = this.props.todoId 
        this.props.actions.editTodo(id)
    }

    render() {
        const { onEdit, onDel, onComplete, onUnComplete} = this.props
        const iconButtonElement = (
                <IconButton
                    touch={true}
                >
                    <MoreVertIcon color={Colors.grey400} />
                </IconButton>
           ) 
        return (
            <IconMenu 
                className='todo-icon-menu' 
                iconButtonElement={iconButtonElement}>
                <MenuItem 
                    onClick={ this.handleEdit.bind(this)}
                    primaryText="编辑"
                />
                <MenuItem
                    onClick={ this.handleDel.bind(this)} 
                    primaryText="删除"
                />
                <MenuItem
                    onClick={ this.handleComplete.bind(this) }
                    primaryText="完成"
                />
                <MenuItem
                    onClick={ this.handleUnComplete.bind(this) } 
                    primaryText="未完成"
                />
            </IconMenu>
        )
    }
}

TodoMenu.propTypes = {
    todoId: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
}
