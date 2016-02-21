import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import StarRate from './starRate';

//管理标记
export default class TakeRate extends Component {

    clickImportance(e, count){
        this.props.handles.importance(e, count) 
        //this.setState({
            //importanceHasClick: true, 
        //});
    }
    clickUrgency(e, count){
        this.props.handles.urgency(e, count) 
    }

    clickDifficulty(e, count){
        this.props.handles.difficulty(e, count) 
    }

    componentWillReceiveProps (nextProps) {
    }

    renderItem(describe , star, handleClick ) {
        return (
            <span  className='item-score-title'>
                { describe }
                <StarRate 
                    star={ star }
                    clickStar={ handleClick.bind(this) } 
                />  
            </span>
        )
    }

    render() {
        const { values, handles, inits } = this.props

        return (
                <div className="item-score">
                    {
                        this.renderItem('重要程度', values.importance, this.clickImportance)
                    }
                    <br/>
                    {
                        this.renderItem('紧急程度', values.urgency, this.clickUrgency )
                    }
                    <br/>
                    {
                        this.renderItem('难易程度', values.difficulty, this.clickDifficulty )
                    }
                    <br/>
                </div>
        )
    }
}

TakeRate.propTypes = {
  values: PropTypes.shape({
          importance: PropTypes.number.isRequired,
          urgency: PropTypes.number.isRequired,
          difficulty: PropTypes.number.isRequired,
  }).isRequired,

  handles: PropTypes.shape({
      importance: PropTypes.func.isRequired,
      urgency: PropTypes.func.isRequired,
      difficulty: PropTypes.func.isRequired,
  }).isRequired,
  initRate: PropTypes.bool.isRequired,
}
