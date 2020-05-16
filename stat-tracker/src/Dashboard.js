import React, { useState, useEffect } from "react";
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
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Report from "./Report";
import axios from "axios";
import Canvas from "./components/Canvas/Canvas";
import CircularProgress from "@material-ui/core/CircularProgress";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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

function onPageLoad(setStatus, setReport, setUserReport, setSpinner) {
  let url = window.location.href;
  url = url.split(":");
  url = url[0] + ":" + url[1];
  console.log(url);
  axios
    .get(url + `:9000/api/dashboard`, { withCredentials: true })
    .then(function (res) {
      console.log(res);
      console.log("THE ROWS THE RWOS!!!!", res.data.rows);
      if(res.data.rows == undefined){
        setStatus(false);
        setReport(false);
        setSpinner(false);
      }else{
        setStatus(true);
        setReport(true);
        setUserReport(res.data.rows);
      }
    })
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
    let url = window.location.href;
    url = url.split(":");
    url = url[0] + ":" + url[1];
    console.log(url);
    setSpinner(true);
    console.log("THE SUBMITTED ANSWERS ARE THE FOLLOWING:");
    console.log(value);
    axios
      .post(url + `:9000/api/report`, value, { withCredentials: true })
      .then(function (response) {
        console.log("inside the then");
        console.log(response);
        console.log(response);
        setReport(true);
        setStatus(true);
        setUserReport(value);
      })

      .catch(function (error) {
        console.log(error);
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
    //problem lies here
    // console.log("this is the report location", usersReport[0].location);
    if (usersReport != null) {
      getCoordinates(usersReport.location);
    }
    //console.log("THE USE EFFECT!");
    //console.log("the coordinates" + coordinates);
    // getAreaInfo();
  }, [usersReport]);

  useEffect(() => {
    status == null && reportCompleted == null
      ? onPageLoad(setStatus, setReport, setUserReport, setSpinner)
      : console.log("Dashboard.js Effect Done");
  });

  function getCoordinates(postal) {
    // Make a request for a user with a given ID
    console.log("the postal code", postal);
    axios
      .get("http://geogratisg.ca/services/geolocation/en/locate?q=" + postal)
      .then(function (response) {
        // handle success
        console.log("something went right");
        console.log(response);

        let latAndLong = [
          response.data[0].geometry.coordinates[1],
          response.data[0].geometry.coordinates[0],
        ];
        console.log("lat and long", latAndLong);
        setCoordinates(latAndLong);
        //setSpinner(false);
        getAreaInfo(latAndLong);
      })
      .catch(function (error) {
        // handle error
        console.log("Connection error to geotgratis");
        console.log(error);
        setApiDown(true);
      })
      .then(function () {
        // always executed
        console.log("something happened");
      });
  }

  function getAreaInfo(latAndLong) {
    var x =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
      latAndLong[0] +
      "&lon=" +
      latAndLong[1];
    console.log(x);
    axios
      .get(x)
      .then(function (response) {
        console.log(response.data.display_name);
        setLocation(response.data.display_name);
        setSpinner(false);
      })
      .catch(function (error) {
        // handle error
        console.log(
          "Connecting error to open streetmaps. Please try again later"
        );
        console.log(error);
        setApiDown(true);
      })
      .then(function () {
        // always executed
        console.log("something happened");
      });
  }

  function conditionRender() {
    if (!status && !reportCompleted) {
      return (
        <Grid
          container
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} className={classes.canvas}>
            <h1 className="animated fadeIn">We all have to do our part.</h1>
          </Grid>
          <Grid item xs={12} className={classes.canvas}>
            <h1 className="animated fadeIn delay-2s">
              Report your status to unlock virus tracking, and the affects in
              your area.
            </h1>
          </Grid>
          <Grid item xs={12} className={classes.canvas}>
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
        </Grid>
      );
    } else if (status && !reportCompleted) {
      return <Report submit={(x) => submittedAnswers(x)}></Report>;
    } else if (reportCompleted && status) {
      console.log("this is the user report", usersReport);
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
              <Typography variant="h6" noWrap>
                Home
              </Typography>
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
              <ListItem button>
                <ListItemIcon>
                  <AccountCircle></AccountCircle>
                </ListItemIcon>
                <ListItemText primary={"Account"} />
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

            <Canvas location={location} coordinates={coordinates}></Canvas>
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
          Network is down at the moment. Please try again later.
        </h1>
      );
    else {
      return showSpinner ? SpinnerElement : conditionRender();
    }
  }

  return renderCheck();
}
