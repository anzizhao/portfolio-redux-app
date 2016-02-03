import React, { Component, PropTypes } from 'react'
import FlatButton from 'material-ui/lib/flat-button';

export default class AddTodo extends Component {
    handleSubmit(e) {
        e.preventDefault()
        const node = this.refs.input
        const text = node.value.trim()
        if (text) {
            this.props.onAddSubmit(text)
            node.value = ''
        }
    }

    handleKeyPress(e) {
        e.preventDefault()
        if(e.charCode == 13){
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
                    <input type="text" ref="input" placeholder="todo项 按Enter确认" 
                    onKeyPress={(e) => this.handleKeyPress(e) }  />
                    <FlatButton label="添加"  type="submit" style={ style.flatButton }  />
                 
                </form>
            </div>
        )
    }
}

AddTodo.propTypes = {
    onAddSubmit: PropTypes.func.isRequired,
}
