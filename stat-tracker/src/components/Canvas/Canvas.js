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
import { sizing } from "@material-ui/system";
import { MyContext } from "../../MyContext";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  const [spinner, setSpinner] = React.useState(false);
  const {setMetaData, MetaData, getMetaData } = useContext(MyContext);

  
  useEffect(() => {
    if(spinner){
      console.log("TURNED ON");
      
    }else{
      console.log("TURNED OFF");
    }
  }, [spinner]);

  console.log("-----------------in the Canvas---------------");
  console.log(MetaData);

  function onLocationChange(value) {
    // alert(!value);
    // console.log('value', !value);
    setLocation(!value);
  }

  function onStateChange(val){
    console.log("DONT FUCK IT UP:", val)
    if(val !== ''){
      setSpinner(true);
      let returned = getMetaData(setMetaData, val);
      if(returned){
        setSpinner(false);
      }
    }else{
      setSpinner(false);
    }
    
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
          xl={6}
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
          xl={6}
          className={classes.center}
        >
          {locationClick ? (
            <GoogleMaps place={(x)=>onStateChange(x)}></GoogleMaps>
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
            justify="center"
            style={{ padding: "1%" }}
          >
            <CaseCards />
            <Info />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
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
                coordinates={props.coordinates}
                boundingBox={props.boundingBox}
              ></MapArea>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Canvas;
