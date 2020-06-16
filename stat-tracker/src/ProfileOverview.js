import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import UserInfo from "./components/Profile/UserCard";
import ReportCard from "./components/Profile/ReportCard";
import Grid from "@material-ui/core/Grid";
import StatusCard from "./components/Profile/StatusCard";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import { Typography } from "@material-ui/core";
import ReportActivity from "./components/Profile/ReportActivity";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import DoneIcon from "@material-ui/icons/Done";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  container: {
    //marginRight: "10%",
   // marginBottom: "10%",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  table: {
    fontSize: "larger",
  },
  test: {
    maxWidth: "100% !important",
  },
  pushUp:{
      marginTop: "10%"
  },  
  centerColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
}));


function Profile(props) {
  const classes = useStyles();

  function calculate_Age(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function format_birthday(birthday) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months[birthday.getMonth()];
    var day = birthday.getDate();
    var year = birthday.getFullYear();
    var format = month+", " + day + " " + year

    return format;
  }
  
  return (
    <div>
      <div className={classes.center}>
        <Grid container className={classes.center}>
          <Grid
            item
            className={classes.left}
            xs={12}
            sm={12}
            md={4}
            lg={3}
            xl={2}
          >
            <Avatar className={classes.large}>
              <PersonIcon fontSize="large"></PersonIcon>
            </Avatar>
            <div style={{ marginLeft: "10px" }}>
              <div>
                <Typography component="h" variant="h5">
                  Profile
                </Typography>
              </div>
              <div>
                <Typography component="h" variant="subtitle1">
                  ID: {props.id}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
            <table className={classes.table}>
              <tr>
                <td>
                  <strong>Age:</strong>
                </td>
                <td>{calculate_Age(new Date(props.birthdate))}</td>
              </tr>
              <tr>
                <td>
                  <strong>Birth:</strong>
                </td>
                <td>{format_birthday(new Date(props.birthdate))}</td>
              </tr>
            </table>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
            <table className={classes.table}>
              <tr>
                <td>
                  <strong>Email:</strong>
                </td>
                <td>{props.email}</td>
              </tr>
              <tr>
                <td>
                  <strong>Province:</strong>
                </td>
                <td>{props.province}</td>
              </tr>
            </table>
          </Grid>
        </Grid>
      </div>
      <Grid
        container
        className={classes.center}
        style={{ marginBottom: "3%", marginTop: "3%" }}
      >
        <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
          <StatusCard
            title="Region"
            data={props.region}
            sub={props.province}
            color="white"
          ></StatusCard>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={3}
          xl={2}
          className={classes.test}
        >
          <StatusCard
            title="Status"
            data={props.status}
            sub="Today"
            color="yellow"
          ></StatusCard>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3} xl={2} className={classes.test}>
          <StatusCard
            title="Last Reported"
            data="12:00am"
            sub="PST"
            color="white"
          ></StatusCard>
        </Grid>
      </Grid>
      <Grid container className={classes.center}>
        <Grid item xs={12} sm={12} md={5} lg={6} xl={12} className={classes.centerColumn}>

          <Paper style={{ padding: "20px"}}>
            <h2>Symptom List</h2>
            <Chip
              label="Coughing"
              clickable
              //onDelete={handleDelete}
              deleteIcon={<DoneIcon />}
            />
            <Chip
              label="Fever"
              clickable
              //onDelete={handleDelete}
              deleteIcon={<DoneIcon />}
            />
            <Chip
              label="Shortness of Breath"
              clickable
              //onDelete={handleDelete}
              deleteIcon={<DoneIcon />}
            />
            <Chip
              label="Trouble Breathing"
              clickable
              //onDelete={handleDelete}
              deleteIcon={<DoneIcon />}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={5} lg={3} xl={6}>
          {/* <ReportActivity></ReportActivity> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default Profile;
