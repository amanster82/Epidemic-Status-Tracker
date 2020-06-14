import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CaseCard from "./CaseCard";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";
import InfoCard from "./InfoCard";
import GoogleMaps from "./GoogleMaps";
import MapArea from "../Map/MapArea.js";
import ExpansionPanel from './ExpansionPanel';
import { sizing } from "@material-ui/system";
import { MyContext } from "../../MyContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import { set } from "date-fns";
import red from '@material-ui/core/colors/red';
import axios from "axios";

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
    justifyContent: "flex-start",
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
  const [spinner, setSpinner] = React.useState(false);
  const [coordinates, setCoordinates] = React.useState(props.coordinates);
  const [boundingBox, setBoundingbox] = React.useState(props.boundingBox);
  const [title, setTitle] = React.useState(props.location);
  const { setMetaData, MetaData, getMetaData } = useContext(MyContext);

  console.log("WTF!!@@##", coordinates);

  useEffect(() => {
    if (spinner) {
      console.log("TURNED OFF");
      console.log("THESE ARE THE COORDINATES", coordinates);
      setSpinner(false);
    } else {
      console.log("TURNED ON");
    }
  }, [boundingBox]);

  console.log("-----------------in the Canvas---------------");
  console.log(MetaData);

  function onLocationChange(value) {
    // alert(!value);
    // console.log('value', !value);
    setLocation(!value);
  }

  async function onStateChange(val) {

    console.log("DONT FUCK IT UP:", val);
    let url = window.location.href;
    url = url.split(":");
    url = url[0] + ":" + url[1];
    console.log(url);
    setSpinner(true);
    if (val !== "") {
      let returned = await getMetaData(setMetaData, val);
      let bounds = await axios.get(url + `:9000/api/dashboard`, {
        withCredentials: true,
      });
      console.log(bounds);
      console.log("THE ROWS THE RWOS!!!!", bounds.data.rows);
      console.log("the boundries", bounds.data.boundries);
      console.log("RETURNEDDDDDDD:", returned);
      setMetaData(returned);
      let coordinates = [
        returned.data.locations[0].lat,
        returned.data.locations[0].long,
      ];
      setCoordinates(coordinates);
      setTitle(returned.data.locations[0].postal);
      setLocation(false);
      setBoundingbox(bounds.data.boundries);
    } else {
      setSpinner(false);
    }
  }

  function Headline() {
    return (
      <React.Fragment>
        <Grid container style={{padding: '1%'}}>
          <Grid
            item
            xs={locationClick ? 12 : 12}
            sm={locationClick ? 12 : 8}
            md={locationClick ? 12 : 4}
            lg={3}
            xl={2}
            className={classes.perfectCenter}
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
              xs={locationClick ? 12 : 4}
              sm={locationClick ? 12 : 4}
              md={locationClick ? 10 : 4}
              lg={locationClick ? 10 : 4}
              xl={10}
            >
              {locationClick ? (
                <GoogleMaps locationClick={locationClick} place={(e, x) => onStateChange(e, x)}></GoogleMaps>
              ) : (
                <h1>{title}</h1>
              )}
            </Grid>
          </Grid>
      </React.Fragment>
    );
  }

  function CaseCards() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <CaseCard
            status="Positive"
            number={MetaData.data.positives}
          ></CaseCard>
        </Grid>

        <Grid item xs={12}>
          <CaseCard
            status="Possible"
            number={MetaData.data.possibilities}
          ></CaseCard>
        </Grid>

        <Grid item xs={12}>
          <CaseCard
            status="Negative"
            number={MetaData.data.negatives}
          ></CaseCard>
        </Grid>

        <Grid item xs={12}>
          <CaseCard
            color="blue"
            status="Recovered"
            number={MetaData.data.recoveries}
          ></CaseCard>
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

  function UserData(){
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <ExpansionPanel />
        </Grid>
      </React.Fragment>
    );
  }

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

  return (
    <div>
      {spinner ? (
        SpinnerElement
      ) : (
        <Grid container justify="center">
          <Grid item xs={12} className={classes.perfectCenter} style={{marginBottom: '2%'}}>
            <Headline />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={5}
            xl={3}
            style={{ padding: "1%" }}
          >
            {/* <UserData/> */}
            <CaseCards />
            <Info />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={7}
            xl={9}
            style={{ padding: "1%" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
                border: "solid",
              }}
            >
              <MapArea
                coordinates={coordinates}
                boundingBox={boundingBox}
              ></MapArea>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Canvas;
