import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./App.css";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";

const useStyles = makeStyles({

  buttonContainer: { 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh'
  },
  
  buttonStyle: {
    background: "linear-gradient(45deg, #0cf79d 30%, #3f51b5 90%)",
    boxShadow: "0 3px 5px 2px #719ece",
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 48,
    padding: "0 30px",
  },

  heading: {
    margin: 0,
  },

});

function External() {
  const classes = useStyles();
  /**State**/
  const [buttonContainer, removeButtonContainer] = useState(false);
  /**State**/

  const [signUp, signUpSwitch] = useState(false);
  
  function signUpToggle(x){
    console.log("I fireed!!");
    signUpSwitch(x)
  }

  /**Conditional Render**/
  let element;
  if(!buttonContainer){
    element = 
    <div className={classes.buttonContainer}>
    <Button
      onClick={()=> removeButtonContainer(true)}
      className={classes.buttonStyle + " animated infinite pulse"}
      variant="contained"
    >
      Start
    </Button>
  </div> 
  } else if(!signUp){
    element=
    <div className="animated zoomIn">
      <Login SignUpClick={ ()=>signUpToggle(true) }></Login>
    </div>
  }else {
    element = <SignUp SignInClick={ ()=>signUpToggle(false) }></SignUp>
  }
  /**Conditional End**/

  return (
    <div className="App">
      <header className="App-header">
        <div className="Spacing">
          <h1 className={classes.heading}>Epidemic Status Tracker</h1>
          <h2 className={classes.heading}>
            Use this app to log and track whose positive.
          </h2>
        </div>
        {element}
      </header>
    </div>
  );
}

export default External;