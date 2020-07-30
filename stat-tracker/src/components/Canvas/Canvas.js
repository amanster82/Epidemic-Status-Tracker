import React, { useContext, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import UpdateStatus from "../Status/UpdateStatus";
import DotIcon from '@material-ui/icons/FiberManualRecord';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ReportSound from '../../static/sounds/Drip_Echo.wav';

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
  const theme = useTheme();

  const mobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  

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

  function statusColor(){

    if(MetaData.data.report.status === "-" || MetaData.data.report.status === "="){
      return {color: 'green'};
    }else if(MetaData.data.report.status === "s"){
      return {color: 'yellow'};
    }else{
      return {color: 'red'};
    }

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
      let coordinates = [
        returned.data.locations[0].lat,
        returned.data.locations[0].long,
      ];
      setMetaData(returned);
      setCoordinates(coordinates);
      setTitle(returned.data.locations[0].postal);
      setLocation(false);
      setBoundingbox(bounds.data.boundries);
    } else {
      setSpinner(false);
    }
  }

  async function updateStatus(value) {
    var audio = new Audio(ReportSound);
    let url = window.location.href;
    url = url.split(":");
    url = url[0] + ":" + url[1];
    console.log(url);
    console.log("THE SUBMITTED ANSWERS ARE THE FOLLOWING:");
    console.log(value);
    try{ 
      let response = await axios.post(url + `:9000/api/updateStatus`, value, { withCredentials: true })
      let refresh = await getMetaData(setMetaData)
      let bounds = await axios.get(url + `:9000/api/dashboard`, { withCredentials: true })
      
      console.log("response", response);
      console.log("bounds", bounds);
      console.log("resfresh", refresh);

      let coordinates = [
        refresh.data.locations[0].lat,
        refresh.data.locations[0].long,
      ];
      setMetaData(refresh);
      setCoordinates(coordinates);
      setTitle(refresh.data.locations[0].postal);
      setLocation(false);
      setBoundingbox(bounds.data.boundries);
      setSpinner(false);
      audio.play();
    }catch(error) {
        console.log("-------We have a problem------");
        console.log(error);
      };
  }


  function searchAndStatus(){
    if(mobileScreen){
      return(
        <>
        <Grid
              container
              item
              xs={12}
              sm={6}
              md={locationClick ? 6 : 2}
              lg={locationClick ? 2 : 3}
              xl={2}
              justify="center"
              alignItems="center"
              style={{marginBottom: '4em'}}
            >
              <Grid item
                container
                justify="center"
                alignItems="center"
                xl={12}
              >
                <h3>Status:</h3>
                <DotIcon style={statusColor()}/>
              </Grid>
              <UpdateStatus name="Update Status" submit={ (e) => updateStatus(e) } setSpinner={(e)=> setSpinner(e)}></UpdateStatus>
            </Grid>
      <Grid
            item
            xs={locationClick ? 12 : 12}
            sm={locationClick ? 6 : 6}
            md={locationClick ? 3 : 4}
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
              Explore Locations
            </Fab>
            </Grid>
            <Grid
            container
            justify="center"
            alignItems="center"
              item
              xs={12}
              sm={locationClick ? 12 : 12}
              md={locationClick ? 7 : 6}
              lg={locationClick ? 7 : 6}
              xl={8}
            >
              {locationClick ? (<><br></br><br></br></>) : <> </>}
              {locationClick ? (
                <GoogleMaps mobile={mobileScreen} locationClick={locationClick} place={(e, x) => onStateChange(e, x)}></GoogleMaps>
              ) : (
                <>
                <h1>{title}</h1>
                </>
              )}
            </Grid>
          </>
      )

    }
    if(smallScreen){
      return(
        <>
      <Grid
            item
            xs={locationClick ? 12 : 12}
            sm={locationClick ? 6 : 6}
            md={locationClick ? 3 : 4}
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
              Explore Locations
            </Fab>
            </Grid>
            <Grid
              container
              item
              xs={2}
              sm={6}
              md={locationClick ? 6 : 2}
              lg={locationClick ? 2 : 3}
              xl={2}
              justify="center"
              alignItems="center"
            >
              <Grid item
                container
                justify="center"
                alignItems="center"
                xl={12}
              >
                <h3>Status:</h3>
                <DotIcon style={statusColor()}/>
              </Grid>
              <UpdateStatus name="Update Status" submit={ (e) => updateStatus(e) } setSpinner={(e)=> setSpinner(e)}></UpdateStatus>
            </Grid>
            <Grid
              item
              xs={locationClick ? 12 : 6}
              sm={locationClick ? 12 : 12}
              md={locationClick ? 7 : 6}
              lg={locationClick ? 7 : 6}
              xl={8}
            >
              {locationClick ? (<><br></br><br></br></>) : <> </>}
              {locationClick ? (
                <GoogleMaps locationClick={locationClick} place={(e, x) => onStateChange(e, x)}></GoogleMaps>
              ) : (
                <>
                <h1>{title}</h1>
                </>
              )}
            </Grid>
          </>
      )
    }else{
      return(
        <>
      <Grid
            item
            xs={locationClick ? 12 : 12}
            sm={locationClick ? 6 : 6}
            md={locationClick ? 3 : 4}
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
              Explore Locations
            </Fab>
            </Grid>
            <Grid
              item
              xs={locationClick ? 12 : 6}
              sm={locationClick ? 12 : 12}
              md={locationClick ? 7 : 6}
              lg={locationClick ? 7 : 6}
              xl={8}
            >
              {locationClick ? (
                <GoogleMaps locationClick={locationClick} place={(e, x) => onStateChange(e, x)}></GoogleMaps>
              ) : (
                <>
                <h1>{title}</h1>
                </>
              )}
            </Grid>
            <Grid
              container
              item
              xs={2}
              sm={2}
              md={2}
              lg={locationClick ? 2 : 3}
              xl={2}
              justify="flex-end"
              alignItems="center"
            >
              <Grid item
                container
                justify="flex-end"
                alignItems="center"
                xl={12}
              >
                <h3>Status:</h3>
                <DotIcon style={statusColor()}/>
              </Grid>
              <UpdateStatus name="Update Status" submit={ (e) => updateStatus(e) } setSpinner={(e)=> setSpinner(e)}></UpdateStatus>
            </Grid>
          </>
      )
    }
  }


  function Headline() {
    return (
      <React.Fragment>
        <Grid container style={{padding: '1%'}}>
          {searchAndStatus()}
        </Grid>
      </React.Fragment>
    );
  }

  function CaseCards() {
    return (
      <React.Fragment>
        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <CaseCard
            status="Positive"
            number={MetaData.data.positives}
          ></CaseCard>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <CaseCard
            status="Possible"
            number={MetaData.data.possibilities}
          ></CaseCard>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <CaseCard
            status="Negative"
            number={MetaData.data.negatives}
          ></CaseCard>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
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
          <InfoCard recentNews={MetaData.data.scrapedData}/>
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
            md={4}
            lg={3}
            xl={2}
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
            md={8}
            lg={9}
            xl={10}
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
