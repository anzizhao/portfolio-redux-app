import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import HomePage from './home'


require('../css/main.css')
require('../css/normalize.css')

const Master = React.createClass({
    render: function() {

        return (
            <div id="mainContent">
            {! this.props.children &&  <HomePage /> }
            { this.props.children }
            </div>

            )
    }
})

export default Master
module.exports = Master
