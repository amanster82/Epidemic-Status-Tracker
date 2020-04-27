import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Report from './Report';
import Badge from '@material-ui/core/Badge';
import Popover from '@material-ui/core/Popover';
import Skeleton from '@material-ui/lab/Skeleton';
import axios from 'axios';
import Canvas from './components/Canvas/Canvas'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  
  canvas:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  
}));

export default function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false); // change to false
  const [reportCompleted, setReport] = React.useState(false); // change to false
  const [usersReport, setUserReport] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [buttonEnterance, setButtonEnterance] = React.useState("animated fadeIn delay-3s");
  const [showSpinner, setSpinner] = React.useState(true); //change to true
  const [coordinates, setCoordinates] = React.useState([]);
  const [location, setLocation] = React.useState("North Vancouver"); //change to empty

  console.log("after state refresh", usersReport);

  function submittedAnswers(value) {
    console.log("and the submitttteeeeddd answers are....")
    setUserReport(value);
    setReport(true);
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
    console.log("THE USE EFFECT!");
    console.log("the coordinates"+coordinates);
    getAreaInfo();
  },[coordinates]);

  function getCoordinates(postal){
    // Make a request for a user with a given ID
    console.log("the postal code", postal);
    axios.get('http://geogratis.gc.ca/services/geolocation/en/locate?q='+postal)
      .then(function (response) {
        // handle success
        console.log("something went right");
        console.log(response);

        let latAndLong = [response.data[0].geometry.coordinates[1], response.data[0].geometry.coordinates[0]]
        setCoordinates(latAndLong);

      })
      .catch(function (error) {
        // handle error
        console.log("something went horribly wrong");
        console.log(error);
      })
      .then(function () {
        // always executed
        console.log("something happened");
      });
  }

  function getAreaInfo(){
    console.log("the lat:" + coordinates[0]);
    console.log("the long:"+ coordinates[1]);
    var x = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+coordinates[0]+'&lon='+coordinates[1];
    console.log(x);
    axios.get(x) 
    .then(function (response) {
      console.log(response.data.display_name);
      setLocation(response.data.display_name);
    })
    .catch(function (error) {
      // handle error
      console.log("something went horribly wrong");
      console.log(error);
    })
    .then(function () {
      // always executed
      console.log("something happened");
    });
  }


  function conditionRender(){
    if(!status && !reportCompleted){
      return(
      <Grid container 
          spacing={3} 
          direction="row"
          justify="center"
          alignItems="center">
          <Grid item xs={12} className={classes.canvas}>        
          <h1 className="animated fadeIn">We all have to do our part.</h1>
          </Grid>
          <Grid item xs={12} className={classes.canvas}>        
          <h1 className="animated fadeIn delay-2s">Report your status to unlock virus tracking, and the affects in your area.</h1>
          </Grid>
          <Grid item xs={3} className={classes.canvas}>        
            <Button className={buttonEnterance} variant="contained" color="primary" onClick={()=> setStatus(true)} onAnimationEnd={()=>setButtonEnterance("animated infinite pulse")}>Report Status</Button>
          </Grid>
      </Grid>
      )
    }else if(status && !reportCompleted){
      
      return <Report submit={(x)=>submittedAnswers(x)}></Report>

    } else if(reportCompleted && status) {
      console.log("this is the user report", usersReport);
        if(showSpinner){
        console.log("this is the report location", usersReport[0].location);
        getCoordinates(usersReport[0].location);
          return(          
            <div>
              <Skeleton variant="text" />
              <Skeleton variant="circle" width={124} height={124} />
              <Skeleton variant="rect" width={'100%'} height={'70vh'} />
            </div>
          )
        }else {
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
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                  <ListItem button>
                    <ListItemIcon>
                      <AccountCircle></AccountCircle>
                    </ListItemIcon>
                    <ListItemText primary={'Account'} />
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
          )
        }
    }
  }

  return (
    conditionRender()
    );
}
