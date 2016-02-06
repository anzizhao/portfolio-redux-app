import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

export default class AddTodo extends Component {
    state = {
        toEditItem : false,
        addTodoText: ''
    };
    handleSubmit(e) {
        e.preventDefault()
        const value =  e.target.value 
        if ( value ) {
            const text = value.trim()
            this.props.onAddSubmit(text)
            const dom = ReactDOM.findDOMNode(this.refs.iAddTodo)
            dom.getElementsByTagName('input')[0].value = ''
            //this.setState({addTodoText: ''})
        }
    }

    handleEnterKeyDown(e) {
        e.preventDefault()
        this.handleSubmit(e);
    }


    render() {
        const style = {
            flatButton: {
                float: "right",
                marginBottom: "10px",
            },
            form: {
                marginBottom: "30px", 
            }
        };
        return (
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)} style={style.form} >
                        <TextField
                        floatingLabelText="添加todo项 按Enter确认"
                        ref="iAddTodo" 
                        //value={ this.state.addTodoText }
                        onEnterKeyDown = {(e) => this.handleEnterKeyDown (e) }
                        fullWidth
                        />
                </form>
            </div>
        )
    }
}

AddTodo.propTypes = {
    onAddSubmit: PropTypes.func.isRequired,
}
