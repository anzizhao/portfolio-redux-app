import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import Icon from 'react-fa'


export default class TodoSubBut extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }

    componentWillReceiveProps (nextProps) {
    }

    handleAddProgress(e){
        event.stopPropagation()  
        console.log('AddProgress')
    }

    handleAddConclusion(e){
        event.stopPropagation()  
        console.log('AddConclusion')
    }

    render() {
        let style = {
            listItem: {}, 
            icon: {
                marginLeft: '10px', 
                marginRight: '10px', 
            }
        }
        const listText = (
            <div  className='todo-sub-but'>
                <Icon size="lg" name="reply" style={style.icon}  onClick={ this.handleAddProgress.bind(this) } />
                <Icon size="lg" name="tags" style={style.icon} onClick={ this.handleAddConclusion.bind(this) } />
            </div>
        )
        
        return (
            <div className="todo-item-sub">
                <div  className='todo-sub-but'>
                    <Icon size="xs" name="reply" style={style.icon}  onClick={ this.handleAddProgress.bind(this) } />
                    <Icon size="xs" name="tags" style={style.icon} onClick={ this.handleAddConclusion.bind(this) } />
                </div>
                
            </div>
        )
    }
}

                //<ListItem 
                    //primaryText={ listText } 
                    //style={style.listItem}
                ///>
TodoSubBut.propTypes = {

}
