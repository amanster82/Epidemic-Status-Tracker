import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./App.css";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";
import ForgotPass from "./components/Login/ForgotPass";
import Dashboard from "./Dashboard";
import { MyContext } from "./MyContext";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import { AppBar, Grid } from "@material-ui/core";
import KeyboardArrowDownSharpIcon from "@material-ui/icons/KeyboardArrowDownSharp";
import { ReactComponent as Corona } from "./static/images/corona.svg";
import { ReactComponent as Spreading } from "./static/images/spreading.svg";
import animate from "animate.css/animate.css";

const useStyles = makeStyles({
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
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

  covid: {
    fontSize: "medium",
    background: "#3f51b5",
    width: "fit-content",
    color: "white",
    padding: "8px",
    borderRadius: "10px",
  },

  container: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
});

function External() {
  const classes = useStyles();
  /**State**/
  const [buttonContainer, removeButtonContainer] = useState(false);
  /**State**/
  const [signUp, signUpSwitch] = useState(false);
  const [isAccessGranted, setAccess] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [changeScene, setScene] =  useState(false);

  const { Pagechange, setPage, MetaData, setMetaData } = useContext(MyContext);

  function signUpToggle(x) {
    console.log("I fireed!!");
    signUpSwitch(x);
  }

  function accessGranted(value) {
    setAccess(value);
  }

  function forgotPassAnimation(){
    if (forgotPass) { 
      setScene(true); 
    }else{
      setScene(false);
    }
  }

  /**Conditional Render**/
  let element;
  if (!buttonContainer) {
    element = (
      <div className={classes.buttonContainer}>
        <Button
          onClick={() => removeButtonContainer(true)}
          className={classes.buttonStyle + " animated infinite pulse"}
          variant="contained"
        >
          Start
        </Button>
      </div>
    );
  } else if (!signUp) {
    (changeScene) ? element = (<div className= {(forgotPass) ? "animate__animated animate__backInLeft" : "animate__animated animate__backOutLeft"} onAnimationEnd={ () => forgotPassAnimation()}> <ForgotPass ForgotPassClick={()=> setForgotPass(false)}></ForgotPass></div>) :
    element = (
      <div className={ (forgotPass) ? "animate__animated animate__backOutRight" : "animated zoomIn"} onAnimationEnd={ () => forgotPassAnimation() }>
        <Login
          SignUpClick={() => signUpToggle(true)}
          accessGranted={(value) => accessGranted(value)}
          ForgotPassClick={()=> setForgotPass(true)}
        ></Login>
      </div>
    );
  } else {
    element = (
      <SignUp
        SignInClick={() => signUpToggle(false)}
        accessGranted={(value) => accessGranted(value)}
      ></SignUp>
    );
  }
  /**Conditional End**/

  let page;
  if (Pagechange) {
    page = <Dashboard></Dashboard>;
  } else {
    page = (
      <div className="App">
        <AppBar>
          <Toolbar>
            <Grid container justify="flex-end">
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <div>About COVID-19</div>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <div>About Project</div>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <div>Live Tracker</div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <header className="App-header">
          <div
            className={
              isAccessGranted
                ? "Spacing animated fadeOutUp delay-1s"
                : "Spacing"
            }
            onAnimationEnd={() => {
              setPage(null);
              setMetaData(null);
            }}
          >
            <div className={classes.container}>
              <div className={classes.covid}>COVID-19</div>
            </div>
            <h1 className={classes.heading}>CORONA VIRUS</h1>
            <h2 className={classes.heading}>Find out where it is.</h2>
          </div>
          {element}
          <div className={classes.container}>
            <KeyboardArrowDownSharpIcon
              style={{ fontSize: 100 }}
            ></KeyboardArrowDownSharpIcon>
          </div>
        </header>
        <div style={{ height: 300 }}></div>
        <Grid container justify="space-evenly">
          <Grid item xs={3}>
            <h1>About COVID-19</h1>
            <div>
              <p>
                COVID-19 is the infectious disease caused by the most recently
                discovered coronavirus. This new virus and disease were unknown
                before the outbreak began in Wuhan, China, in December 2019.
                COVID-19 is now a pandemic affecting many countries globally.
              </p>
            </div>
            <div>
              <p>
                Coronaviruses are a large family of viruses which may cause
                illness in animals or humans. In humans, several coronaviruses
                are known to cause respiratory infections ranging from the
                common cold to more severe diseases such as Middle East
                Respiratory Syndrome (MERS) and Severe Acute Respiratory
                Syndrome (SARS). The most recently discovered coronavirus causes
                coronavirus disease COVID-19.
              </p>
            </div>
            <div>
              <p>
                The most common symptoms of COVID-19 are fever, dry cough, and
                tiredness. Other symptoms that are less common and may affect
                some patients include aches and pains, nasal congestion,
                headache, conjunctivitis, sore throat, diarrhea, loss of taste
                or smell or a rash on skin or discoloration of fingers or toes.
                These symptoms are usually mild and begin gradually. Some people
                become infected but only have very mild symptoms.
              </p>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Corona></Corona>
          </Grid>
        </Grid>
        <div style={{ height: 300 }}></div>
        <Grid container justify="space-evenly">
          <Grid item xs={3}>
            <h1>About This Project</h1>
            <div>
              <h3>
                COVID-Tracker is a unique web application that allows users to
                report and track COVID-19. Much like checking the weather, a
                user is able to navigate to this app, and check the social
                climate on whether or not the virus is spreading around their
                community.  
              </h3>
              <div>
                Hey
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Spreading></Spreading>
          </Grid>
        </Grid>
      </div>
    );
  }

  return <div>{page}</div>;
}

export default External;
