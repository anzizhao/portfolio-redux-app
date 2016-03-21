import React, { Component, PropTypes } from 'react'
import Todo from './Todo'

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import FlatButton from 'material-ui/lib/flat-button';
import Checkbox from 'material-ui/lib/checkbox';

import Badge from 'material-ui/lib/badge';

//import ClearAllBut from './clearAllBut'
import ConfirmDlg from './confirmDlg'

import * as todoActions  from '../../actions/todo/actions'

import  Immutable from 'immutable'

var {exportFile, readFile } = require('../../util')

export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSelect: true ,
        };
    }
    
    componentDidMount(){
        //document.getElementById('importTodo').addEventListener('change', this.handleFileSelect, false);
        this.refs.importTodo.addEventListener('change', this.handleFileSelect.bind(this), false)

    }

    handleFileSelect(event){
        let files = event.target.files; 
        readFile(files[0], (fileStr)=>{
            let fileJson = JSON.parse(fileStr)
            this.props.actions.importTodo(fileJson, files[0].name) 
        }) 
    }

    handleImportClick(e){
        e.preventDefault();  
        document.getElementById('importTodo').value='';
        document.getElementById('importTodo').click()
    }

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 

    _selectMode(){
        return this.props.mode ===   todoActions.todoMode.select
    }

    clickCheckbox(e, checked){
        // 这个的确是不需要的
        //e.preventDefault()
        const { actions } = this.props
        const value =  checked
        this.setState({
            allSelect: value 
        })
        actions.selectAllTodo(value)
    }


    renderBanner (){
        const { actions } = this.props
        const style = this.getStyle() 
        const butLable = this._selectMode() ? "退出选择" : "选择"
                            //checked={ this.allSelect }
                            //checked={ this.state.allSelect }
                            //onCheck={ (e, checked)=> { this.clickCheckbox(e, checked) }} 
        return (
            <div  className="todo-list-banner" >
                <div>
                    <FlatButton label=  { butLable }
                        style ={style.selectBut } 
                        onClick={e => actions.toggleSelectMode() }
                        primary={true}  />
                </div>
                {
                    this._selectMode() 
                    && 
                     <div style={ style.selectLabel }>
                        <Checkbox
                            label="全选"
                            //checked={ this.allSelect }
                            checked={ this.state.allSelect }
                            onCheck={ (e, checked)=> { this.clickCheckbox(e, checked) }} 
                        />
                    </div>
                }

                <div  className="mertic-tips">
                    <span>
                        重要=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 255, 66, 0.56)'}} 
                        />
                        紧急=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(244, 67, 54, 0.56)'}} 
                        />

                        困难=
                        <Badge
                            badgeContent={''}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                            style={ style.badgeContent}
                        />
                    </span>
                    <br/>
                </div>
            </div>
        )
    }

    exportSelect (e){
        const { actions } = this.props
        actions.exportSelect()
    }

    exportPage(e){
        const { actions } = this.props
        actions.exportPage()
    }

    delSelect(e){
        const { actions } = this.props
        actions.delSelect()
    }

    renderOpGrounp() {
        const { actions } = this.props
        const style = this.getStyle() 
        if( this._selectMode() ) {
            return (
                    <div  className="todolistOpGroup">
                        <FlatButton label="导出所选" 
                            onClick={ this.exportSelect.bind(this) }  
                            style={ style.flatButton }  />
                        <ConfirmDlg
                            msg="确认删除所选内容" 
                            title='!!!! 注意'
                            buttonLabel="删除所选"
                            op={this.delSelect.bind(this)}
                           />

                    </div>
            )
        
        } else {
            return (
                    <div  className="todolistOpGroup">
                        <FlatButton label="导出show" 
                            onClick={ this.exportPage.bind(this) }  
                            style={ style.flatButton }  />
                        <FlatButton label="导出All" 
                            onClick={(e) => this.props.onExportClick() }  
                            style={ style.flatButton }  />
                        <FlatButton label="导入" 
                            onClick={(e) => this.handleImportClick(e) }  
                            style={ style.flatButton }  />
                        <ConfirmDlg
                            msg="确认清除所有todo项，建议删除前先导出备份" 
                            title='!!!! 注意'
                            buttonLabel="删除show"
                            op={(e) => this.props.actions.delPage() }
                           />
                        <ConfirmDlg
                            msg="确认清除所有todo项，建议删除前先导出备份" 
                            title='!!!! 注意'
                            buttonLabel="删除all"
                            op={(e) => this.props.actions.clearAllTodo() }
                           />

                    </div>
            )
        
        }
    }

    render() {
        const { actions, tags, mode, todos } = this.props

        const style = this.getStyle() 
        const todoLen = todos.size 
        return (           
                <div  className="todoList">
                 { this.renderBanner () }
                <List  style={style.list}>
                { todos.map((todo, index)  =>
                                      <Todo {...todo}
                                          index={ todoLen - index - 1}
                                          actions={actions}
                                          allTags={ tags }
                                          mode={mode}
                                          key={todo.get("uuid")}
                                          todo={todo}
                                          fromfiles= { this.props.fromfiles }
                                          onClick={() => this.props.onTodoClick} />
                                     )}


                </List>
                <Divider inset={true}/>

                 { this.renderOpGrounp() }
                <input type="file" id="importTodo" ref='importTodo'   style={{ display: 'none'}} />
                <br/>
            </div>
        )
    }
}

TodoList.propTypes = {
  actions: PropTypes.object.isRequired,
  onTodoClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  tags: React.PropTypes.instanceOf(Immutable.List),

  fromfiles: React.PropTypes.instanceOf(Immutable.List).isRequired,
  mode: PropTypes.number.isRequired,
  todos: React.PropTypes.instanceOf(Immutable.List),

  //todos: PropTypes.arrayOf(PropTypes.shape({
      //id: PropTypes.number.isRequired,
    //text: PropTypes.string.isRequired,
    //completed: PropTypes.bool.isRequired
  //}).isRequired).isRequired
}

TodoList.style = {
    flatButton: {
        float: "right",
        marginBottom: "10px",
    },
    list: {
        marginBottom: "30px", 
        clear: "both",
    },
    badge: {
        marginTop: '22px',
        width: '20px',
        height: '20px',
    },
    badgeContent:{
        padding: '24px 24px 12px 0' ,
        marginRight: '5px',
    },
    selectLabel:{
        maxWidth: '250px',
        width: '100px',
        fontSize: 'smaller',
        display: 'inline-block',
    },
    selectBut: {
        marginBottom: '10px',
    }
}
