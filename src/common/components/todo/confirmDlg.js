import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

export default class ConfirmDlg extends Component {

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
    handleConfirm = () => {
        this.props.op () 
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
                onTouchTap={ this.handleConfirm }
            />,
        ];
        return (  
            <div>
                <FlatButton label={this.props.buttonLabel } onClick={ this.handleOpenDialog.bind(this) }  style={ style.flatButton }  />
                <Dialog
                    title={ this.props.title }
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    {this.props.msg }
                </Dialog>

            </div>
        )
    }
}

ConfirmDlg.propTypes = {
    op: PropTypes.func.isRequired,
    msg: PropTypes.string,
    title: PropTypes.string,
    buttonLabel: PropTypes.string,
}
ConfirmDlg.style = {
    flatButton: {
        float: "right",
        marginBottom: "10px",
    },
}
