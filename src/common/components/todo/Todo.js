import React, { Component, PropTypes } from 'react'
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';


import Icon from 'react-fa'

export default class Todo extends Component {
    state = {
        toEditItem : false,
        itemText: ''
    };

    handleEditItem (){
        //const node = this.refs.iTodoItem
        //node.setValue( this.props.text )
        this.setState({
            toEditItem : ! this.state.toEditItem,
            itemText: this.props.text
        });
    }

    handleEnterKeyDown (e, id) {
        const value =  e.target.value 
        if ( value ) {
            //const id = this.props.id
            const text = value.trim()
            this.props.actions.saveTodo(id, text)

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
    handleChangeStatus(e, id) {
        e.stopPropagation();
        this.props.actions.completeTodo(id)
    }
  render() {
      let style = {
            listItem: {
                textDecoration: this.props.completed ? 'line-through' : 'none',
                cursor: this.props.completed ? 'default' : 'pointer',
                display: ! this.state.toEditItem ? 'block' : 'none'
            },
            textField: {
              display: this.state.toEditItem ? 'inline-block' : 'none',
            }
      }
      const { id } = this.props
      //const icon =( 
                       //<Icon size="lg" name="pencil-square-o" onClick={() => this.toEditItem = true} /> 
                  //)

      const iconBut =( 
                      <Icon size="lg" name="times-circle-o" onClick={(e) => this.handleDelItem(e, id)  } /> 
                  )
      const iconToStop = ( 
                      <Icon size="lg" name="stop-circle-o" onClick={(e) => this.handleChangeStatus(e, id)  } /> 
                  )
      const iconToPlay = ( 
                      <Icon size="lg" name="play-circle-o" onClick={(e) => this.handleChangeStatus(e, id)  } /> 
                  )

      const listText = ( <span> <span>{ `${ String(this.props.index + 1) }.  ` }</span> {this.props.text} </span>)
        
    return (
        <div>
            <ListItem insetChildren={true} primaryText={ listText } 
                onClick={ () =>  this.handleEditItem()  }
                style={{
                    textDecoration: this.props.completed ? 'line-through' : 'none',
                    cursor: this.props.completed ? 'default' : 'pointer',
                    display: ! this.state.toEditItem ? 'block' : 'none'
                }}
                rightIconButton={ iconBut }
                leftIcon={ this.props.completed ? iconToPlay: iconToStop}
            />
            <div 
                style={{
                          display: this.state.toEditItem ? 'block' : 'none',
                      }}
            >
                 <label
                     onClick={ () =>  this.handleEditItem()  }
                 >{ this.props.index + 1 } </label>
                 <TextField
                     fullWidth
                     onEnterKeyDown = {(e) => this.handleEnterKeyDown (e, id) }
                     value={this.state.itemText}
                     onChange={(e)=>this.handleChangeItem(e)}
                 />
            </div>
            </div>
    )
  }
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  //key: PropTypes.number.isRequired
}
