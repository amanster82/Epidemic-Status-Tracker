import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./App.css";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";
import Dashboard from "./Dashboard";
import axios from 'axios';

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
  const [isAccessGranted, setAccess] = useState(false);
  const [Pagechange, setPage] = useState(false);

  useEffect(() => {
    let url = window.location.href;
    url = url.split(":");
    url = url[0]+":"+url[1];
    console.log(url);
    axios.get(url+`:9000/api/authentication`, {withCredentials: true})
      .then( function(res) {
        console.log(res);
        console.log(res.data);
      });
  });
  
  function signUpToggle(x){
    console.log("I fireed!!");
    signUpSwitch(x)
  }

  function accessGranted(value){
    setAccess(value);
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
      <Login SignUpClick={ ()=>signUpToggle(true) } accessGranted = {(value)=>accessGranted(value)}></Login>
    </div>
  }else {
    element = <SignUp SignInClick={ ()=>signUpToggle(false) } accessGranted = {(value)=>accessGranted(value)}></SignUp>
  }
  /**Conditional End**/

  let page;
  if(Pagechange){
    page = <Dashboard></Dashboard>
  }else{
    page = (
        <div className="App">
          <header className="App-header">
            <div className= {(isAccessGranted) ? "Spacing animated fadeOutUp delay-1s" : "Spacing"} onAnimationEnd={()=>setPage(true)}>
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

  return (
      <div>{page}</div>
    );


}

export default External;
