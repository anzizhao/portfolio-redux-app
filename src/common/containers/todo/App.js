import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters, exportTodo, initAll  } from '../../actions/todo/actions'

import { bindActionCreators } from 'redux'

import * as todoActions  from '../../actions/todo/actions'
import AddTodo from '../../components/todo/AddTodo'
import TodoList from '../../components/todo/TodoList'
import Footer from '../../components/todo/Footer'

import visibleTodos from '../../components/todo/visibleTodos'

import  {List} from 'immutable'


class App extends Component {
    componentWillMount() {
        //初始化todo 和 tags
        //this.props.dispatch(initTodo());
        //this.props.dispatch(initTags());
        this.props.dispatch(initAll());
    }
    _selectMode(){
        return this.props.mode ===   todoActions.todoMode.select
    }
    renderAddTodo(){
        if ( this._selectMode() ) {
            return  
        }
        const {  actions } = this.props
        return (
            <AddTodo
                actions={actions}
            />
        )
    }
    selectFilterFile(e) {
        // target options array,  the last ele id is empty '', that means add new value
        var opts = e.target.selectedOptions
        //if( ! opts || ! opts.length ){
            //return 
        //} 
        var files = []
        for(let i=0; i<opts.length; i++) {
            let item = opts[i]
            files.push(
                { id: item.id, text:item.text }
            ) 
        }
        this.props.actions.selectFile(files)

        // target options array,  the last ele id is empty '', that means add new value
        //var opts = e.target.selectedOptions
        //var filename = ''
        //var ele = opts[0]
        //var text = ''
        //if ( ele.index !== 0) {
            //text = ele.text 
        //}
        //this.props.actions.selectFile(text)
    }

    renderFooter(){
        if ( this._selectMode() ) {
            return  
        }
        const { dispatch, visibleTodos, visibilityFilter, actions, sort } = this.props
        return (
            <Footer
                filter={visibilityFilter}
                sort={ sort } 
                onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))}
                onSortChange={nextSort => actions.setSort(nextSort) }

                onUndo={() => dispatch(ActionCreators.undo())}
                onRedo={() => dispatch(ActionCreators.redo())}

                fromfiles={this.props.fromfiles}
                selectFiles={ this.props.selectFiles }
                actions={actions}

                tags={this.props.tags}
                selectTags={ this.props.selectTags }

                undoDisabled={this.props.undoDisabled}
                redoDisabled={this.props.redoDisabled} />
        )
    }
      render() {
        const { dispatch, visibleTodos,  actions, tags, mode} = this.props
        
        return (
          <div>
            { this.renderAddTodo() }
            <TodoList
              todos={visibleTodos}
              actions={actions}
              mode={mode}
              tags={tags}
              fromfiles={this.props.fromfiles}
              
              onExportClick={() => dispatch(exportTodo()) }
              onTodoClick={id => dispatch(completeTodo(id))} />

            { this.renderFooter() }

          </div>
        )
      }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visibleTodos: React.PropTypes.instanceOf(List),
  fromfiles: React.PropTypes.instanceOf(List),
  selectFiles: React.PropTypes.instanceOf(List),

  sort: React.PropTypes.instanceOf(List),
  tags :  React.PropTypes.instanceOf(List),
  selectTags:  React.PropTypes.instanceOf(List),

  //sort : PropTypes.oneOf([
                         //'SORT_ORIGIN',
                         //'SORT_IMPORTANCE_UP',
                         //'SORT_IMPORTANCE_DOWN',
                         //'SORT_URGENCY_UP',
                         //'SORT_URGENCY_DOWN',
                         //'SORT_DIFFICULTY_UP',
                         //'SORT_DIFFICULTY_DOWN'
  //]).isRequired,
  visibilityFilter: PropTypes.oneOf([
                                    'SHOW_ALL',
                                    'SHOW_COMPLETED',
                                    'SHOW_ACTIVE'
  ]).isRequired,

  actions: PropTypes.object.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.number.isRequired,

  redoDisabled: PropTypes.bool.isRequired
}


function select(state) {
    let t  = state.todo
    return {
        //undoDisabled: t.todos.past.length === 0,
        //redoDisabled: t.todos.future.length === 0,
        undoDisabled: false ,
        redoDisabled: false , 
        visibilityFilter: t.visibilityFilter,
        sort: t.sort,
        tags: t.tags,
        mode: t.mode,
        selectFiles: t.selectFiles,
        selectTags: t.selectTags,
        fromfiles: t.fromfiles,
        filter: t.filter,
        visibleTodos: visibleTodos (t),
        layout : state.layout
    }
}

function mapDispatchToProps(dispatch) {
  return {
      dispatch,
      actions: bindActionCreators(todoActions, dispatch)
  }
}

export default connect(select, mapDispatchToProps)(App)
