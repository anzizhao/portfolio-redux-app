import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import Icon from 'react-fa'
import ReactTooltip from "react-tooltip"

import  Immutable from 'immutable'

export default class TodoSubBut extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }

    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.todo, this.props.todo))  {
            return false 
        }
        return true  
    }

    componentWillReceiveProps (nextProps) {

    }

    handleAddProgress(e){
        event.stopPropagation()  
        var processFunc = this.props.actions.addTodoSubProcess
        var todoId = this.props.todoId
        processFunc( todoId )
        //console.log('AddProgress')
    }

    handleAddConclusion(e){
        event.stopPropagation()  
        var func = this.props.actions.addTodoSubConclusion
        var todoId = this.props.todoId
        func ( todoId )
        //console.log('AddConclusion')
    }

    render() {
        let style = {
            listItem: {}, 
            icon: {
                marginLeft: '10px', 
                marginRight: '10px', 
            }
        }
        return (
                <div  className='todo-sub-but'>
                        <Icon  name="reply" style={style.icon}  onClick={ this.handleAddProgress.bind(this) } 
                        data-tip data-for='reply' data-place='left'  
                            />
                        <Icon  name="tags" style={style.icon} onClick={ this.handleAddConclusion.bind(this) } data-tip data-for='tags' data-place='right' />
                        <ReactTooltip id='reply' type='warning' delayShow={200}>
                            <span>添加进度描述条</span>
                        </ReactTooltip>
                        <ReactTooltip id='tags' type='warning' delayShow={200}>
                            <span>添加结论条</span>
                        </ReactTooltip>
                </div>
                
        )
    }
}

TodoSubBut.propTypes = {
  actions: PropTypes.object.isRequired,
  todoId: PropTypes.number.isRequired,
  todo: React.PropTypes.instanceOf(Immutable.Map),

}
