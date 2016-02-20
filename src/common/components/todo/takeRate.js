import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import StarRate from './starRate';

//管理标记
export default class TakeRate extends Component {
    state = {
        importanceHasClick: false, 
        urgencyHasClick: false, 
        difficultyHasClick: false, 
    };

    clickImportance(e, count){
        // 记录已经标记
        this.props.handles.importance(e, count) 
        this.setState({
            importanceHasClick: true, 
        });
    }
    clickUrgency(e, count){
        // 记录已经标记
        this.props.handles.urgency(e, count) 
        this.setState({
            urgencyHasClick: true, 
        });
    }

    clickDifficulty(e, count){
        // 记录已经标记
        this.props.handles.difficulty(e, count) 
        this.setState({
            difficultyHasClick: true, 
        });
    }

    componentWillReceiveProps (nextProps) {
        if( nextProps.initRate ) {
            this.setState({
                importanceHasClick: false, 
                urgencyHasClick: false, 
                difficultyHasClick: false, 
            });
        }
    }

    renderItem(describe , star, handleClick, hasClick) {
        return (
            <span  className='item-score-title'>
                { describe }
                <StarRate 
                    star={ star }
                    clickStar={ handleClick.bind(this) } 
                    onlyShow={ hasClick }
                />  
            </span>
        )
    }

    render() {
        const { values, handles, inits } = this.props
        const { importanceHasClick, urgencyHasClick, difficultyHasClick } = this.state 
        return (
                <div className="item-score">
                    {
                        this.renderItem('重要程度', values.importance, this.clickImportance, importanceHasClick)
                    }
                    <br/>
                    {
                        this.renderItem('紧急程度', values.urgency, this.clickUrgency , urgencyHasClick)
                    }
                    <br/>
                    {
                        this.renderItem('难易程度', values.difficulty, this.clickDifficulty, difficultyHasClick)
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
