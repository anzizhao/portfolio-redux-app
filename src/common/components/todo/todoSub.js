import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa'


export default class TodoSubButList extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        };
    }



    componentWillReceiveProps (nextProps) {
        if ( nextProps.initHasSignStar && ! this.props.initHasSignStar ) {
        }
    }


    render() {
        const {  count, star , onlyShow, rightSide } = this.props
        const rightIcon = (<Icon size="2x" name="times-circle-o" onClick={ (e)=> {}} >)
        let style = {}
        if(rightSide){
            style.float = 'right'
        }
        
        return (
            <div className="todo-item-sub">
                <ListItem 
                    primaryText={ listText } 
                    style={style.listItem}
                    rightIconButton={ rightIcon }
                />
            </div>
        )
    }
}
                //<div style={style.editTodo } >
                     //<label
                     //>{ this.props.index + 1 } </label>
                     //<TextField
                        //className='item-input'
                         //fullWidth
                         //value={this.state.itemText}
                         //onChange={(e)=>this.handleChangeItem(e)}
                     ///>

                    //<div style={style.opButGroup }>
                        //<FlatButton label="完成" onClick={(e) => this.handleSaveTodo() }  style={ style.flatButton }  />
                        //<FlatButton label="取消" onClick={(e) => this.handleUnsaveTodo() }  style={ style.flatButton }  />
                    //</div>
                //</div>

TodoSubButList.propTypes = {

}
