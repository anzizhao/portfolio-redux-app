import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class StarRate extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signStar: props.star,   //被打标记的星星颗数
            hasSignStar : false   //被打标记的星星颗数
        };
    }
    mayHandleSignStar  (e, count)  {
        if( this.props.onlyShow ||   this.state.hasSignStar ){
            return null 
        }
        this.setState({
            hasSignStar: true,
            signStar: count
        })
        // action 
        this.props.clickStar(e, count)
    } 

    mayHandleMouseOver  (e, index)  {
        if( this.props.onlyShow ||   this.state.hasSignStar ){
            return null 
        }
        this.setState({signStar: index})
    } 

    maySignNone (e) {
        if( this.state.hasSignStar || this.props.onlyShow  ){
            return null
        }
        this.setState({signStar: 0})
    } 

    componentWillReceiveProps (nextProps) {
        if ( nextProps.initHasSignStar && ! this.props.initHasSignStar ) {
            this.setState({
                hasSignStar: false 
            });
        }
        // 组建的star 为本地的
        this.setState({
            signStar: nextProps.star 
        });

    }
    createItems(){
        const {  count, star , onlyShow } = this.props
        const starItems = [] 
        let starClassName = ''
        const len = count ? count: 5

        for(let i=1; i<=len ; i++) {
            starClassName = i <=  this.state.signStar ? 'signStar': '' 
            starItems.unshift( <span className={ starClassName } key={i}
                                  onClick={(e) => this.mayHandleSignStar(e, i) } 
                                  onMouseOver={(e)=> this.mayHandleMouseOver(e, i) }
                              >☆</span> ) 
        }
        return starItems 
    }


    render() {
        const {  count, star , onlyShow, rightSide } = this.props
        let style = {}
        if(rightSide){
            style.float = 'right'
        }

        return (
          <span className="rating" 
                style={style}
              onMouseLeave ={(e)=> { this.maySignNone(e) }}
          >
          { 
             this.createItems() 
          } 
          </span>
        )
    }
}

StarRate.propTypes = {
  star: PropTypes.number.isRequired,
  count: PropTypes.number,
  onlyShow: PropTypes.bool,
  clickStar: PropTypes.func,
  initHasSignStar: PropTypes.bool,
  rightSide: PropTypes.bool,
}
