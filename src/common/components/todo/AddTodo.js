import React, { Component, PropTypes } from 'react'
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

export default class AddTodo extends Component {
    handleSubmit(e) {
        e.preventDefault()
        const node = this.refs.iAddTodo
        const value = node.getValue()
        if ( value ) {
            const text = value.trim()
            this.props.onAddSubmit(text)
            node.setValue('')
        }
    }

    handleKeyPress(e) {
        if(e.charCode == 13){
            e.preventDefault()
            this.handleSubmit(e);
        }
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
                        onKeyPress={(e) => this.handleKeyPress(e) }  
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
