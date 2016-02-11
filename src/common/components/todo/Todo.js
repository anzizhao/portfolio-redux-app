import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

import ActionGrade from 'material-ui/lib/svg-icons/action/grade';

import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';

import Icon from 'react-fa'
import StarRate from './starRate'

export default class Todo extends Component {
    state = {
        toEditItem : false,
        initHasSignStar: false,
        itemText: ''
    };

    handleEditItem (id){
        this.props.actions.editTodo(id)
        this.setState({
            itemText: this.props.text,
            initHasSignStar: true
        });
    }

    handleUNEditItem (id){
        this.props.actions.uneditTodo(id)
        this.setState({
            itemText: this.props.text,
            initHasSignStar: true 
        });
    }

    handleEnterKeyDown (e, id) {
        const value =  e.target.value 
        if ( value ) {
            //const id = this.props.id
            const text = value.trim()
            const count = this.props.urgency 
            this.props.actions.saveTodo(id, text, count)

            this.setState({
                toEditItem : ! this.state.toEditItem,
            });
        }
    }

    handleDelItem (e, id) {
          e.stopPropagation();
          this.props.actions.delTodo(id)
    }
    handleChangeItem(e) {
        this.setState({
            itemText: e.target.value,
        });
    }
    handleComplete(e, id) {
        e.stopPropagation();
        this.props.actions.completeTodo(id)
    }
    handleUNComplete(e, id) {
        e.stopPropagation();
        this.props.actions.uncompleteTodo(id)
    }

    handleSignStar  (e, id, starCount){ 
        return   this.props.actions.signStar(id, starCount) 
    } 

    initHasSignStar (){ 
        this.setState({
            initHasSignStar: false ,
        });
    } 

    _leaveEditMode(id){
        this.initHasSignStar()
        this.props.actions.uneditTodo(id)
    }

    handleSaveTodo(){
        let id, text, count 
        id = this.props.id
        text = this.state.itemText
        count = this.props.urgency
        this.props.actions.saveTodo(id, text, count)
        this._leaveEditMode(id)
    }
    handleUnsaveTodo(){
        let id = this.props.id
        this._leaveEditMode(id)
    }

    
  render() {
      const { id } = this.props
      const style = {
          listItem: {
              textDecoration: this.props.completed ? 'line-through' : 'none',
              cursor: this.props.completed ? 'default' : 'pointer',
              display:  this.props.collapse ? 'block' : 'none'
          },
          editTodo: {
              display: ! this.props.collapse ? 'block' : 'none',
          },
          opButGroup: {
              float: 'right',
          },
      };

      const listText = ( <span> <span>{ `${ String(this.props.index + 1) }.  ` }</span> {this.props.text} &nbsp;&nbsp;&nbsp;&nbsp; <StarRate star={this.props.urgency} onlyShow={true} />  </span>)

       const iconButtonElement = (
                 <IconButton
                   touch={true}
                 >
                   <MoreVertIcon color={Colors.grey400} />
                 </IconButton>
       ) 
      const rightIconMenu = (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem 
              onClick={ () =>  this.handleEditItem(id)  }
              primaryText="编辑"
          />
          <MenuItem
              onClick={(e) => this.handleDelItem(e, id) } 
              primaryText="删除"
          />
          <MenuItem
              onClick={(e) => this.handleComplete(e, id) }
              primaryText="完成"
          />
          <MenuItem
              onClick={(e) => this.handleUNComplete(e, id) } 
              primaryText="未完成"
          />
        </IconMenu>
      )

    return (
        <div className="todo-item">
            <ListItem insetChildren={true} primaryText={ listText } 
                style={style.listItem}
                rightIconButton={ rightIconMenu }
            />
            <div style={style.editTodo } >
                 <label
                 >{ this.props.index + 1 } </label>
                 <TextField
                     fullWidth
                     value={this.state.itemText}
                     onChange={(e)=>this.handleChangeItem(e)}
                 />
                 <div><span>紧急程度 <StarRate star={this.props.urgency}
                         clickStar={(e, count)=>this.handleSignStar(e, id, count)} 
                         initHasSignStar={ this.state.initHasSignStar }
                 />  </span></div>

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
}

