import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import  Immutable from 'immutable'

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
        const { tags } = this.props
        if ( !tags ) {
            return <span></span> 
        }

        const style = this.getStyle() 

        return (
            <span  className='tags'>
            {
                tags.map((item, index) => {
                    return (
                        <span 
                            className='tagBadge' 
                            key={index} 
                            style={style.tagBadge}
                            > 
                            <span 
                                className="badge3"
                                style={style.badge3 }
                                ></span>
                            { item.text }
                        </span>
                    )}
                )
            }
            </span>
        )
    }
}

Tags.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    actions: PropTypes.object.isRequired,
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
