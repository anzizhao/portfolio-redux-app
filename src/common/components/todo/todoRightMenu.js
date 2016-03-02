import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TodoMenu from './TodoMenu';

export default class TodoRightMenu extends Component {
    shouldComponentUpdate (nProps, nState) {
        if( nProps.id === this.props.id  ) {
            return false  
        }
        return true  
    }
    render() {
        return (
            <a className="btn" type="button"> 
                <TodoMenu
                    todoId={this.props.id}
                    actions={ this.props.actions }
                />
            </a> 
        )
    }
}

TodoRightMenu.propTypes = {
    actions: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
}

