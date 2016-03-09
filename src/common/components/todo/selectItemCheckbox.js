import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Checkbox from 'material-ui/lib/checkbox';


// 选择模式下  勾选框组建
export default class SelectItemCheckbox extends Component {
    shouldComponentUpdate (nProps, nState) {
        if ( nProps.select === this.props.select && nProps.mode === this.props.mode ) {
            return false  
        }
        return true  
    }
    clickCheckbox(e, checked ){
        const { actions, id } = this.props
        const value =  checked
        actions.selectTodo(id, value)
    }
    render() {
        const { actions, id, select } = this.props
        return (
            <Checkbox 
                checked={ select }
                onCheck={ (e, checked)=> { this.clickCheckbox(e, checked) }} 
                />
        )  
    }
}

SelectItemCheckbox.propTypes = {
    id: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    //update data 
    select: PropTypes.bool.isRequired,
    mode: PropTypes.number.isRequired,
}


