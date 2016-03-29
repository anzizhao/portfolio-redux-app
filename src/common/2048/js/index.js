require("./animframe_polyfill")
require("./classlist_polyfill")
require('../styles/main.css')

import React, { Component, PropTypes } from 'react'

var Container = require('./container')

export default function gameApp () {
    return (
        <Container size="4" startTiles="2" />
    )
}
module.exports = gameApp

