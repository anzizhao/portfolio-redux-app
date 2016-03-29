import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
//import Button from 'react-materialize'



//import {Button, Navbar} from  'react-materialize';

class Sidebar extends Component {


    constructor(props){
        super(props);
        this.eventCloseSidebar = this.eventCloseSidebar.bind(this)
    }

    eventCloseSidebar (e) {
        this.props.toggleSidebar(!this.props.layout.sidebarOpen);
    }

    //<Link to="/services" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">有趣的</Link>
    render() {

        return (

            <div className="sidebar">

                <div className="sidebar-item sidebar-footer">

                </div>

                <div className="sidebar-item  sidebar-nav">
                    <Link to="/home" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">首页</Link>
                    <Link to="/todo" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">代办事项</Link>
                    <Link to="/mindmap" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">思维导图</Link>
                    <Link to="/mastermind" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">猜颜色</Link>
                    <Link to="/2048" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">2048</Link>
                    <Link to="/portfolio" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">简历</Link>
                    <Link to="/about" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">关于</Link>
                </div >

                <div className="sidebar-item sidebar-footer">
                    <p>
                        Visit <a href="https://github.com/anzizhao">my git repo </a><br/>
                        Visit <a href="mailto:#">anzizhao@126.com</a><br/>
                    </p>

                </div>

            </div>
        );
    }
}

export default Sidebar;
