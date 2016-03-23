import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'react-select2-wrapper/css/select2.min.css';
import Select2 from 'react-select2-wrapper';
import  Immutable from 'immutable'

export default class ImuSelectTags extends Component {
    shouldComponentUpdate (nProps, nState) {
        if (nProps.allTags ===  this.props.allTags &&  nProps.selects === this.props.selects ){
            return false 
        }
        return true  
    }

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 
    render() {
        const style = this.getStyle() 
        const { onChange, selects } = this.props
        const allTags = this.props.allTags.toArray().map((tag, index)  => {
            return { text:tag.text, id:index } 
        })
        let options = {
            placeholder: '选择标签',
            tags: false,
        }
        let _select, _tags, arr    
        _select  = []
        selects.forEach(item => {
            let result = allTags.find( tag =>  item.text === tag.text ) 
            if ( result ) {
                _select.push  ( result.id )
            }
        })

        return (
            <div className="imu-select-tag">
                <Select2
                    style={style.selectTag}
                    multiple =  {  true } 
                    defaultValue={ _select }
                    data={ allTags }
                    onChange={ onChange }
                    options={options}
                />
            </div>
        )
    }
}

ImuSelectTags.propTypes = {
    onChange: PropTypes.func.isRequired,
    allTags: React.PropTypes.instanceOf(Immutable.List),
    selects: React.PropTypes.instanceOf(Immutable.List),
}

ImuSelectTags.style = {
    selectTag:{
        width: "100%" ,
    } 
}

