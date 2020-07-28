import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from './Dialog'
const useStyles = makeStyles({
links: {
    textAlign: 'center'

}
})

function Footer(props) {
const classes = useStyles();
  return (
    <div>
      <Paper>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ height: "5rem", paddingLeft: "2%", paddingRight: "2%"}}
        >
          <Grid item xs={12} lg={6} xl={9} justify="center">
            Copyright © 2020 COVID-Tracker. All rights reserved.
          </Grid>
          <Grid item xs={4} lg={2} xl={1} justify="center" className={classes.links}>
          <Dialog name ="Contact"></Dialog>
          </Grid>
          <Grid item xs={4} lg={2} xl={1} justify="center" className={classes.links}>
            <Dialog name ="Privacy Policy"></Dialog>
          </Grid>
          <Grid item xs={4} lg={2} xl={1} justify="center" className={classes.links}>
            <Dialog name ="Terms & Conditions"></Dialog>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Footer;
