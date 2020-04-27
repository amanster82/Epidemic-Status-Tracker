import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CaseCard from "./CaseCard";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";
import InfoCard from "./InfoCard";
import GoogleMaps from "./GoogleMaps";
import MapArea from "../Map/MapArea.js";
import { sizing } from "@material-ui/system";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },

  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  portionCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  perfectCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function Canvas(props) {
  const classes = useStyles();
  const [locationClick, setLocation] = React.useState(false);

  function onLocationChange(value) {
    // alert(!value);
    // console.log('value', !value);
    setLocation(!value);
  }

  function Headline() {
    return (
      <React.Fragment>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={9}
          xl={10}
          className={classes.portionCenter}
        >
          <Fab
            size="medium"
            variant="extended"
            onClick={() => onLocationChange(locationClick)}
          >
            <NavigationIcon />
            Change Location
          </Fab>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={3}
          xl={2}
          className={classes.center}
        >
          {locationClick ? (
            <GoogleMaps></GoogleMaps>
          ) : (
            <h1>{props.location}</h1>
          )}
        </Grid>
      </React.Fragment>
    );
  }

  function CaseCards() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <CaseCard status="Positive" number="8"></CaseCard>
        </Grid>

        <Grid item xs={12}>
          <CaseCard status="Possible" number="7"></CaseCard>
        </Grid>

        <Grid item xs={12}>
          <CaseCard status="Negative" number="6"></CaseCard>
        </Grid>

        <Grid item xs={12}>
          <CaseCard status="Recovered" number="5"></CaseCard>
        </Grid>
      </React.Fragment>
    );
  }

  function Info() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <InfoCard />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12} className={classes.perfectCenter}>
          <Headline />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={5}
          xl={3}
          style={{ display: "inline-grid", justifyContent: "center" }}
        >
          <CaseCards />
          <Info />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={7} xl={9}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <MapArea coordinates={props.coordinates}></MapArea>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Canvas;
