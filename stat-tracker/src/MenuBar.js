import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
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
import MailIcon from "@material-ui/icons/Mail";
import { Button, Grid } from "@material-ui/core";
import FreeBreakfastOutlinedIcon from "@material-ui/icons/FreeBreakfastOutlined";
import DOMPurify from "dompurify";

const drawerWidth = 240;
const myHTML = (
  '<a href="https://www.buymeacoffee.com/wherescovid" target="_blank">\
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;"></a>'
  );
const mySafeHTML = DOMPurify.sanitize(myHTML);

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
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
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
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

export default function MenuBar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (props.isMobile) {
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
            <Grid container justify="flex-start" align="left">
              <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
                <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />
              </Grid>
            </Grid>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon></ListItemIcon>
              <a href="#about">About Project</a>
            </ListItem>
            <ListItem>
              <ListItemIcon></ListItemIcon>
              <a href="#covid">About COVID-19</a>
            </ListItem>
            <div className={classes.drawerFooter}></div>
            <ListItem>
              <ListItemIcon></ListItemIcon>
              <a href="#FAQ">FAQ</a>
            </ListItem>
            <ListItem>
              <ListItemIcon></ListItemIcon>
              <a href="#start">Live Tracker</a>
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  } else {
    return (
      <>
        <AppBar>
          <Toolbar>
            <Grid container justify="flex-start" align="center">
              <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
                <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />
              </Grid>
            </Grid>
            <Grid container justify="flex-end" align="center">
              <Grid item xs={3} sm={3} md={2} lg={3} xl={2}>
                <a href="#about">About Project</a>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={3} xl={2}>
                <a href="#covid">About COVID-19</a>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <a href="#FAQ">FAQ</a>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={2}>
                <a href="#start">Live Tracker</a>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </>
    );
  }
}
