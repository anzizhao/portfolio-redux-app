import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


import * as todoActions  from '../../actions/todo/actions'
import  Immutable from 'immutable'

import ListItem from 'material-ui/lib/lists/list-item';
//import TodoItemList from './todoItemList';
//
import ItemEdit from './itemEdit';
import SelectFromfile from './selectFromfile';

import TodoText from './todoText';
import TodoMenu from './TodoMenu';
import SubSecondaryText from './subSecondaryText';
import TodoSubBut from './todoSubBut';
import TodoSubItem from './todoSubItem';


import Checkbox from 'material-ui/lib/checkbox';

//import SelectItemCheckbox from './selectItemCheckbox';


export default class Todo extends Component {
    //state = {
    //toEditItem : false,
    //initRate: false,
    //tags: [],
    //urgency: 0, //紧急程度
    //importance: 0,  //重要程度
    //difficulty: 0,   //困难程度
    //itemText: ''
    //};

    //componentWillReceiveProps (nProps) {
    //const props = nProps.todo.toObject() 
    //}
    //
    constructor(props){
        super(props) 
        this._selectMode = this._selectMode.bind(this)
    }
    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.todo, this.props.todo)
            &&  nProps.index === this.props.index 
        &&  nProps.mode === this.props.mode){
            return false 

        }
        return true  
    }
    //
    _selectMode(){
        return  this.props.mode ===   todoActions.todoMode.select
    }
    getStyle (){
        const style =  this.constructor.style
        const todo  = this.props.todo.toObject()
        const dStyle = {
            listItemDiv: {
                display:  todo.collapse ? 'block' : 'none'
            },
            listTextSpan: {
                textDecoration: todo.completed ? 'line-through' : 'none',
            },
        }
        return Object.assign({}, style, dStyle) 
    } 

    clickCheckbox(e, checked, todo ){
        const { actions} = this.props
        const { id } = todo 
        const value =  checked
        actions.selectTodo(id, value)
    }

    renderCheckbox(todo){
        // List 限制为checkout
        //return (
        //<SelectItemCheckbox 
        //id={todo.id} 
        //actions={todo.actions} 
        //select={todo.select}
        //mode={ this.props.mode}
        ///>
        //)  
        if ( this._selectMode() ) {
            return (
                <Checkbox 
                    checked={ todo.select }
                    onCheck={ (e, checked)=> { this.clickCheckbox(e, checked, todo) }} 
                />
            )  
        } 
        return     

    }

    renderText(style, todo ){
        return  ( 
                 <TodoText 
                     todo={ this.props.todo }  
                     isSelect={ this._selectMode}
                     index={ this.props.index }
                 />
                )
    }

    renderMenu (todo){
        return (
            todo.collapse  && 
                <a className="btn" type="button"> 
                    <TodoMenu
                        todoId={ todo.id}
                        actions={ this.props.actions }
                    />
                </a> 
        ) 
    }

    renderSub(todo){
        const {conclusion,process, id} = todo 
        let subItems = []
        let index = 1
        //结论
        if ( conclusion ) {
            subItems.push(<TodoSubItem
                todoId = { id }
                key="conclusion" 
                index={index} 
                parentIndex={this.props.index+1}
                {...conclusion } 
                actions={this.props.actions} 
            /> )
        }

        //过程描述
        if ( process instanceof Array &&  process.length != 0 ) {
            for( let item of process ) {
                subItems.push(<TodoSubItem
                    todo={this.props.todo}
                    todoId = { id }
                    key={item.id} 
                    index={index} 
                    parentIndex={this.props.index+1 }
                    {...item} 
                    actions={this.props.actions} 
                />)

                index += 1
            }
        }

        // 操作按钮
        subItems.push(<TodoSubBut 
            todo={this.props.todo}
            todoId = { id }
            key="addBut"
            actions={this.props.actions } /> )
            return subItems 
    }

    render() {
        const { actions } = this.props
        const style = this.getStyle() 
        const todo = this.props.todo.toObject()

        const listText =  this.renderText(style ,todo) 
        const secondText = ! todo.conclusion ? '': 
            ( 
             <span  style= {style.secondtext} > 
                 结论:  { todo.conclusion.text }
             </span>
            ) 
            let leftCheckbox, rightIconMenu, subItems 

            if ( this._selectMode() ) {
                leftCheckbox = this.renderCheckbox(todo)
                //toggleNestedList = false  
            } else  {
                // listItem 组建必需的左右icon button 必需为button  所有使用a 包裹住
                rightIconMenu = this.renderMenu(todo) 
                subItems =  this.renderSub(todo)
            }

            //secondaryText = {<SubSecondaryText text={secondText} />}
            return (
                <div className="todo-item">
                    <div style={style.listItemDiv }>
                        <ListItem 
                            leftCheckbox={ leftCheckbox }
                            primaryText={ listText } 
                            style={style.listItem }
                            rightIconButton ={ rightIconMenu }
                            primaryTogglesNestedList={true}

                            secondaryText = {secondText}
                            secondaryTextLines =  {2}
                            nestedItems={ subItems }
                        />
                    </div>
                    <ItemEdit 
                        index={this.props.index }
                        todo={this.props.todo}
                        collapse = { todo.collapse }
                        actions={actions}
                        allTags = { this.props.allTags }
                    />
                    <SelectFromfile
                        todo={this.props.todo}
                        index={this.props.index }
                        toEditItem = { todo.toEditItem }
                        actions={actions}
                        files = { this.props.fromfiles }
                    />
                </div>
            )
    }

}

Todo.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    mode: PropTypes.number.isRequired,
    fromfiles: React.PropTypes.instanceOf(Immutable.List),
    onClick: PropTypes.func.isRequired,
    allTags: React.PropTypes.instanceOf(Immutable.List),
}

//static style 
Todo.style = {
    listTextSpan: {
        float: 'left',
    },
    selectTag:{
        width: "100%" 
    } 

}
