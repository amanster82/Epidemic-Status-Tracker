import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./App.css";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";
import ForgotPass from "./components/Login/ForgotPass";
import Dashboard from "./Dashboard";
import Footer from "./components/Footer/Footer";
import { MyContext } from "./MyContext";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import { AppBar, Grid, Paper } from "@material-ui/core";
import KeyboardArrowDownSharpIcon from "@material-ui/icons/KeyboardArrowDownSharp";
import { ReactComponent as Corona } from "./static/images/corona.svg";
import { ReactComponent as Spreading } from "./static/images/spreading.svg";
import animate from "animate.css/animate.css";
import Accordion from "./components/Landing/Accordion";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ProfilePic from "./static/images/profilepic.jpg";
import Container from "@material-ui/core/Container";
import { ScaleControl } from "react-leaflet";
import Verify from "./components/Verification/Verify";
import FullScreenDialog from "./FullScreenDialog";
import FreeBreakfastOutlinedIcon from "@material-ui/icons/FreeBreakfastOutlined";
import MenuBar from "./MenuBar";

const useStyles = makeStyles({
  Backdrop: {
    backgroundColor: "#dfdbe5",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
    position: "absolute",
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: "-1",
  },
  App: {
    marginLeft: "5%",
    marginRight: "5%",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40vh",
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

  arrow: {
    transform: "scale(1)",
    transition: "0.5s transform",
    "&:hover": {
      color: "blue",
      transform: "scale(1.3)",
      transition: "0.5s transform",
    },
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

  textBox: {
    padding: "5%",
  },

  shrink: {
    transform: "scale(0)",
    maxHeight: "45px",
    transition: "0.5s max-height ease-out",
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
  const [changeScene, setScene] = useState(false);
  const [screenW, setScreenW] = useState(window.innerWidth);
  const [screenH, setScreenH] = useState(window.innerHeight);
  const [smallLaptopAnimation, setAnimation] = useState("");
  const theme = useTheme();

  var screenSize = useMediaQuery(theme.breakpoints.down("sm"));

  const { Pagechange, setPage, MetaData, setMetaData } = useContext(MyContext);

  //setScreenW(window.innerWidth);
  //setScreenH(window.innerHeight);
  console.log("screenW screenH-->", screenW, screenH);
  console.log("screenSize", screenSize);

  React.useEffect(() => {
    function handleResize() {
      console.log("resized to: ", window.innerWidth, "x", window.innerHeight);
      setScreenH(window.innerHeight);
      //headline();
    }
    window.addEventListener("resize", handleResize);
  });

  React.useEffect(  () => {
    if(smallLaptopAnimation !== ""){
      setTimeout(() => {
        setMetaData(null);
        setPage(null);
      }, 1000);
    }

  }, [smallLaptopAnimation]);

  function signUpToggle(x) {
    console.log("I fireed!!");
    signUpSwitch(x);
  }

  function accessGranted(value) {
      setAccess(value);
    if (screenH < 760 && !screenSize){
      setAnimation(" animated fadeOut delay-0.5s");
    }

  }

  function forgotPassAnimation() {
    if (forgotPass) {
      setScene(true);
    } else {
      setScene(false);
    }
  }

  function headline() {
    console.log("I rendered");
    if (screenH < 760 && !screenSize) {
      return (
        <div className={buttonContainer ? classes.shrink : "Spacing"}>
          <div style={{ marginTop: "10vh" }}>
            <div className={classes.container}>
              <div className={classes.covid}>COVID-19</div>
            </div>
            <h1 className={classes.heading}>CORONA VIRUS</h1>
            <h2 className={classes.heading}>Where are you?</h2>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={
            isAccessGranted
              ? "Spacing animated fadeOutUp delay-0.5s"
              : "Spacing"
          }
          onAnimationEnd={() => {
            setAnimation(" animated fadeOut");
          }}
        >
          <div style={{ marginTop: "10vh" }}>
            <div className={classes.container}>
              <div className={classes.covid}>COVID-19</div>
            </div>
            <h1 className={classes.heading}>CORONA VIRUS</h1>
            <h2 className={classes.heading}>Where are you?</h2>
          </div>
        </div>
      );
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
    changeScene
      ? (element = (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={
              forgotPass
                ? "animate__animated animate__backInLeft"
                : "animate__animated animate__backOutLeft"
            }
            onAnimationEnd={() => forgotPassAnimation()}
          >
            <Grid item xs={12} sm={8} md={4} lg={4} xl={3}>
              <ForgotPass
                ForgotPassClick={() => setForgotPass(false)}
              ></ForgotPass>
            </Grid>
          </Grid>
        ))
      : (element = (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={
              forgotPass
                ? "animate__animated animate__backOutRight"
                : "animated zoomIn"
            }
            onAnimationEnd={() => forgotPassAnimation()}
          >
            <Grid item xs={12} sm={8} md={4} lg={4} xl={3}>
              <Login
                SignUpClick={() => signUpToggle(true)}
                accessGranted={(value) => accessGranted(value)}
                ForgotPassClick={() => setForgotPass(true)}
              ></Login>
            </Grid>
          </Grid>
        ));
  } else {
    element = (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
          <SignUp
            SignInClick={() => signUpToggle(false)}
            accessGranted={(value) => accessGranted(value)}
          ></SignUp>
        </Grid>
      </Grid>
    );
  }
  /**Conditional End**/

  let page;
  if (Pagechange) {
    page = (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        // style={{ maxHeight: "100%" }}
      >
        <Grid item xs={12} style={{ minHeight: "100%" }}>
          {/* <Verify></Verify> */}
          <Dashboard></Dashboard>
        </Grid>
      </Grid>
    );
  } else {
    page = (
      <div className={classes.App + smallLaptopAnimation} id="start">
        <MenuBar isMobile={screenSize}></MenuBar>
        <header className="App-header">
          {headline()}
          {element}
          <div className={classes.container}>
            <a className={classes.arrow} href="#about">
              <KeyboardArrowDownSharpIcon
                style={{ fontSize: 100 }}
              ></KeyboardArrowDownSharpIcon>
            </a>
          </div>
        </header>
        <div style={{ height: 300 }} id="about"></div>
        <Paper>
          <Grid container justify="space-evenly" className={classes.textBox}>
            <Grid item xs={12} sm={6} md={6}>
              <h1>About This Project</h1>
              <div>
                <h3>
                  Login, report your location, find out where it's hiding.
                </h3>
                <div>
                  COVID-Tracker is a unique web application that allows users to
                  report and track COVID-19. Much like checking the weather, a
                  user is able to navigate to this website, and check the social
                  climate on whether or not the virus is spreading around their
                  community.
                </div>
                <br></br>
                <div>
                  The application is based around a crowd sourced model. That
                  is, users are to report their status daily before viewing
                  COVID-19 activity in their particular area.
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Spreading></Spreading>
            </Grid>
          </Grid>
        </Paper>

        <div style={{ height: 50 }}></div>

        <Paper>
          <Grid container justify="center" className={classes.textBox}>
            <Grid item xs={12} sm={3} md={3}>
              <img
                src={ProfilePic}
                style={{ borderRadius: "50%", border: "solid", width: "50%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <h1>Who made it.</h1>
              <div>
                <h3>The guy who invented the platform</h3>
                <div>
                  "There was a serious need to know where COVID-19 is lurking."
                </div>
                <br></br>
                <div>
                  <FullScreenDialog name="Read More" title="The Full Story">
                    Read more
                  </FullScreenDialog>
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>

        <div style={{ height: 300 }} id="covid"></div>

        <Paper>
          <Grid container justify="space-evenly" className={classes.textBox}>
            <Grid item xs={12} sm={6} md={6}>
              <h1>About COVID-19</h1>
              <div>
                <p>
                  COVID-19 is the infectious disease caused by the most recently
                  discovered coronavirus. This new virus and disease were
                  unknown before the outbreak began in Wuhan, China, in December
                  2019. COVID-19 is now a pandemic affecting many countries
                  globally.
                </p>
              </div>
              <div>
                <p>
                  Coronaviruses are a large family of viruses which may cause
                  illness in animals or humans. In humans, several coronaviruses
                  are known to cause respiratory infections ranging from the
                  common cold to more severe diseases such as Middle East
                  Respiratory Syndrome (MERS) and Severe Acute Respiratory
                  Syndrome (SARS). The most recently discovered coronavirus
                  causes coronavirus disease COVID-19.
                </p>
              </div>
              <div>
                <p>
                  The most common symptoms of COVID-19 are fever, dry cough, and
                  tiredness. Other symptoms that are less common and may affect
                  some patients include aches and pains, nasal congestion,
                  headache, conjunctivitis, sore throat, diarrhea, loss of taste
                  or smell or a rash on skin or discoloration of fingers or
                  toes. These symptoms are usually mild and begin gradually.
                  Some people become infected but only have very mild symptoms.
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Corona></Corona>
            </Grid>
          </Grid>
        </Paper>

        <div id="FAQ" style={{ height: 300 }}></div>
        <Grid container justify="space-evenly">
          <Grid item xs={12} md={6}>
            <h1>FAQ</h1>
            <Accordion></Accordion>
          </Grid>
        </Grid>
        <div style={{ height: 300 }}></div>
      </div>
    );
  }

  return (
    <>
      <div className={classes.Backdrop}></div>
      {page}
      <Footer></Footer>
    </>
  );
}

export default External;
