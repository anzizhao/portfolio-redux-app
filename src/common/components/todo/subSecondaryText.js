import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class subSecondaryText extends Component {

    shouldComponentUpdate (nProps, nState) {
        if( nProps.text === this.props.text ) {
            return false  
        }
        return true  
    }
    getStyle (){
        const style =  this.constructor.style
        return  style  
    } 
    render() {
        const style = this.getStyle() 
        const { text } = this.props
        return (
            <span  style= {style.secondtext} > 
                结论:  { text }
            </span> 
        )
    }
}

subSecondaryText.propTypes = {
    text: PropTypes.string.isRequired,
}

subSecondaryText.style = {
    secondtext: {
        marginTop: '25px',
        marginLeft: '30px',
        marginRight: '30px',
    },
}

