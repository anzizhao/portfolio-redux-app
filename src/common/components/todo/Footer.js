import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'
import FooterFromfile from './footerFromfile.js';
import ImuSelectTags from './imuSelectTags';
import TextField from 'material-ui/lib/text-field';


class FilterText extends Component {
    handleEnterKeyDown(e) {
        e.preventDefault()
        const value =  e.target.value 
        if ( value ) {
            const text = value.trim()
            this.props.actions.filterText(text)
        } else {
            // 取消率选
            this.props.actions.filterText()
        }
    }
    render() {
        const style ={
            marginLeft: '20px',
            width: '600px',
            background: 'white',
        }
        return (
              <div  className="footer-tags" >
                <span>内容: </span>
                <TextField
                    hintText="输入关键字，支持正则, 按Enter确认"
                    style={style}
                    onEnterKeyDown = {(e) => this.handleEnterKeyDown (e) }
                />
              </div>
        )
    }
}

FilterText.propTypes = {
    actions: PropTypes.object.isRequired,
}




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

    handleTagChange(e) {
        var opts = e.target.selectedOptions
        if( ! opts || ! opts.length ){

            this.props.actions.changeFilterTags()
            return 
        } 
        // 这个不需要render的
        var tags = []
        for(let i=0; i<opts.length; i++) {
            let item = opts[i]
            tags.push(
                {id: item.id, text:item.text }
            ) 
        }
        this.props.actions.changeFilterTags(tags )
    }
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

  renderTags() {
    return (
      <div  className="footer-tags" >
        <span>标签: </span>
        <ImuSelectTags  
            onChange={ this.handleTagChange.bind(this) } 
            allTags = { this.props.tags } 
            selects={ this.props.selectTags }
        />

      </div>
    )
  }

  renderFromfile() {
      const { fromfiles } = this.props
      // 选择文件的需求
      const files = [
          ... fromfiles
      ]
      return (
          <div>
              <span style={this.style.showTip }>源文件: </span>
              <FooterFromfile
                  files={ this.props.fromfiles} 
                  selects={ this.props.selectFiles }
                  actions={ this.props.actions }
              />
          </div>
      )
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
        <FilterText 
            actions={ this.props.actions } 
        />

        {this.renderTags()}
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
  
  selectTags: React.PropTypes.instanceOf(Immutable.List),
  tags: React.PropTypes.instanceOf(Immutable.List),

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
