import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
//import parseInput from '../../util' 

export default class FooterFilterText extends Component {
    state = {
        toEditItem : false,
        addTodoText: ''
    };
    handleSubmit(e) {
        e.preventDefault()
        const value =  e.target.value 
        if ( value ) {
            //const text = value.trim()
            const {tags, text} = parseInput( value.trim() )

            tags &&  this.props.actions.addTagsBatch(tags )

            this.props.actions.addTodo(text, tags)

            const dom = ReactDOM.findDOMNode(this.refs.iFooterFilterText)
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
            form: {
                marginBottom: '30px', 
            }
        };
        return (
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)} style={style.form} >
                        <TextField
                            floatingLabelText="添加todo项 按Enter确认"
                            fullWidth
                            onEnterKeyDown = {(e) => this.handleEnterKeyDown (e) }
                            ref="iFooterFilterText" 
                        />
                </form>
            </div>
        )
    }
}

FooterFilterText.propTypes = {
    actions: PropTypes.object.isRequired,
}
