import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import 'react-select2-wrapper/css/select2.min.css';
import Select2 from 'react-select2-wrapper';

export default class SelectTags extends Component {
    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 
    render() {
        const style = this.getStyle() 
        const { onChange, allTags ,select } = this.props
        const options = {
            placeholder: '添加或选择标签',
            tags: true,
        }
        return (
                <div className="select-tag">
                    <Select2
                        style={style.selectTag}
                        multiple
                        defaultValue={select}
                        data={allTags}
                        onChange={ onChange }
                        options={options}
                   />
                </div>
)
    }
}

SelectTags.propTypes = {
    onChange: PropTypes.func.isRequired,
    allTags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    select: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired).isRequired
}

SelectTags.style = {
    selectTag:{
        width: "100%" ,
    } 
}

