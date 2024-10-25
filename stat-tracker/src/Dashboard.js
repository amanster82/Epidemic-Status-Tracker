import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import AccountCircle from "@material-ui/icons/AccountCircle";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Report from "./Report";
import axios from "axios";
import Canvas from "./components/Canvas/Canvas";
import CircularProgress from "@material-ui/core/CircularProgress";
import Profile from "./Profile";
import { MyContext } from "./MyContext";
import Verify from "./components/Verification/Verify";
import Footer from "./components/Footer/Footer";
import { getBackendURL } from "./util";
import FreeBreakfastOutlinedIcon from "@material-ui/icons/FreeBreakfastOutlined";
import ReportSound from './static/sounds/Drip_Echo.wav';
import DOMPurify from "dompurify";

const myHTML = (
  '<a href="https://www.buymeacoffee.com/wherescovid" target="_blank">\
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;"></a>'
  );
const mySafeHTML = DOMPurify.sanitize(myHTML);

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerFooter: {
    display: "flex",
    height: "60vh",
    alignItems: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  canvas: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
}));

async function logout(setPage, setMetaData) {
  const logout = await axios.get(getBackendURL() + `/api/logout`, {
    withCredentials: true,
  });
  try {
    //alert("trying to log out now", logout)
    setPage(null);
    setMetaData(null);
  } catch {
    //alert("error logging out", logout)
  }
}

export default function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(null); // change to false
  const [reportCompleted, setReport] = React.useState(null); // change to false
  const [usersReport, setUserReport] = React.useState(null); //set user report to object
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [buttonEnterance, setButtonEnterance] = React.useState(
    "animated fadeIn delay-3s"
  );
  const [showSpinner, setSpinner] = React.useState(true); //change to true
  const [coordinates, setCoordinates] = React.useState([]);
  const [location, setLocation] = React.useState("North Vancouver"); //change to empty
  const [APIDown, setApiDown] = React.useState(null);
  const [boundingBox, setboundingBox] = React.useState(null);
  const [showProfile, setProfile] = React.useState("Dashboard");
  const [verification, setVerification] = React.useState(false);

  const {
    Pagechange,
    setPage,
    MetaData,
    setMetaData,
    getMetaData,
  } = useContext(MyContext);

  const SpinnerElement = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress></CircularProgress>
    </div>
  );

  function submittedAnswers(value) {
    axios
      .post(getBackendURL() + `/api/report`, value, { withCredentials: true })
      .then(async function (response) {
        let metaDataLoaded = await getMetaData(setMetaData);
        if (metaDataLoaded) {
          onPageLoad(value);
        }
      })

      .catch(function (error) {
      });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(status == null &&
    reportCompleted == null &&
    Pagechange != null &&
    MetaData != null){
      onPageLoad()
    }
  }, []);

  function onPageLoad(submittedAnswers) {
    axios
      .get(getBackendURL() + `/api/dashboard`, { withCredentials: true })
      .then(function (res) {
        if(res.data === 'Not Logged In.'){
          setApiDown(true);
        }
        setboundingBox(res.data.boundries);
        if (res.data.rows == undefined) {
          setStatus(false);
          setReport(false);
          setSpinner(false);
        } else {
          setStatus(true);
          setReport(true);
          setUserReport(res.data.rows);
          setLocation(res.data.rows.postal);
          setCoordinates([res.data.rows.lat, res.data.rows.long]);
          setSpinner(false);
          if(submittedAnswers){
            var audio = new Audio(ReportSound);
            audio.play();
          }
        }
      });
  }

  function dashboardFocus() {
    if (showProfile === "Profile") {
      return <Profile></Profile>;
    } else {
      return (
        <Canvas
          location={location}
          coordinates={coordinates}
          boundingBox={boundingBox}
        ></Canvas>
      );
    }
  }

  function conditionRender() {
    if (!status && !reportCompleted) {
      return (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <Grid item xs={12} align="center">
            <h1 className="animated fadeIn">We all have to do our part.</h1>
          </Grid>
          <Grid item xs={12} align="center">
            <h1 className="animated fadeIn delay-2s">
              Report your status to unlock virus tracking, and the effects in
              your area.
            </h1>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              className={buttonEnterance}
              variant="contained"
              color="primary"
              onClick={() => setStatus(true)}
              onAnimationEnd={() =>
                setButtonEnterance("animated infinite pulse")
              }
            >
              Report Status
            </Button>
          </Grid>
          <Button
            className="animated fadeIn delay-3s"
            variant="outlined"
            size="small"
            onClick={() => logout(setPage, setMetaData)}
          >
            Exit
          </Button>
        </Grid>
      );
    } else if (status && !reportCompleted) {
      return (
        <Report
          submit={(x) => submittedAnswers(x)}
          setSpinner={(x) => setSpinner(x)}
          exit={() => logout(setPage, setMetaData)}
        ></Report>
      );
    } else if (reportCompleted && status && MetaData) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Grid container justify="flex-start" align="left" style={{width: 'auto'}}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h6" noWrap>
                {showProfile}
              </Typography>
              </Grid>
              </Grid>
              <Grid container justify="flex-end" align="right">
                <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
                <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />
                  {/* <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    href="https://www.buymeacoffee.com/wherescovid"
                    endIcon={<FreeBreakfastOutlinedIcon />}
                  >
                    Buy Me A Coffee
                  </Button> */}
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem button onClick={() => setProfile("Profile")}>
                <ListItemIcon>
                  <AccountCircle></AccountCircle>
                </ListItemIcon>
                <ListItemText primary={"Profile"} />
              </ListItem>
              <ListItem button onClick={() => setProfile("Dashboard")}>
                <ListItemIcon>
                  <DashboardIcon></DashboardIcon>
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItem>
              <div className={classes.drawerFooter}></div>
              <Divider />
              <ListItem button onClick={() => logout(setPage, setMetaData)}>
                <ListItemIcon>
                  <ExitToAppIcon></ExitToAppIcon>
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItem>
            </List>
            {/* <Divider />
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List> */}
          </Drawer>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            {dashboardFocus()}
          </main>
        </div>
      );
    }
  }

  function renderCheck() {
    if (APIDown)
      return (
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
          }}
        >
          Network is down or something went wrong. Please try again later.
        </h1>
      );
    else {
      return showSpinner ? SpinnerElement : conditionRender();
    }
  }

  return renderCheck();
}
