import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';

import "../../../styles/sea.scss"
import "whatwg-fetch"


import validation from 'react-validation-mixin';
// need to change 
import strategy from 'joi-validation-strategy';
import Joi from 'joi-browser';

//用户名：    
 //不能超过10个字
 //登录密码： 
  //至少6位,必须是字母或特殊符号和数字结合


class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this)
        this.getValidatorData = this.getValidatorData.bind(this)
        this.renderHelpText = this.renderHelpText.bind(this)
        this.validatorTypes = {
            username: Joi.string().alphanum().min(3).max(30).required().label('username'),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().label('password')
        }

    }

    componentDidMount() {

    }

    getValidatorData() {
        const username = findDOMNode(this.refs.username).getElementsByTagName('input')[0].value
        const password = findDOMNode(this.refs.password).getElementsByTagName('input')[0].value
        return {
            username: username,
            password: password 
        };
    }
    renderHelpText(field) {
        const errors = this.props.errors
        const showErrors = {
            username : '用户名由' 
        
        }
        let message 
        return (
            <span className='help-block'>{message}</span>
        );
    }
    handleLogin(){
        const onValidate = (error) => {
            if (error) {
                //form has errors; do not submit
            } else {
                //no errors; submit form
                const form = document.querySelector('form')
                let data = new FormData(form)
                fetch('/api/v1.0/login', {
                    method: 'POST',
                    body: data ,
                }) 
                .then(checkStatus)
                .then(parseJSON)
                .then(function(data) {
                    console.log('request succeeded with JSON response', data)
                }).catch(function(error) {
                    console.log('request failed', error)
                })

                function checkStatus(response) {
                    if (response.status >= 200 && response.status < 300) {
                        return response
                    } else {
                        var error = new Error(response.statusText)
                        error.response = response
                        throw error
                    }
                }

                function parseJSON(response) {
                    return response.json()
                }
            }
        };
        this.props.validate(onValidate)
    }

    render () {
        const style ={
            paper: {
                textAlign: 'center',
                display: 'inline-block',
                marginLeft: "20%",
                borderRadius: "30px",
                widht: "60%",
            },
            card: {
                width:"30rem",
                padding:".8rem 3rem 2rem",
            },
            cardHeader: {
                fontSize: "1.5rem", 
                background: 'url("../../../styles/login/hzwhangxing.gif")',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: '-70px',
                backgroundPositionY: '-100px',
                height: '13rem',
            },
            cardText: {
                margin: "0 2rem",
                padding:"0 2rem",

            },
            cardActions: {
                margin: "1rem",

            },
            flatBut: {
                border: '1px solid',
                borderColor: 'rgb(0, 188, 212)',
                padding: '0',
                width: '12rem',
            },
            cardMediaImg: {
                width: '20rem',
            }
            //flatButLabel: {
            //border: '1px solid',
            //borderColor: 'irgba(244, 67, 54, 0.98)' ,
            //}
        }


        return (
            <Paper style={style.paper} zDepth={5}>
                <form  method="post"  action="/api/v1.0/login">
                    <Card>
                        <CardHeader
                            style={ style.cardHeader } 
                        >
                        </CardHeader>
                        <CardText
                            style={ style.cardText } 
                        >
                            <TextField
                                floatingLabelText="用户名"
                                name="username"
                                type="text"
                                ref="username"
                                onBlur={this.props.handleValidation('username')}
                            />
                            <br/>
                            {this.renderHelpText(this.props.getValidationMessages('username'))}
                            <TextField
                                floatingLabelText="密码"
                                name="password"
                                type="password"
                                ref="password"
                                onBlur={this.props.handleValidation('password')}
                            />
                            <br/>
                            {this.renderHelpText(this.props.getValidationMessages('password'))}

                        </CardText>


                        <CardActions
                            style={ style.cardActions } 
                        >
                            <FlatButton 
                                label="登  录" 
                                style ={style.flatBut}
                                onClick={this.handleLogin}
                            />
                        </CardActions>

                        <div className="sea">
                            <div className="circle-wrapper">
                                <div className="bubble"></div>
                                <div className="submarine-wrapper">
                                    <div className="submarine-body">
                                        <div className="window"></div>
                                        <div className="engine"></div>
                                        <div className="light"></div>
                                    </div>
                                    <div className="helix"></div>
                                    <div className="hat">
                                        <div className="leds-wrapper">
                                            <div className="periscope"></div>
                                            <div className="leds"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Card>
                </form>


            </Paper>
        )
    }
}

Login.propTypes = {
    errors: PropTypes.object,
    validate: PropTypes.func,
    isValid: PropTypes.func,
    handleValidation: PropTypes.func,
    getValidationMessages: PropTypes.func,
    clearValidations: PropTypes.func,
}



                    //<CardMedia >

                        //<img 
                            //src="../../../styles/assets/elsewherecut.jpg" 
                            //style = { style.cardMediaImg } 
                        ///>
                    //</CardMedia>
//<CardMedia>
//<img 
//src="../../../styles/login/hzwhangxing.gif" 
//style={style.cardMediaImg} 
///>
//</CardMedia>

//export default Login;
export default validation(strategy)(Login);
module.exports = validation(strategy)(Login)
