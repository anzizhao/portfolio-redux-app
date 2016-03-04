import React, { Component, PropTypes } from 'react'
import SelectTags from './selectTags';
import  Immutable from 'immutable'
import OriginFileSelect from './originFileSelect';

export default class Footer extends Component {
    style = {
        showTip : {
            marginRight: '15px' ,
        } ,
        a: {
            fontSize: '15px' ,
        } ,
        selectFilter: {
            marginLeft: '10px', 
            fontSize: '15px' ,
        }
    };

  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return (
         <span style={this.style.selectFilter }> { name } </span>
         )
    }

    return (
      <a href="#" onClick={e => {
        e.preventDefault()
        this.props.onFilterChange(filter)
      }}
        style={ this.style.a } 
      >
        {name}
      </a>
    )
  }

  renderFilters() {
    return (
      <p>
        <span style={this.style.showTip }>显示过滤: </span>
        {' '}
        {this.renderFilter('SHOW_ALL', '所有')}
        {', '}
        {this.renderFilter('SHOW_COMPLETED', '完成的')}
        {', '}
        {this.renderFilter('SHOW_ACTIVE', '正在进行的')}
        .
      </p>
    )
  }

  renderSort (cmd, name) {
    if ( cmd === this.props.sort ) {
      return (
         <span style={this.style.selectFilter }> { name } </span>
         )
    }

    return (
      <a href="#" onClick={e => {
        e.preventDefault()
        this.props.onSortChange(cmd)
      }}
        style={ this.style.a } 
      >
        {name}
      </a>
    )
  }

        //{this.renderSort('SORT_IMPORTANCE_UP', '重要up')}
        //{', '}
        //{this.renderSort('SORT_URGENCY_UP', '紧急up')}
        //{', '}

  renderSorts() {
    return (
      <p>
        <span style={this.style.showTip }>排序: </span>
        {' '}
        {this.renderSort('SORT_ORIGIN', '默认')}
        {', '}
        {this.renderSort('SORT_IMPORTANCE_DOWN', '重要')}
        {', '}
        {this.renderSort('SORT_URGENCY_DOWN', '紧急')}
        {', '}
        {this.renderSort('SORT_DIFFICULTY_DOWN', '困难')}
        {', '}
        {this.renderSort('SORT_DIFFICULTY_UP', '容易')}
      </p>
    )
  }

  renderFromfile() {
      const { fromfiles } = this.props
      // 选择文件的需求
      const files = [
          //{id: 0, text:'[全部文件]'},  //default show all item 
          //{id: 1, text:'[浏览器的]'},  //default show all item 
          //... fromfiles.map((item, index) => {
              //return {
                  //id: index+2,
                  //text: item.text
              //} 
          //})
          ... fromfiles
      ]
      return (
          <div>
              <span style={this.style.showTip }>源文件: </span>
              <OriginFileSelect  
                  files={ this.props.fromfiles} 
                  selects={ this.props.selectFiles }
                  actions={ this.props.actions }
              />
          </div>
      )
      //singleSelect = { true }
  }


  renderUndo() {
    return (
      <p>
        <button onClick={this.props.onUndo} disabled={this.props.undoDisabled}>撤销上一步</button>
        <button onClick={this.props.onRedo} disabled={this.props.redoDisabled}>重做</button>
      </p>
    )
  }

  render() {
    return (
      <div>
        {this.renderFilters()}
        {this.renderSorts()}
        {this.renderFromfile()}
        {this.renderUndo()}
      </div>
    )
  }
}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired,

  actions: PropTypes.object.isRequired,
  fromfiles: React.PropTypes.instanceOf(Immutable.List),
  selectFiles: React.PropTypes.instanceOf(Immutable.List),

  sort : PropTypes.oneOf([
    'SORT_ORIGIN',
     'SORT_IMPORTANCE_UP',
     'SORT_IMPORTANCE_DOWN',
    'SORT_URGENCY_UP',
    'SORT_URGENCY_DOWN',
     'SORT_DIFFICULTY_UP',
    'SORT_DIFFICULTY_DOWN'
  ]).isRequired,
  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired,
}
