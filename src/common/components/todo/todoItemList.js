import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';

import TodoSubBut from './todoSubBut';
import TodoSubItem from './todoSubItem';
import Tags from './tags';
import TodoMenu from './TodoMenu';
import Mertic from './metric';


import * as todoActions  from '../../actions/todo/actions'

import  Immutable from 'immutable'

export default class TodoItemList extends Component {

    getStyle (){
        const style =  this.constructor.style
        const collapse  = this.props.todo.get("collapse")
        const completed = this.props.todo.get("completed")
        const dStyle = {
            listItemDiv: {
                display:  collapse ? 'block' : 'none'
            },
            listTextSpan: {
                textDecoration:  completed ? 'line-through' : 'none',
            },

        }
        return Object.assign({}, style, dStyle) 
    } 

    _selectMode(){
        return  this.props.todo.get("mode") ===   todoActions.todoMode.select
    }


    renderConclusion(subItems, todo){
        const { id, conclusion  } = todo  
        const { index, actions} = this.props
        //结论
        if ( conclusion ) {
            subItems.push(<TodoSubItem
                          todoId = { id }
                          key="conclusion" 
                          index={1} 
                          parentIndex={index+1}
                          { ...conclusion } 
                          actions={actions} /> )
                          return    true 
        }
        return false 
    }


    renderProcess(subItems, i, todo){
        const {process, id} = todo  
        let index = i
        //过程描述
        if ( process.length != 0 ) {
            for( let item of process ) {
                subItems.push(<TodoSubItem
                              todoId = { id }
                              key={item.id} 
                              index={index} 
                              parentIndex={this.props.index+1 }
                              {...item} 
                              actions={this.props.actions} /> )

                              index += 1
            }
        }
    }

    renderSub(style, todo){
        const {conclusion, id} = todo  
        let secondaryText = '' 
        let secondaryTextLines   = 1
        let subItems = []
        let index = 1

        //结论
        if ( this.renderConclusion( subItems ,todo )) {
            index = 2 
            // 可以根据字数  设置多少行
            secondaryTextLines = 2
            secondaryText = (
                <span  style={style.secondtext} > 
                结论:  { conclusion.text }
                </span> 
            ) 
        }

        this.renderProcess(subItems, index, todo)

        // 操作按钮
        subItems.push(<TodoSubBut 
                          todoId = { id }
                          key="addBut"
                          actions={this.props.actions } /> )

                      return {
                          subItems,    
                          secondaryText,
                          secondaryTextLines
                      }              
    }

    renderText(style, todo ){
        const {text, tags, process, importance, urgency, difficulty, fromfile } = todo  
        const {index} = this.props

        let info  
        if( this._selectMode() ) {
            info = fromfile 
        } else {
            info = process.length || '' 
        }
        return  ( 
                 <span > 
                 <span  style={style.listTextSpan}>
                 { `${ String( index  + 1) }.  ${text}        ` } 
                 </span>
                 <Tags tags={tags } /> 
                 <span  style={style.processNum}>
                     { info }
                 </span>
                 <Mertic 
                     importance={importance}
                     urgency = { urgency}
                     difficulty={ difficulty}
                 />
                 </span>
                )
    }
    renderRightIconMenu(){
        const id = this.props.todo.get("id")
        return (
            <a className="btn" type="button"> 
                <TodoMenu
                    todoId={id}
                    actions={ this.props.actions }
                />
            </a> 
        ) 
    }

    clickCheckbox(e, checked ){
        //e.preventDefault()
        const { actions } = this.props
        const id = this.props.todo.get("id")
        const value =  checked
        actions.selectTodo(id, value)
    }

    renderCheckbox(){
        const id = this.props.todo.get("id")
        const select = this.props.todo.get("select")
        const { actions } = this.props
        return (
            <Checkbox 
                checked={ select }
                onCheck={ (e, checked)=> { this.clickCheckbox(e, checked) }} 
                />
        )  
    }

    render() {
        const todo = this.props.todo.toObject()
        const { id , collapse } = todo  
        const { actions } = this.props
        if ( ! collapse ) {
            return <div></div> 
        }
        const style = this.getStyle() 

        const listText =  this.renderText(style ,todo) 

        let rightIconMenu ,  leftCheckbox  
        let toggleNestedList = true
        let sub = {}
        if ( this._selectMode() ) {
            leftCheckbox = this.renderCheckbox()
            toggleNestedList = false  
        } else  {
            // listItem 组建必需的左右icon button 必需为button  所有使用a 包裹住
            rightIconMenu = this.renderRightIconMenu() 
            sub  = this.renderSub(style, todo)
        }
        // listItem 组建必需的左右icon button 必需为button  所有使用a 包裹住
        //const rightIconMenu = this.renderRightIconMenu() 
        //const { secondaryText, secondaryTextLines, subItems } = this.renderSub(style)

        //const leftCheckbox = this.renderCheckbox()

        return (
            <ListItem 
                leftCheckbox={ leftCheckbox }
                primaryText={ listText } 
                style={style.listItem }
                rightIconButton ={ rightIconMenu }
                primaryTogglesNestedList={true}

                secondaryText = { sub.secondaryText }
                secondaryTextLines =  { sub.secondaryTextLines }
                nestedItems={ sub.subItems }
            />
        )
    }
}

//有可能是空的数组  shape的isRequired 不太需要
TodoItemList.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,

    //completed: PropTypes.bool.isRequired,
    //id: PropTypes.number.isRequired,
    //conclusion: PropTypes.object,
    //collapse: PropTypes.bool.isRequired,
    //select: PropTypes.bool.isRequired,
    //text: PropTypes.string.isRequired,
    //fromfile: PropTypes.string.isRequired,
    //importance: PropTypes.number.isRequired,
    //urgency: PropTypes.number.isRequired,
    //mode: PropTypes.number.isRequired,
    //difficulty: PropTypes.number.isRequired,
    //tags: PropTypes.arrayOf(PropTypes.shape({
        //id: PropTypes.string.isRequired,
        //text: PropTypes.string.isRequired,
    //})), 
    //process: PropTypes.arrayOf(PropTypes.shape({
        //id: PropTypes.number.isRequired,
        //text: PropTypes.string.isRequired,
    //})), 

} 


TodoItemList.style = {
    listTextSpan: {
        float: 'left',
    },
    secondtext: {
        marginTop: '25px',
        marginLeft: '30px',
        marginRight: '30px',
    },
    processNum:{
        fontSize: '11px',
        fontWeight: 500,
        marginLeft: '10px',
        color: '#888',
    }
}
