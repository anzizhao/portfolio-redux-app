import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

import ActionGrade from 'material-ui/lib/svg-icons/action/grade';

import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';
import Badge from 'material-ui/lib/badge';
import Icon from 'react-fa';
import StarRate from './starRate';
import TodoSubBut from './todoSubBut';
import TodoSubItem from './todoSub';

import 'react-select2-wrapper/css/select2.min.css';
import Select2 from 'react-select2-wrapper';

export default class Todo extends Component {
    state = {
        toEditItem : false,
        initHasSignStar: false,
        signStar: 0, //紧急程度
        importanceStar: 0,  //重要程度
        difficultyStar: 0,   //困难程度
        tags: [],
        itemText: ''
    };

    componentWillMount(){
        this.setState({
            signStar: this.props.urgency ,
            importanceStar: this.props.importance,
            difficultyStar: this.props.difficulty,
            tags: this.props.tags,
        });
    }
     
    handleEditItem (id){
        this.props.actions.editTodo(id)
        this.setState({
            itemText: this.props.text,
            initHasSignStar: true,
            signStar: this.props.urgency,
            initImportanceStarFlag: true,
            importanceStar: this.props.importance,
            initDifficultyFlag : true,
            difficultyStar: this.props.difficulty,

        });
    }

    handleDelItem (e, id) {
          e.stopPropagation();
          this.props.actions.delTodo(id)
    }
    handleChangeItem(e) {
        this.setState({
            itemText: e.target.value,
        });
    }
    handleComplete(e, id) {
        e.stopPropagation();
        this.props.actions.completeTodo(id)
    }
    handleUNComplete(e, id) {
        e.stopPropagation();
        this.props.actions.uncompleteTodo(id)
    }

    handleSignStar  (e, id, starCount){ 
        //return   this.props.actions.signStar(id, starCount) 
        this.setState({
            signStar: starCount,
        });
    } 

    handleImportanceStar  (e, id, starCount){ 
        this.setState({
            importanceStar: starCount,
        });
    } 
    handleDifficultyStar  (e, id, starCount){ 
        this.setState({
            difficultyStar: starCount,
        });
    } 

    initItemState(){ 
        this.setState({
            initHasSignStar: false ,
            initImportanceStarFlag: false,
            initDifficultyFlag: false,
        });
    } 

    _leaveEditMode(id){
        this.initItemState()
        this.props.actions.uneditTodo(id)
    }

    handleSaveTodo(){
        let id 
        id = this.props.id

        let item = {
            text: this.state.itemText, 
            urgency: this.state.signStar, 
            importance: this.state.importanceStar,
            difficulty: this.state.difficultyStar,
            tags: this.state.tags 
        }
        this.props.actions.saveTodo(id, item)
        this._leaveEditMode(id)
    }
    handleUnsaveTodo(){
        let id = this.props.id
        this._leaveEditMode(id)
        //还原原来的
        this.setState({
            signStar: this.props.urgency,
        });
    }

    handleTagChange(e) {
        // target options array,  the last ele id is empty '', that means add new value
        console.log('handleTageChange')

        var opts = e.target
        var ele = opts[opts.length-1]
        if ( ele.id === '' ) {
            //new value, set  
            this.props.actions.addTags(ele.id, ele.text)
        }
        // 这个不需要render的
        var tags = []
        for(let i=0; i<opts.length; i++) {
            let item = opts[i]
            tags.push(
                {id: item.id, text:item.text }
            ) 
        }
        this.state.tags = tags 
    }
    
  render() {
      const { id, conclusion, allTags } = this.props
      const style = {
          listItem: {
              //textDecoration: this.props.completed ? 'line-through' : 'none',
              //cursor: this.props.completed ? 'default' : 'pointer',
              display:  this.props.collapse ? 'block' : 'none'
          },
          editTodo: {
              display: ! this.props.collapse ? 'block' : 'none',
          },
          opButGroup: {
              float: 'right',
          },
          listTextSpan: {
              float: 'left',
              textDecoration: this.props.completed ? 'line-through' : 'none',
          },
          badge: {
              fontSize: 15, 
              marginTop: '10px',
              width: '18px',
              height: '18px'
          },
          secondtext: {
                marginTop: '25px',
                marginLeft: '30px',
                marginRight: '30px',
          },
          badgeRoot: {
            padding: "20px 18px 12px 0", 
          },
          selectTag:{
            width: "100%" 
          } 

      }
      let tags = [] 
      if ( this.state.tags ){
          for( let item of this.state.tags ) {
               tags.push( <span className='tagBadge'> 
                             <span className="badge3"></span>
                              { item.text }
                          </span>)
          }
      }
      const listText = ( 
                        <span > 
                            <span  style={style.listTextSpan}>
                            { `${ String(this.props.index + 1) }.  ${this.props.text}        ` } 
                            </span>
                            <span  className='tags'>
                                { tags }
                            </span>
                            <span className="item-show-right">
                                <Badge
                                    badgeContent={this.state.importanceStar }
                                    className='item-show-right-star'
                                    style={ style.badgeRoot }
                                    badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 255, 66, 0.56)'}} 
                                >
                                    重要
                                </Badge>
                                <Badge
                                    badgeContent={this.state.signStar }
                                    className='item-show-right-star'
                                    style={ style.badgeRoot }
                                    badgeStyle={{...style.badge, 'backgroundColor':'rgba(244, 67, 54, 0.56)'}} 
                                >
                                    紧急
                                </Badge>
                                <Badge
                                    badgeContent={ this.state.difficultyStar }
                                    className='item-show-right-star'
                                    style={ style.badgeRoot }
                                    badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                                >
                                    困难
                                </Badge>
                            </span>
                        </span>
                       )

