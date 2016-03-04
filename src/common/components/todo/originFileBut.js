import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/lib/flat-button';

export default class Tags extends Component {
    
    getStyle (){
        const style =  this.constructor.style
        let retStyle = {}
        if ( this.props.subTag ) {
            retStyle = {
                tagBadge:  style.subTagBadge, 
                badge3:  style.subBadge3,
            }             
        }
        return retStyle
    } 

    render() {
        const { file, select } = this.props
        return (
            <FlatButton label=  { file }
                style ={style.selectBut } 
                onClick={e => actions.toggleSelectMode() }
                primary={ ! select}  
                secondary={ select }
            />
        )
    }
}

Tags.propTypes = {
    subTag: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })),
}


Tags.style = {
    subTagBadge: {
        color: '#DC0D2A',
        padding: '.2em .4em .1em .2em',
        //borderTopLeftRadius: '18px',
        //borderBottomLeftRadius: '18px',
    },
    subBadge3: {
        borderColor: '#DC0D2A',
    }
}
