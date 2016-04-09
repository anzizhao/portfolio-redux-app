import React, { Component, PropTypes } from 'react';
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

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this)
    }

    componentDidMount() {

    }

    handleLogin(){
    
    
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
                <Card>
                    <CardHeader
                        style={ style.cardHeader } 
                    >
                    </CardHeader>
                    <CardText
                        style={ style.cardText } 
                    >
                        <form  action="/api/v1.0/login">
                            <TextField
                                floatingLabelText="用户名"
                                name="username"
                                type="text"
                            />
                            <br/>
                            <TextField
                                floatingLabelText="密码"
                                name="password"
                                type="password"
                            />
                            <br/>
                        </form>
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


            </Paper>
        )
    }
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

export default Login;
module.exports = Login;
