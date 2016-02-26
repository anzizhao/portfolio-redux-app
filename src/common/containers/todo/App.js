import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters, exportTodo,   initTodo, initTags } from '../../actions/todo/actions'

import { bindActionCreators } from 'redux'

import * as todoActions  from '../../actions/todo/actions'
import AddTodo from '../../components/todo/AddTodo'
import TodoList from '../../components/todo/TodoList'
import Footer from '../../components/todo/Footer'



class App extends Component {
    componentWillMount() {
        //初始化todo 和 tags
        this.props.dispatch(initTodo());
        this.props.dispatch(initTags());
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
  actions: PropTypes.object.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.number.isRequired,

  redoDisabled: PropTypes.bool.isRequired
}

function sortTodos (todos, cmd) {
    let cmds = todoActions.sorts   
    switch (cmd) {
        case cmds.SORT_IMPORTANCE_UP:
            return todos.sort((a, b)=>{
                return a.importance - b.importance 
        })
        case cmds.SORT_IMPORTANCE_DOWN:
            return todos.sort((a, b)=>{
                return b.importance - a.importance 
        })
        case cmds.SORT_URGENCY_UP:
            return todos.sort((a, b)=>{
                return a.urgency- b.urgency
        })
        case cmds.SORT_URGENCY_DOWN:
            return todos.sort((a, b)=>{
                return b.urgency- a.urgency
        })
        case cmds.SORT_DIFFICULTY_UP:
            return todos.sort((a, b)=>{
                return a.difficulty - b.difficulty
        })
        case cmds.SORT_DIFFICULTY_DOWN:
            return todos.sort((a, b)=>{
                return b.difficulty - a.difficulty
        })
        //cmds.SORT_ORIGIN
        default: 
            return todos.sort((a, b)=>{
                return b.id - a.id
        })
    }
}

function selectTodos(todos, filter, sort ) {
  switch (filter) {
    default:
    case VisibilityFilters.SHOW_ALL:
      return sortTodos( todos, sort)
    case VisibilityFilters.SHOW_COMPLETED:
      return sortTodos(  todos.filter(todo => todo.completed) , sort)
    case VisibilityFilters.SHOW_ACTIVE:
      return sortTodos(todos.filter(todo => !todo.completed), sort)
  }
}

function select(state) {
  return {
    undoDisabled: state.todo.todos.past.length === 0,
    redoDisabled: state.todo.todos.future.length === 0,
    visibleTodos: selectTodos(state.todo.todos.present, state.todo.visibilityFilter, state.todo.sort ),
    visibilityFilter: state.todo.visibilityFilter,
    sort: state.todo.sort,
    tags: state.todo.tags,
    mode: state.todo.mode,
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