       const iconButtonElement = (
           <IconButton
               touch={true}
           >
               <MoreVertIcon color={Colors.grey400} />
           </IconButton>
       ) 
      const rightIconMenu = (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem 
              onClick={ () =>  this.handleEditItem(id)  }
              primaryText="编辑"
          />
          <MenuItem
              onClick={(e) => this.handleDelItem(e, id) } 
              primaryText="删除"
          />
          <MenuItem
              onClick={(e) => this.handleComplete(e, id) }
              primaryText="完成"
          />
          <MenuItem
              onClick={(e) => this.handleUNComplete(e,   id) } 
              primaryText="未完成"
          />
        </IconMenu>
      )
      let secondaryText = '' 
      let secondaryTextLines   = 1
      let subItems = []
      let index = 1
      //结论
      if ( conclusion ) {
          subItems.push(<TodoSubItem
                        todoId = { this.props.id }
                        key="conclusion" 
                        index={index} 
                        parentIndex={this.props.index+1}
                        { ...conclusion } 
                        actions={this.props.actions} /> )

          index += 1
          secondaryText = (
                <span  style={style.secondtext} > 
                   结论:  { conclusion.text }
                </span> 
          ) 
          // 可以根据字数  设置多少行
          secondaryTextLines = 2

      }

      //过程描述
      if ( this.props.process.length != 0 ) {
          for( let item of this.props.process ) {
              subItems.push(<TodoSubItem
                            todoId = { this.props.id }
                            key={item.id} 
                            index={index} 
                            parentIndex={this.props.index+1 }
                            {...item} 
                            actions={this.props.actions} /> )

                            index += 1
          }
      }
      subItems.push(<TodoSubBut 
                        todoId = { this.props.id }
                        key="addBut"
                        actions={this.props.actions } /> )

    console.log("before return")
    return (
        <div className="todo-item">
            <ListItem 
                primaryText={ listText } 
                secondaryText = { secondaryText }
                secondaryTextLines =  { secondaryTextLines }
                style={style.listItem}
                rightIconButton={ rightIconMenu }
                primaryTogglesNestedList={true}
                nestedItems={subItems}
                key={ this.props.key }
            />
            <div style={style.editTodo } >
                 <label>{ this.props.index + 1 } </label>
                 <TextField
                    className='item-input'
                     fullWidth
                     value={this.state.itemText}
                     onChange={(e)=>this.handleChangeItem(e)}
                     onEnterKeyDown ={(e) => this.handleSaveTodo()}
                 />
                 <div className="item-score">
                    <span  className='item-score-title'>重要程度 
                        <StarRate star={this.state.importanceStar  }
                         clickStar={(e, count)=>{ this.handleImportanceStar(e, id, count)}  } 
                         initHasSignStar={ this.state.initImportanceStarFlag}
                         />  
                     </span>
                     <br/>
                    <span  className='item-score-title'>紧急程度 
                        <StarRate star={this.state.signStar }
                         clickStar={(e, count)=>{ this.handleSignStar(e, id, count)}  } 
                         initHasSignStar={ this.state.initHasSignStar }
                         />  
                     </span>
                     <br/>
                    <span  className='item-score-title'>难易程度 
                        <StarRate star={this.state.difficultyStar }
                         clickStar={(e, count)=>{ this.handleDifficultyStar(e, id, count)}  } 
                         initHasSignStar={ this.state.initDifficultyFlag }
                         />  
                     </span>
                 </div>

                 <div className="select-tag">
                     <Select2
                         style={style.selectTag}
                         multiple
                         data={allTags}
                         onChange={ this.handleTagChange.bind(this) }
                         options={{
                                 placeholder: '添加或选择标签',
                                 tags: true,
                             }
                         }
                     />
                 </div>
                <div style={style.opButGroup }>
                    <FlatButton label="完成" onClick={(e) => this.handleSaveTodo() }  style={ style.flatButton }  />
                    <FlatButton label="取消" onClick={(e) => this.handleUnsaveTodo() }  style={ style.flatButton }  />
                </div>
            </div>
        </div>
    )
  }

}




Todo.propTypes = {
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

