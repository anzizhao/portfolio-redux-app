import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ListItem from 'material-ui/lib/lists/list-item';

import TodoSubBut from './todoSubBut';
import TodoSubItem from './todoSub';
import Tags from './tags';
import TodoMenu from './TodoMenu';
import Mertic from './metric';


export default class TodoItemList extends Component {

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {
            listItemDiv: {
                display:  this.props.collapse ? 'block' : 'none'
            },
            listTextSpan: {
                textDecoration: this.props.completed ? 'line-through' : 'none',
            },

        }
        return Object.assign({}, style, dStyle) 
    } 

    renderConclusion(subItems){
        const { id, conclusion , index, actions} = this.props
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


    renderProcess(subItems, i){
        let index = i
        //过程描述
        if ( this.props.process.length != 0 ) {
            for( let item of this.props.process ) {
                subItems.push(<TodoSubItem
                                  todoId = { this.props.id }
                                  key={item.id} 
                                  index={index} 
                                  parentIndex={this.props.index+1 }
                                  {...item} 
                                  actions={this.props.actions} /> )

                index += 1
            }
        }
    }

    renderSub(style){
        let secondaryText = '' 
        let secondaryTextLines   = 1
        let subItems = []
        let index = 1

        //结论
        if ( this.renderConclusion( subItems )) {
            index = 2 
            // 可以根据字数  设置多少行
            secondaryTextLines = 2
            secondaryText = (
                <span  style={style.secondtext} > 
                结论:  { this.props.conclusion.text }
                </span> 
            ) 
        }

        this.renderProcess(subItems, index)

        // 操作按钮
        subItems.push(<TodoSubBut 
                          todoId = { this.props.id }
                          key="addBut"
                      actions={this.props.actions } /> )

        return {
                    subItems,    
                    secondaryText,
                    secondaryTextLines
                }              
    }

    renderText(style){
        return  ( 
                     <span > 
                          <span  style={style.listTextSpan}>
                              { `${ String( this.props.index  + 1) }.  ${this.props.text}        ` } 
                          </span>
                          <Tags tags={this.props.tags } /> 
                          <Mertic 
                              importance={this.props.importance}
                              urgency = { this.props.urgency}
                              difficulty={ this.props.difficulty}
                          />
                     </span>
                         )
    }
    renderRightIconMenu(){
        return (
            <a className="btn" type="button"> 
                <TodoMenu
                    todoId={this.props.id}
                    actions={ this.props.actions }
                />
            </a> 
        ) 
    }


    render() {
        const { id , actions, collapse } = this.props
        if ( ! collapse ) {
            return <div></div> 
        }
        const style = this.getStyle() 

        const listText =  this.renderText(style) 

        // listItem 组建必需的左右icon button 必需为button  所有使用a 包裹住
        const rightIconMenu = this.renderRightIconMenu() 
        const { secondaryText, secondaryTextLines, subItems } = this.renderSub(style)

        return (
            <ListItem 
                primaryText={ listText } 
                secondaryText = { secondaryText }
                secondaryTextLines =  { secondaryTextLines }
                style={style.listItem}
                rightIconButton ={ rightIconMenu }
                primaryTogglesNestedList={true}
                nestedItems={subItems}
                key={ this.props.key }
            />
        )
    }
}

TodoItemList.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired), 
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
}
