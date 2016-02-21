import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

export default class ClearAllBut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    //这样些 就可以不bind this
    handleClose = () => {
        this.setState({open: false});
    };

    handleOpenDialog(){
        this.setState({
            open: true, 
        }) 
    }
    handleClearAll = () => {
        this.props.actions.clearAllTodo() 
        this.setState({
            open: false, 
        }) 
    };

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 
    render() {
        const style = this.getStyle() 
        const actions = [
            <FlatButton
                label="取消"
                secondary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="确认"
                primary={true}
                keyboardFocused={true}
                onTouchTap={ this.handleClearAll }
            />,
        ];
        return (  
            <div>
                <FlatButton label="清除" onClick={ this.handleOpenDialog.bind(this) }  style={ style.flatButton }  />
                <Dialog
                    title="!!!! 注意"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    确认清除所有todo项，建议删除前先导出备份
                </Dialog>

            </div>
        )
    }
}

ClearAllBut.propTypes = {
    actions: PropTypes.object.isRequired,
}
ClearAllBut.style = {
    flatButton: {
        float: "right",
        marginBottom: "10px",
    },
}
