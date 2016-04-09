import React, { Component } from 'react';
import { Link } from 'react-router';

class Header extends Component {
    //componentDidMount(){
    //}
    render() {
        const style ={
            rightOp: {
                float: 'right', 
                margin: '-1.4rem 1rem 0 0',
                fontSize: '.7rem',
                display: 'block',
                cursor: 'pointer'
            } 
        }
        return (
            <div className="masthead">
                <div className="container">
                    <h3 className="masthead-title">
                        <a href="/" title="Home">anzizhao</a>
                        <small >旅游 生活 思考, 居住广州</small>
                    </h3>
                </div>
                <div style={ style.rightOp } className="rightOp" >
                    <Link to="/login" activeClassName="active">登录</Link>
                </div>
            </div>
        );
    }
}

export default Header;
