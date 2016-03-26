import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import HomePage from './home'


require('../css/main.css')
require('../css/normalize.css')

const Master = React.createClass({
    render: function() {

        return (
            <div>
            <header>
            <h1><Link to="/mastermind">Mastermind</Link></h1>
            <div>
            <Link to="/mastermind/rules">Game Rules</Link>
            </div>
            </header>

            <div id="mainContent">
            {! this.props.children &&  <HomePage /> }
            { this.props.children }
            </div>

            <footer>
            <span><strong>&copy; Copyright</strong> Tamas Szabo, 2016</span>
            <a href="https://github.com/sztamas/mastermind" target="blank">
            <img src='img/Octocat.jpg'></img>
            Source Code
            </a>
            </footer>
            </div>)
    }
})

export default Master
module.exports = Master
