import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
import Icon from 'react-fa'



import  Immutable from 'immutable'
import ReactTooltip from "react-tooltip"
import {todoSubItemStatus, todoSubItemType } from '../../actions/todo/actions'
import Tags from './tags';



var {parseInput} = require('../../util');



export default class TodoSubItem extends Component {

    state = {
        itemText: '',
    };
    handleChangeItem(e) {
        let text = e.target.value
        this.setState({
            itemText: text,
        })
    }
    _saveTodoSub(originText){
        let todoId = this.props.todoId
        let processId = this.props.id
        let type = this.props.type
        const processItem  = parseInput( originText )

        this.props.actions.saveTodoSub (todoId, processId, type, processItem )
    }
    handleEnterKeyDown (e) {
        let text = e.target.value
        this._saveTodoSub(text)
    }

    handleClickLable(e){
        let text = this.props.text 
        this._saveTodoSub(text)
    }

    handleClickTextItem(e) {
        var id = this.props.todoId 
        var processId = this.props.id 
        var type = this.props.type
        var text  = ''
        if ( this.props.tags instanceof Array  ) {
            this.props.tags.forEach((item, index, arr)=>{
                if ( index === 0 ) {
                    text = "( " 
                }
                text += item.text 
                if ( index === arr.length-1 ) {
                    text += " ) " 
                } else {
                    text += " ," 
                }
            })
        }
        text += this.props.text
        this.props.actions.toeditTodoSub (id, processId, type )
        this.setState({
            itemText: text,
        })
    }
    handleDelItem (e) {
        e.stopPropagation()
        let todoId = this.props.todoId
        let processId = this.props.id
        let type = this.props.type

        this.props.actions.todelTodoSub (todoId, processId, type)
    }
    isEditStatus( _status ){
        const status = _status || this.props.status
        return  status === todoSubItemStatus.edit 
    }
    isShowStatus   ( _status )  {
        const status = _status || this.props.status
        return  status === todoSubItemStatus.show
    }

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {
            editTodo: {
                display: this.isEditStatus() ? 'block' : 'none',
            },
            listItem: {
                display: this.isShowStatus() ?  'block' : 'none',
            },
        }
        return Object.assign({}, style, dStyle) 
    } 
    componentDidMount () {
        const props = this.props 
        if( this.isEditStatus(props.status) ) {
            const ele = ReactDOM.findDOMNode(this._input)
            ele.getElementsByTagName('textarea')[1].focus()
        }
    }

    componentDidUpdate() {
        const props = this.props 
        if( this.isEditStatus(props.status) ) {
            const ele = ReactDOM.findDOMNode(this._input)
            ele.getElementsByTagName('textarea')[1].focus()
        }
    }
    //componentWillReceiveProps() {
    //const props = this.props 
    //if( this.isEditStatus(props.status) ) {
    //const ele = ReactDOM.findDOMNode(this._input)
    //ele.getElementsByTagName('textarea')[1].focus()
    //}
    //}
    //
    //
    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.todo, this.props.todo ) && nProps.index === this.props.index && nProps.status === this.props.status )  {
            //这个组件有自己的状态的 ,状态相同时候  不更新   应该将接受外面变量的跟自己有状态变化分开
            if ( nState.itemText === this.state.itemText ) {
                return false 
            }
        }
        return true  
    }

    renderText(subIndex,  style){
        let indexView, atView, beforeATagView ,
            ATagView, afterATagView 

        let atSubProcess = /@[0-9\\.]*/ 
        let match , at  

        indexView = `${subIndex}.    `
        if ( ! this.props.aTag ) {
            // 默认beforeATagView  
            beforeATagView = this.props.text 
        } else {
            //before url, after url 
            let startIndex = this.props.text.indexOf(this.props.aTag)
            beforeATagView = this.props.text.substring(0, startIndex)
            afterATagView  = this.props.text.substring(startIndex+this.props.aTag.length)
            ATagView = (
                    <a href={this.props.aTag } target="_blank" >
                        {this.props.aTag }
                    </a>
            ) 
        }

        //@1.2  sub process
        match = atSubProcess.exec( beforeATagView ) 
        if( match ) {
            at = match[0] 
        } else {
            if ( afterATagView ) {
                match = atSubProcess.exec(afterATagView) 
                if ( match ) {
                    at = match[0] 
                }
            }
        }
        atView = (
            at &&
                <a href={'#' + at.substring(1) } className="at-view">
                { at }
                </a>
        )
        return   (
            <span  style={style.listTextSpan} id={subIndex}>
                { indexView }
                { atView }
                { beforeATagView }
                { ATagView  }
                { afterATagView }
            </span>
        ) 

    }

    render() {
        const style = this.getStyle() 

        const rightIcon = (<Icon size="lg" 
                               name="times-circle-o"
                               style={style.delIcon}
                               onClick={ this.handleDelItem.bind(this) }
                           /> )
       let leftIcon 
       if ( this.props.type === todoSubItemType.process ) {
           leftIcon  = <Icon size="lg" name="reply" style={style.iconReply} />
       } else {
           leftIcon  = <Icon size="lg" name="tag" style={style.iconTag} />
       }
       const lastDate = new Date(this.props.lastTime).toLocaleDateString()
       //const textPart = `${subIndex}.    ${this.props.text} `
       //const textPart =  this.renderText() 

       let subIndex = String(this.props.parentIndex) + '.'  + String(this.props.index)

       //const lastDate = this.props.lastTime 
       const listText = (
           <span >
               { this.renderText( subIndex, style ) }
               <Tags tags={this.props.tags } subTag={true} /> 
               <div style={style.lastDate } >最后编辑
                   <span style={style.date }>{lastDate}</span>  
               </div>
           </span>
       )
       return (
            <div className="todo-item-sub">
                   <ListItem 
                       primaryText={ listText } 
                       style={ style.listItem } 
                       rightIconButton={ rightIcon }
                       leftIcon={ leftIcon }
                       onDoubleClick={ this.handleClickTextItem.bind(this) }
                   />
                   <div style={style.editTodo } >
                       <label
                           onDoubleClick ={(e)=>this.handleClickLable(e) }
                           data-tip data-for={'subItemLable' + subIndex } data-place='left'  
                           style={style.editLabel}

                       >{ subIndex } </label>
                       <TextField
                           className='item-input'
                           fullWidth
                           multiLine={true}
                           value={this.state.itemText}
                           onChange={(e)=>this.handleChangeItem(e) }
                           onEnterKeyDown ={(e)=>this.handleEnterKeyDown(e) }
                           ref={(c) => this._input = c}
                       />
                   </div>

                   <ReactTooltip id={'subItemLable' + subIndex }  type='warning' delayShow={1000}>
                       <span>双击退出编辑</span>
                   </ReactTooltip>
            </div>
       )
    }
}

TodoSubItem.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    actions: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    todoId: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    parentIndex: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    aTag: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })), 

    lastTime: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
}


TodoSubItem.style = {
    listTextSpan: {
        float: 'left',
    },
    delIcon: {
        marginTop: '15px', 
    },
    lastDate: {
        float: 'right', 
        fontSize: '12px',
        fontStyle: 'italic',
        margin: '18px',
        color: 'rgba(93, 89, 89, 0.74)'
    },
    iconReply: {
        color: 'rgba(102, 214, 91, 0.89)',
    },
    iconATag: {
        color: 'rgba(102, 214, 91, 0.89)',
    },
    iconTag: {
        color: 'rgba(236, 192, 90, 0.84)',
    },
    editLabel: {
        cursor: 'pointer',
    }
}

