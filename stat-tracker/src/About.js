import React from 'react';
import { AppBar, Grid, Paper } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
    Backdrop: {
        backgroundColor: "#dfdbe5",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        position: "absolute",
        width: "100%",
        height: "100%",
        position: "fixed",
        zIndex: "-1",
      }
})

function About(props) {
    const classes = useStyles();
    return (
        <>
        <div className={classes.Backdrop}></div>
        <AppBar>
          <Toolbar>
            <Grid container justify="flex-end">
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <a href="#about">About Project</a>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <a href="#covid">About COVID-19</a>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <a href="#FAQ">FAQ</a>
              </Grid>
              <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                <a href="#start">Live Tracker</a>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        
        </>
    );
}

export default About;