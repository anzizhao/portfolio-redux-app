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
        var filename = ''
        // 让问题暴露出来
        //if( ! opts || ! opts.length ){
            //return 
        //} 
        var ele = opts[0]
        var text = ''
        if ( ele.index !== 0) {
            text = ele.text 
        }
        this.props.actions.selectFile(text)
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
                selectFromfile = {e=> this.selectFilterFile(e)  }
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
              
              onExportClick={() => dispatch(exportTodo()) }
              onTodoClick={id => dispatch(completeTodo(id))} />
            { this.renderFooter() }

          </div>
        )
      }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  sort : PropTypes.oneOf([
                         'SORT_ORIGIN',
                         'SORT_IMPORTANCE_UP',
                         'SORT_IMPORTANCE_DOWN',
                         'SORT_URGENCY_UP',
                         'SORT_URGENCY_DOWN',
                         'SORT_DIFFICULTY_UP',
                         'SORT_DIFFICULTY_DOWN'
  ]).isRequired,
  visibilityFilter: PropTypes.oneOf([
                                    'SHOW_ALL',
                                    'SHOW_COMPLETED',
                                    'SHOW_ACTIVE'
  ]).isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  fromfiles: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  actions: PropTypes.object.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.number.isRequired,

  redoDisabled: PropTypes.bool.isRequired
}


function select(state) {
    let t  = state.todo
    return {
        undoDisabled: t.todos.past.length === 0,
        redoDisabled: t.todos.future.length === 0,
        visibleTodos: visibleTodos (t.todos.present, t.visibilityFilter, t.sort, t.selectFile ),
        visibilityFilter: t.visibilityFilter,
        sort: t.sort,
        tags: t.tags,
        mode: t.mode,
        selectFile: t.selectFile,
        fromfiles: t.fromfiles,
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
