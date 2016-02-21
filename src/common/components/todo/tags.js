import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Tags extends Component {

    //componentDidMount () {
    //}
    //
    render() {
        const { tags } = this.props
        if ( !tags ) {
            return <span></span> 
        }
        //if ( this.props.tags[0] instanceof Object && !this.props.tags[0] ) {
            //console.log('the tags[0] is null') 
            //return <span></span> 
        //}

        return (
            <span  className='tags'>
            {
                tags.map((item, index) => {
                    return (
                        <span className='tagBadge' key={index} > 
                            <span className="badge3"></span>
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
    })).isRequired,
}
