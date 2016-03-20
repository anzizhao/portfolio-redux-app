import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import  Immutable from 'immutable'
import Tags from './tags';
import Mertic from './metric';

export default class TodoText extends Component {

    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.todo, this.props.todo ) && nProps.index === this.props.index )  {
            return false 
        }
        return true  
    }

    getStyle (todo){
        const style =  this.constructor.style
        const completed = todo.completed 
        const dStyle = {
            listTextSpan: {
                textDecoration:  completed ? 'line-through' : 'none',
            },
        }
        return Object.assign({}, style, dStyle) 
    } 

    render() {
        const todo = this.props.todo.toObject()
        const style = this.getStyle(todo) 
        const { index } = this.props
        let info  
        if( this.props.isSelect() ) {
            info = todo.fromfile 
        } else {
            info = todo.process.length || '' 
        }
       const createDate = new Date(todo.timestamp).toLocaleDateString()

        return  ( 
             <span > 
                 <span  style={style.listTextSpan}>
                 { `${ String( index  + 1) }.  ${ todo.text }        ` } 
                 </span>
                 <Tags tags={todo.tags} /> 
                 <span  style={ style.processNum}>
                     { info }
                 </span>
                 <Mertic 
                     importance={todo.importance}
                     urgency = {todo.urgency}
                     difficulty={ todo.difficulty}
                 />
                 <div style={style.lastDate } >
                     <span >{ createDate }</span>  
                 </div>
             </span>
        )
    }
}

TodoText.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number.isRequired,
    isSelect: PropTypes.func.isRequired,
}


TodoText.style = {
    listTextSpan: {
        float: 'left',
    },
    lastDate: {
        float: 'right', 
        fontSize: '12px',
        fontStyle: 'italic',
        margin: '18px',
        color: 'rgba(93, 89, 89, 0.74)'
    },
    processNum:{
        fontSize: '11px',
        fontWeight: 500,
        marginLeft: '10px',
        color: '#888',
    }
}
