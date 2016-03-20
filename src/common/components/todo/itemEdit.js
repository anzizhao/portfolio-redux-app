import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

import  Immutable from 'immutable'
import TakeRate from './takeRate';
import SelectTags from './selectTags';

export default class ItemEdit extends Component {
    constructor(props) {
        super(props);
        // 本地的变量  因为要需要取消掉的 其实可以考虑undo
        this.rateType = {
            importance: 1,
            urgency: 2,
            difficulty: 3,
        }    
        this.state = {
            toEditItem : false,
            initRate: false,
            tags: [],
            urgency: 0, //紧急程度
            importance: 0,  //重要程度
            difficulty: 0,   //困难程度
            itemText: ''
        }
    }

    componentWillReceiveProps (nProps) {
        if (Immutable.is(nProps.todo, this.props.todo ) )  {
            // nothing to update, retrun 
            return 
        }
        const props = nProps.todo.toObject() 
        this.setState({
            importance: props.importance,
            urgency : props.urgency ,
            difficulty: props.difficulty,
            itemText: props.text,
            tags: props.tags,
        });
    }
    focusInput(){
        const todo  = this.props.todo.toObject()
        if( ! todo.collapse )  {
            const ele = ReactDOM.findDOMNode(this._input)
            ele.getElementsByTagName('textarea')[1].focus()
        }
    }

    componentDidMount () {
        this.focusInput()
    }
    componentDidUpdate() {
        this.focusInput()
    }
    localStateCompare(nState) {
        var l = this.state
        var n = nState 
        return ["itemText", "urgency", "importance", "difficulty"]
            .every(key => {
                return n[key]  === l[key]
            })
    }

    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.todo, this.props.todo ) &&
             this.localStateCompare(nState) 
           )  {
            if( nProps.index === this.props.index ) {
                return false  
            } else if ( nProps.collpase === this.props.collapse && nProps.collapse === true ) {
            // 如果在隐藏的状态, 且将来也是隐藏 不更新 
                return false  
            }
        }
        return true  
    }
    getStyle (todo){
        const style =  this.constructor.style
        const dStyle = {
            editTodo: {
                display: ! todo.collapse ? 'block' : 'none',
            },
        }
        return Object.assign({}, style, dStyle) 
    } 

    handleChangeItem(e) {
        this.setState({
            itemText: e.target.value,
        });
    }

    handleSaveTodo(todo){
        let id = todo.id
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

    _leaveEditMode(id){
        this.props.actions.uneditTodo(id)
        this.setState({
            initRate: true, 
        })
    }

    handleUnsaveTodo(todo){
        let id = todo.id
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
    }

    handleRate (e, type, count){ 
        const r = this.rateType
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

    getTakeRateParam(){
        return  {
            values: {
                importance: this.state.importance  ,
                urgency: this.state.urgency, 
                difficulty: this.state.difficulty ,
            } ,
            handles: {
                importance: (e, count)=>{ this.handleRate(e, this.rateType.importance, count)}  ,
                urgency:   (e, count)=>{ this.handleRate(e, this.rateType.urgency, count)}, 
                difficulty:  (e, count)=>{ this.handleRate(e, this.rateType.difficulty, count)}  
            },
            initRate: this.state.initRate
        }
    }

    render() {
        const todo = this.props.todo.toObject()
        if ( todo.collapse ) { 
            return <div></div> 
        }

        const { actions } = this.props
        const allTags = this.props.allTags.toArray()
        const style = this.getStyle(todo) 
        const takeRateParam = this.getTakeRateParam() 
        const _tags = allTags.map((item, index) => {
            return {
                id: index+1,
                text: item.text
            } 
        })
        return (
            <div >
                <label>{ this.props.index + 1 } </label>
                <TextField
                    className='item-input'
                    fullWidth
                    multiLine={true}
                    value={this.state.itemText}
                    onChange={(e)=>this.handleChangeItem(e)}
                    onEnterKeyDown ={(e) => this.handleSaveTodo(todo)}
                    ref={(c) => this._input = c} 
                    />
                <TakeRate 
                {...takeRateParam} />

                <SelectTags  
                    onChange={ this.handleTagChange.bind(this)} 
                    allTags = { _tags } 
                    select={ todo.tags }
                />

                <div style={style.opButGroup }>
                    <FlatButton label="完成" onClick={(e) => this.handleSaveTodo(todo) }    />
                    <FlatButton label="取消" onClick={(e) => this.handleUnsaveTodo(todo) }  />
                </div>
            </div>
        )
    }
}

ItemEdit.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number.isRequired,
    collapse: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    allTags : React.PropTypes.instanceOf(Immutable.List),
}


ItemEdit.style = {
    opButGroup: {
        float: 'right',
    },
}
