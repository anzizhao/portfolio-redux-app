import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Tags extends Component {

    //componentDidMount () {
    //}
    //
    //
    
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
                            style={style.tagBadge}
                            className='tagBadge' 
                            key={index} > 
                            <span 
                                style={style.badge3 }
                                className="badge3"></span>
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
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })),
    subTag: PropTypes.bool,
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
