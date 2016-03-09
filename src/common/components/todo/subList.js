import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

//
export default class SubList extends Component {
    render() {
        const { tags } = this.props
        return (
            <span  className='tags'>
            {
                tags.map(item =>(
                    <span className='tagBadge'> 
                        <span className="badge3"></span>
                        { item.text }
                    </span>
                ))
            }
            </span>
        )
    }
}

SubList.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired),
}
