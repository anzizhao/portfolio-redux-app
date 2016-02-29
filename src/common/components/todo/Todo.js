import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

import ActionGrade from 'material-ui/lib/svg-icons/action/grade';

import Colors from 'material-ui/lib/styles/colors';




import TakeRate from './takeRate';
import SelectTags from './selectTags';
import TodoItemList from './todoItemList';


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

    componentDidMount () {
        const props = this.props 
        if( ! this.props.collapse )  {
            const ele = ReactDOM.findDOMNode(this._input)
            ele.getElementsByTagName('textarea')[1].focus()
        }

    }

    componentDidUpdate() {
        const props = this.props 
        if( ! this.props.collapse )  {
            const ele = ReactDOM.findDOMNode(this._input)
            ele.getElementsByTagName('textarea')[1].focus()
        }
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
                state.importance = count;
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
        let id = this.props.id
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
        if( ! opts || ! opts.length ){
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
        this.setState({ tags: tags })
        //this.state.tags = tags 
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
        const takeRateParam = this.getTakeRateParam() 
        const _tags = allTags.map((item, index) => {
            return {
                id: index+1,
                text: item.text
            } 
        })


        return (
                <div className="todo-item">
                    <div style={style.listItemDiv }>
                        <TodoItemList 
                        difficulty={this.state.difficulty}
                        importance={this.state.importance} 
                        urgency={this.state.urgency} 
                        {...this.props}
                        />
                    </div>
                    <div style={style.editTodo } >
                        <label>{ this.props.index + 1 } </label>
                        <TextField
                        className='item-input'
                        fullWidth
                        multiLine={true}
                        value={this.state.itemText}
                        onChange={(e)=>this.handleChangeItem(e)}
                        onEnterKeyDown ={(e) => this.handleSaveTodo()}
                        ref={(c) => this._input = c}
                        />
                        <TakeRate 
                        {...takeRateParam} />

                        <SelectTags  
                            onChange={ this.handleTagChange.bind(this)} 
                            allTags = { _tags } 
                            select={ this.props.tags }
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
    id: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })),
    conclusion: PropTypes.object,
    collapse: PropTypes.bool.isRequired,

    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    mode: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    allTags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })).isRequired
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
