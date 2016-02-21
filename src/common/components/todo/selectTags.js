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
        // select2 id should be the number 
        const _tags = allTags.map((item, index) => {
            return {
                id: index,
                text: item.text
            } 
        })
        let _select  = []
        select.forEach(item => {
            let result = _tags.find(tag =>  item.text === tag.text ) 
            if ( result ) {
                _select.push  ( result.id )
            }
        })
        return (
                <div className="select-tag">
                    <Select2
                        style={style.selectTag}
                        multiple
                        defaultValue={ _select }
                        data={_tags}
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
    })).isRequired,
    select: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.isRequired,
        text: PropTypes.string.isRequired,
    })).isRequired
}

SelectTags.style = {
    selectTag:{
        width: "100%" ,
    } 
}

