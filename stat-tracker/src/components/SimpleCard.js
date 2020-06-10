import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginRight: '1%'
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  container: {
    display: 'flex',
    alignItems: 'baseline',
    // justifyContent: 'center'
  }
});

export default function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container className={classes.container}>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <h3>Email:</h3>
          </Grid>
          <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
            <p>sample@hotmail.com</p>
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <h3>Password:</h3>
          </Grid>
          <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
            <p type="password">sample@hotmail.com</p>
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <h3>Gender:</h3>
          </Grid>
          <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
            <p>Male</p>
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <h3>Birthday:</h3>
          </Grid>
          <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
            <p>February 8th 1993</p>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
  );
}
