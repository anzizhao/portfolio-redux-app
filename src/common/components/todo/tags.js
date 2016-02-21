import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Tags extends Component {
    render() {
        const { tags } = this.props
        if ( !tags ) {
            return <span></span> 
        }

        return (
            <span  className='tags'>
            {
                tags.map((item, index) =>(
                    <span className='tagBadge' key={index} > 
                        <span className="badge3"></span>
                        { item.text }
                    </span>
                ))
            }
            </span>
        )
    }
}

Tags.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired),
}
