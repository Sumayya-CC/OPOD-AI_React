// import logo from './logo.svg';
// import './App.css';
import Welcome from './TextProfanity';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './TextProfanity.css';
import React, { Component }  from 'react';
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '120ch',
      
    // fontSize: "3em"
    //   height: '50ch'
    },
    
    
  },

  root1: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '120ch',
      padding: '5ch 0ch 0ch 0ch',
    // fontSize: "3em"
    //   height: '50ch'
    },
    
    
  },

  
}));


function Welcome1() {
  const classes = useStyles();
  const [value, setValue] = useState("X Y Z and then XYZ");
  return (
    <div className="App">
      {/* <header className="App-header">
        
       
      </header> */}
      <div>
      <h2 style={{color: "dark blue", fontFamily: "Lato-Regular"}}> Text-Profanity</h2>
         
        </div>
      <div className = {classes.root}>
        {/* <MultilineTextFields></MultilineTextFields> */}
        <Welcome></Welcome>
        </div>
        
    </div>
  );
}

export default Welcome1;