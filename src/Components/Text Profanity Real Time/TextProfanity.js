import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import axios from "axios"
import './TextProfanity.css';
// import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import Highlighter from "react-highlight-words";
// import debounce from 'lodash.debounce';
import io from 'socket.io-client';
// var connectionOptions =  {
//     "force new connection" : true,
//     "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
//     "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
//     "transports" : ["websocket"]
// };

// var socket = io('yourdomain.com', connectionOptions);

const socket = io("http://0.0.0.0:5000"
// , {transports: ['websocket', 'polling', 'flashsocket']}
);
console.warn("socket", socket)

// socket.on('connect', function (socket) {
//     console.log('Connected!');
// });

export default class Welcome extends React.Component {
    constructor() {
        super();
        this.state = { text: "", value: [], sentences: [], length: 0, currentMessage: "", lastSentence: "", lastMessage: "" };
        // this.onChangeDebounced = debounce(this.onChangeDebounced, 2000);
    }


    handleChange1(event) {
        // console.log(event.keyCode)
        if (event.keyCode === 32) {
           
            this.socketConnect(this.state.currentMessage.replace(this.state.lastMessage, ''));
            
        } else if (event.keyCode === 191 || event.keyCode === 190 || event.keyCode === 16) {
            
            this.socketConnect(this.state.currentMessage.replace(this.state.lastMessage, ''));
            this.setState({ lastMessage: this.state.currentMessage })
        }

    }
    handleChange(e) {
        e.preventDefault()
        this.setState({ text: e.target.value });
        // console.log(this.state.text)
        if (this.state.text == "") {
            this.setState({ value: [] });
        }
        this.setState({ currentMessage: e.target.value });

    }
    socketConnect(e) {
        // this.setState({ value: []})
        // for (let i = (this.state.length - 1); i >= 0; i--) {
        // console.log(e)
        socket.emit('message', 1, e)
        // console.log("hey2")
        socket.on('processed_data', (msg) => {
            // console.log(msg.response[0]);
            if (msg.response[0] && (String(msg.response[0].profane) == "true" || String(msg.response[0].profane) == "Offensive")) {
                // this.setState({ value: this.state.value.concat(msg.response[0].profane_words) });
                if (msg.response[0].profane_words) {
                    if (msg.response[0].profane_words[0]) {
                        var elmts = msg.response[0].profane_words.filter(
                            function (i) {
                                return this.indexOf(i) < 0;
                            },
                            this.state.value
                        );
                        this.setState({ value: this.state.value.concat(elmts) });
                    }
                    else {
                        var temp = [msg.response[0].data]
                        var elmts = temp.filter(
                            function (i) {
                                return this.indexOf(i) < 0;
                            },
                            this.state.value
                        );
                        this.setState({ value: this.state.value.concat(elmts) })
                    }
                }
                else {
                    var temp = [msg.response[0].data]
                    var elmts = temp.filter(
                        function (i) {
                            return this.indexOf(i) < 0;
                        },
                        this.state.value
                    );
                    this.setState({ value: this.state.value.concat(elmts) })
                }
                // console.log()
            }
           
        })
        // console.log("hey3")
        // console.log(this.state.value)
        // }

    }

    render() {
      
        return (
            <div >
                <div >
                <div >
                    <TextField
                        required
                        id="validation-outlined-input"
                        label="Text"
                        multiline
                        rows={20}
                        //   defaultValue="Default Value"

                        onChange={e => this.handleChange(e)}
                        onKeyUp={event => this.handleChange1(event)}
                        variant="outlined"
                        InputProps={{
                            color: "red"

                        }}
                    //   size="large"

                    />
                </div>
                <div className="profane">
                    <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={this.state.value}
                        autoEscape={true}
                        textToHighlight={this.state.text}
                    />
                </div>
                </div>
            </div>





        );
    }
}