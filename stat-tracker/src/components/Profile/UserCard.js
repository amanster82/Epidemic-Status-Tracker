import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginRight: "1%",
    //width: '60%'
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
    display: "flex",
    alignItems: "baseline",
    justifyContent: "left",
  },
  label: {
    marginRight: "10px",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function UserInfoCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container className={classes.container}>
          <Grid item xs={5} sm={4} md={4} lg={4} xl={4}>
            <h3 className={classes.label}>Email:</h3>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div>
              <p>{props.email}</p>
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid item xs={5} sm={4} md={4} lg={4} xl={4}>
            <h3 className={classes.label}>Password:</h3>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <p className={classes.label}>{props.password}</p>
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid item xs={5} sm={4} md={4} lg={4} xl={4}>
            <h3 className={classes.label}>Gender:</h3>
          </Grid>
          <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
            <p>{props.gender}</p>
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid item xs={5} sm={4} md={4} lg={4} xl={4}>
            <h3 className={classes.label}>Birthday:</h3>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div>
              <p>{props.gender}</p>
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="outlined" size="small" startIcon={<EditIcon/>}
        >Edit
        </Button>
      </CardActions>
    </Card>
  );
}
