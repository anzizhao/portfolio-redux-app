import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class StarRate extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signStar: props.star 
        };
    }

    handleSignStar (e, count) {
        this.props.clickStar(e, count)
    }

    _handleMouseOver (e, i) {
        this.setState({signStar: i})
    }

    render() {
        let style = { }
        const {  count, star , onlyShow } = this.props
        
        const starItems = [] 
        let starClassName = ''
        const len = count ? count: 5

        const mayHandleSignStar = (e, count) => {
            return onlyShow? null: this.handleSignStar(e, count) 
        } 

        const mayHandleMouseOver = (e, index) => {
            return onlyShow? null: this._handleMouseOver(e, index) 
        } 

        for(let i=0; i<len ; i++) {
            starClassName = i <=  this.state.signStar ? 'signStar': '' 
            starItems.unshift( <span   className={ starClassName }
                                  onClick={(e) => mayHandleSignStar(e, i+1) } 
                                  onMouseOver={(e)=> mayHandleMouseOver(e, i) }
                              >☆</span> ) 
        }

        return (
          <span className="rating">
          { 
              starItems
          } 
          </span >
        )
    }
}

StarRate.propTypes = {
  star: PropTypes.number.isRequired,
  count: PropTypes.number,
  onlyShow: PropTypes.bool,
  clickStar: PropTypes.func,
}
