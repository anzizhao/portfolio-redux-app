import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

import ActionGrade from 'material-ui/lib/svg-icons/action/grade';

import Colors from 'material-ui/lib/styles/colors';
import Icon from 'react-fa';



import TodoSubBut from './todoSubBut';
import TodoSubItem from './todoSub';

import Tags from './tags';
import TodoMenu from './TodoMenu';
import Mertic from './metric';
import TakeRate from './takeRate';
import SelectTags from './selectTags';


export default class Todo extends Component {
    // 本地的变量  因为要需要取消掉的 其实可以考虑undo
   static rateType = {
        importance: 1,
        urgency: 2,
        difficulty: 3,
   };    
    state = {
        toEditItem : false,
        initRate: false,
        tags: [],
        urgency: 0, //紧急程度
        importance: 0,  //重要程度
        difficulty: 0,   //困难程度
        itemText: ''
    };
    componentWillMount(){

    }
    componentWillReceiveProps (nextProps) {
        const props = nextProps
        this.setState({
            importance: props.importance,
            urgency : props.urgency ,
            difficulty: props.difficulty,
            itemText: props.text,
            tags: props.tags,
        });
    }


    handleChangeItem(e) {
        this.setState({
            itemText: e.target.value,
        });
    }
    handleRate (e, type, count){ 
        const r = Todo.rateType
        let state = {
            initRate: false, 
        }
        switch(type) {
            case r.importance:
                state.importance = count
                break;
            case r.urgency:
                state.urgency = count
                break;
            case r.difficulty:
                state.difficulty = count
                break;
            defalut: 
                return 
        }
        //更新相关的对象
        this.setState(state);
    } 


    _leaveEditMode(id){
        this.props.actions.uneditTodo(id)
        this.setState({
            initRate: true, 
        })
    }

    handleSaveTodo(){
        let id 
        id = this.props.id

        let item = {
            text: this.state.itemText, 
            importance: this.state.importance,
            difficulty: this.state.difficulty,
            urgency: this.state.urgency, 
            tags: this.state.tags 
        }
        this.props.actions.saveTodo(id, item)
        this._leaveEditMode(id)
    }
    handleUnsaveTodo(){
        let id = this.props.id
        this._leaveEditMode(id)
    }


    handleTagChange(e) {
        // target options array,  the last ele id is empty '', that means add new value
        var opts = e.target.selectedOptions
        if( ! opts ){
            return 
        } 
        var ele = opts[opts.length-1]
        if ( ele.id === '' ) {
            //new value, set  
            this.props.actions.addTags(ele.id, ele.text)
        }
        // 这个不需要render的
        var tags = []
        for(let i=0; i<opts.length; i++) {
            let item = opts[i]
            tags.push(
                {id: item.id, text:item.text }
            ) 
        }
        this.state.tags = tags 
    }
    getStyle (){
        const style =  this.constructor.style
        const dStyle = {
            listItemDiv: {
                display:  this.props.collapse ? 'block' : 'none'
            },

            listItem: {
                //textDecoration: this.props.completed ? 'line-through' : 'none',
                //cursor: this.props.completed ? 'default' : 'pointer',
                //display:  this.props.collapse ? 'block' : 'none'
            },
            editTodo: {
                display: ! this.props.collapse ? 'block' : 'none',
            },
            listTextSpan: {
                textDecoration: this.props.completed ? 'line-through' : 'none',
            },
        }
        return Object.assign({}, style, dStyle) 
    } 

    renderConclusion(subItems){
        const { id, conclusion } = this.props
        let index = 1
        //结论
        if ( conclusion ) {
            subItems.push(<TodoSubItem
                          todoId = { id }
                          key="conclusion" 
                          index={index} 
                          parentIndex={this.props.index+1}
                          { ...conclusion } 
                          actions={this.props.actions} /> )
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
                结论:  { conclusion.text }
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
                          <Tags tags={this.state.tags } /> 
                          <Mertic 
                              importance={this.state.importance}
                              urgency = { this.state.urgency}
                              difficulty={ this.state.difficulty}
                          />
                     </span>
                         )
    }
    getTakeRateParam(){
        return  {
            values: {
                importance: this.state.importance  ,
                urgency: this.state.urgency, 
                difficulty: this.state.difficulty ,
            } ,
            handles: {
                importance: (e, count)=>{ this.handleRate(e, Todo.rateType.importance, count)}  ,
                urgency:   (e, count)=>{ this.handleRate(e, Todo.rateType.urgency, count)}, 
                difficulty:  (e, count)=>{ this.handleRate(e, Todo.rateType.difficulty, count)}  
            } ,
            initRate: this.state.initRate
        }
    }

    render() {
        const { id, conclusion, allTags, actions } = this.props
        const style = this.getStyle() 

        const listText =  this.renderText(style) 

        // listItem 组建必需的左右icon button 必需为button  所有使用a 包裹住
        const rightIconMenu = (
            <a className="btn" type="button"> 
                <TodoMenu
                    todoId={id}
                    actions={ actions }
                />
            </a> 
        )

        const { secondaryText, secondaryTextLines, subItems } = this.renderSub(style)
        const takeRateParam = this.getTakeRateParam() 

        return (
            <div className="todo-item">
                <div style={style.listItemDiv }>
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
                </div>
                <div style={style.editTodo } >
                    <label>{ this.props.index + 1 } </label>
                    <TextField
                        className='item-input'
                        fullWidth
                        value={this.state.itemText}
                        onChange={(e)=>this.handleChangeItem(e)}
                        onEnterKeyDown ={(e) => this.handleSaveTodo()}
                    />
                    <TakeRate 
                        {...takeRateParam} />

                    <SelectTags  
                        onChange={ this.handleTagChange.bind(this)} 
                        allTags = { allTags } 
                        select={ this.state.tags }
                    />

                    <div style={style.opButGroup }>
                        <FlatButton label="完成" onClick={(e) => this.handleSaveTodo() }  style={ style.flatButton }  />
                        <FlatButton label="取消" onClick={(e) => this.handleUnsaveTodo() }  style={ style.flatButton }  />
                    </div>
                </div>


            </div>
        )
    }

}




Todo.propTypes = {
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    allTags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired).isRequired
}

//static style 
Todo.style = {
    opButGroup: {
        float: 'right',
    },
    listTextSpan: {
        float: 'left',
    },
    secondtext: {
        marginTop: '25px',
        marginLeft: '30px',
        marginRight: '30px',
    },
    selectTag:{
        width: "100%" 
    } 

}
