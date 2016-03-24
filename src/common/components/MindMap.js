import React, { Component } from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import Dialog from 'material-ui/lib/dialog';

var jsMind = require("exports?jsMind!../../plugin/jsmind/jsmind.js")
require("../../plugin/jsmind/jsmind.screenshot.js")
require("../../plugin/jsmind/jsmind.draggable.js")
require("../../plugin/jsmind/jsmind.css")


class MindMap extends Component {
    constructor(props) {
        super(props) 
        this._jm = null
        this.state = {
            open: false, 
            msg: '',
            showConfirmDlg: false, 
            confirmMsg: '', 
            confirmDlgOp: null, // func 
        }
    }
    componentDidMount () {
        this.refs.fileInput.addEventListener('change', this.handleChangeFile, false)

        var mind = {
            "meta":{
                "name":"jsMind remote",
                "author":"hizzgdev@163.com",
                "version":"0.2"
            },
            "format":"node_tree",
            "data":{"id":"root","topic":"xxxx","children":[
                {"id":"easy","topic":"Easy","direction":"left","children":[
                    {"id":"easy1","topic":"Easy to show"},
                    {"id":"easy2","topic":"Easy to edit"},
                    {"id":"easy3","topic":"Easy to store"},
                    {"id":"easy4","topic":"Easy to embed"}
                ]},
                {"id":"open","topic":"Open Source","direction":"right","children":[
                    {"id":"open1","topic":"on GitHub"},
                    {"id":"open2","topic":"BSD License"}
                ]},
                {"id":"powerful","topic":"Powerful","direction":"right","children":[
                    {"id":"powerful1","topic":"Base on Javascript"},
                    {"id":"powerful2","topic":"Base on HTML5"},
                    {"id":"powerful3","topic":"Depends on you"}
                ]},
                {"id":"other","topic":"test node","direction":"left","children":[
                    {"id":"other1","topic":"I'm from local variable"},
                    {"id":"other2","topic":"I can do everything"}
                ]}
            ]}
        }
        var options = {
            container:'jsmind_container',
            theme:'default',
            editable:true
        }
        this._jm = new jsMind(options);
        this._jm.show(mind)
    }

    prompt_info(msg){
        this.setState({
            open: true,
            msg: msg,
        }) 
    }

    get_selected_node() {
        if( ! this._jm ){
            return  
        }
        var selected_node = this._jm.get_selected_node();
        if(!! selected_node){
            return selected_node;
        }else{
            this.prompt_info('please select a node first.')
            return null;
        }
    }

    create = () => {
        var newMind = {
            "meta":{
                "name":"new mind",
                "author":"导入创建人",
                "version":"0.0"
            },
            "format":"node_array",
            "data":[{"id":"root","topic":"new mind map","expanded":true,"isroot":true}]
        }
        
        if ( ! this._jm ) {
            this._jm = jsMind.show(options, newMind)
        } else {
            const funOp = ()=>{ 
                this._jm.show(newMind) 
            }
            this.setState(
                {
                    showConfirmDlg: true, 
                    confirmMsg: "创建新图会覆盖之前的,请先保存", 
                    confirmDlgOp: funOp ,
                } 
            )    
            //this._jm.show(newMind)
        }
    };


    add = () => {
        if( ! this._jm ){
            return  
        }
        var selected_node = this.get_selected_node(); // as parent of new node
        var nodeid = jsMind.util.uuid.newid();
        var topic = '* Node_'+nodeid.substr(0,5)+' *';
        var node = this._jm.add_node(selected_node, nodeid, topic);
    };

    del = () => {
        var selected_node = this.get_selected_node(); // as parent of new node
        if ( ! selected_node ) {
            return  
        }
        var selected_id = selected_node.id;
        if(!selected_id){
            this.prompt_info('please select a node first.')
        }

        this._jm.remove_node(selected_id);
    };

    export = () => {
        if( ! this._jm ){
            return  
        }
        var mind_data = this._jm.get_data('node_array');
        var mind_name = mind_data.meta.name;
        var mind_str = jsMind.util.json.json2string(mind_data);
        jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.jm');
    };

    handleChangeFile = () => {
        var file_input = document.getElementById('file_input');
        var files = file_input.files;
        if(files.length > 0){
            var file_data = files[0];
            let mv = this 
            jsMind.util.file.read(file_data,function(jsmind_data, jsmind_name){
                var mind = jsMind.util.json.string2json(jsmind_data);
                if(!!mind){
                    mv._jm.show(mind);
                }else{
                    mv.prompt_info('can not open this file as mindmap')
                }
            });
        }else{

            this.prompt_info('please choose a file first')
        }
    };
     
    import = (e) => {
        e.preventDefault();  
        if( this._jm ) {
            const opFunc = ()=>{ 
                document.getElementById('file_input').click()
            }
            this.setState(
                {
                    showConfirmDlg: true, 
                    confirmDlgOp: opFunc ,
                } 
            )    
        }

    };
    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleConfirmDlgClose = () => {
        this.setState({
            showConfirmDlg: false,
        });
    };

    handleConfirm = () => {
        if( this.state.confirmDlgOp instanceof Function ) {
            this.state.confirmDlgOp() 
        }
        this.setState({
            showConfirmDlg: false,
        });
    };

    

    render() {
        const style = this.constructor.style

        const actions = [
            <FlatButton
                label="取消"
                secondary
                onTouchTap={this.handleConfirmDlgClose }
            />,
            <FlatButton
                label="确认"
                primary
                keyboardFocused
                onTouchTap={ this.handleConfirm }
            />,
        ];

        return (
            <div style={style.root }>
                <div 
                    id="jsmind_container"
                    style={ style.container } 
                >
                </div>
                <Paper 
                    style={style.paper} 
                    zDepth={5}
                >
                    <FlatButton 
                        label=  { "创建"}
                        onClick={  this.create }
                    />
                    <FlatButton 
                        label=  { "增加"}
                        onClick={  this.add }
                    />
                    <FlatButton 
                        label=  { "删除"}
                        onClick={  this.del }
                    />
                    <FlatButton 
                        label=  { "导入"}
                        onClick={  this.import }
                    />
                    <FlatButton 
                        label=  { "导出"}
                        onClick={  this.export }
                    />
                    <Snackbar
                        open={this.state.open}
                        message={this.state.msg}
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                    />
                    <input type="file" id="file_input" ref="fileInput"  style={{ display: 'none'}} />
                    <Dialog
                        title={ "Warning"}
                        actions={actions}
                        modal={ false }
                        open={this.state.showConfirmDlg }
                        onRequestClose={this.handleConfirmDlgClose }
                    >
                        {this.state.confirmMsg }
                    </Dialog>
                </Paper>
            </div>

        );
    }
}

MindMap.style =  {
    root: {
        display: 'inline-block',
    },
    container : {
        width: '55rem',
        height: '35rem',
        marginLeft: '-10rem',
        border: 'solid 1px #ccc',
        background:  '#f4f4f4',
        display: 'inline-block',
    },
    paper: {
        right: '1.25rem',
        width:  '5rem',
        margin: '.5rem',
        position: 'fixed',
        display: 'inline-block',
    }
}
export default MindMap;
module.exports = MindMap;

