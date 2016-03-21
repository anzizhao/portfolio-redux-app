import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

import  Immutable from 'immutable'
import TakeRate from './takeRate';
import SelectTags from './selectTags';
import { eFilename }  from '../../constants';

// 选择归属文件组建
export default class SelectFromfile extends Component {
    constructor(props) {
        super(props);

        this.local  =  {
            selectFile : ''
        }   
    }

    componentWillReceiveProps (nProps) {
        const todo = nProps.todo.toObject()
        this.local.selectFile = todo.fromfile
    }

    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.todo, this.props.todo ) )  {
            if( nProps.index === this.props.index ) {
                return false  
            } else if ( nProps.toEditItem === this.props.toEditItem && nProps.toEditItem === false ) {
            // 如果在隐藏的状态, 且将来也是隐藏 不更新 
                return false  
            }
        }
        return true  
    }
    getStyle (todo){
        return this.constructor.style
    } 


    changeFile(e, id ) {
        const { actions } =   this.props
        var opts = e.target.selectedOptions
        var ele = opts[0]
        var text = ele.text === eFilename.browser ? '': ele.text  
        this.local.selectFile = text 
        // when value equal to text , it means new add 
        if ( ele.value === ele.text ) {
            actions.addFromfile({text: ele.text } )
        }
    }

    handleSave(id){
        const { actions } =   this.props

        actions.changeFromfile(id, this.local.selectFile)
        actions.toChangeFromfile(id, false )
    }


    render() {
        const todo = this.props.todo.toObject()
        if ( ! todo.toEditFromfile ) { 
            return <div></div> 
        }

        const { actions, files } = this.props
        const style = this.getStyle(todo) 
        const item =  files.find(file => file.text === todo.fromfile )
        const selectId = item ? item.id  : -1
        // 这里是bug的 根源 调试了2个小时  奇怪那里改变了这个
        //const allFiles = files.toArray().filter(item => item.id !== 0 )
        //allFiles[0].text = eFilename.browser
        
        const allFiles = Array.from( files.toArray().filter((v, index)=> index != 0) )
        allFiles[0].text = eFilename.browser

                    //select={ todo.fromfile }
        return (
            <div >
                <label>{ this.props.index + 1 } </label>
                <SelectTags  
                    onChange={ e =>  this.changeFile(e, todo.id)} 
                    allTags = { allFiles } 
                    selectOne = { todo.fromfile } 
                    singleSelect = { true } 
                />
                <div style={style.opButGroup }>
                    <FlatButton label="完成" onClick={(e) => this.handleSave(todo.id) }    />
                </div>
            </div>
        
        
        
        
        
        
        )
    }
}

SelectFromfile.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    files: React.PropTypes.instanceOf(Immutable.List),
    index: PropTypes.number.isRequired,
    toEditItem: PropTypes.bool,
    actions: PropTypes.object.isRequired,
}


SelectFromfile.style = {
    opButGroup: {
        float: 'right',
    },
}
