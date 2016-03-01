import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
import Icon from 'react-fa'




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
    //shouldComponentUpdate (nProps, nState) {
        // 这里有对象的比较   immutablejs 就有用武之地
        // text 和tags 相等时候 不更新
        //if ( this.props.text === nProps.text && 
             //this.props.tags.length === nProps.tags.length  
           //)  {
            //let equal = this.props.tags.every((item, index) =>{
                    //return item.text === nProps[index].text
            //}) 
            //if ( equal ) {
                //return false 
            //}
        //}
        //return true  
    //}

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
       let subIndex = String(this.props.parentIndex) + '.'  + String(this.props.index)
       const lastDate = new Date(this.props.lastTime).toLocaleDateString()
       const textPart = `${subIndex}.    ${this.props.text} `
       //const lastDate = this.props.lastTime 
       const listText = (
           <span >
               <span  style={style.listTextSpan}>
                   { textPart } 
               </span>
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
    actions: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    todoId: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    parentIndex: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
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
    iconTag: {
        color: 'rgba(236, 192, 90, 0.84)',
    },
    editLabel: {
        cursor: 'pointer',
    }
}

