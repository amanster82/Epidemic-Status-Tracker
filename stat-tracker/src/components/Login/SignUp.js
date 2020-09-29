import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { getBackendURL } from "../../util";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function postData(
  email,
  pass,
  gender,
  selectedDate,
  setEmailError,
  setSpinner,
  setAccessGranted,
  setEmailLabel
) {
  console.log("email:", email);
  console.log("pass:", pass);

  const register = {
    email: email,
    pass: pass,
    gender: gender,
    birthdate: selectedDate,
  };

  setSpinner(true);
  axios
    .post(getBackendURL() + `/api/register`, register, {
      withCredentials: true,
    })
    .then(function (res) {
      console.log(res);
      console.log(res.data);
      console.log("setting the error to false");
      setEmailError(false);
      setSpinner(false);
      setAccessGranted(true);
    })
    .catch(function (error) {
      console.log("setting the error to true");
      console.log("error", error);
      console.log(error.response.data);
      setEmailError(true);
      setSpinner(false);
      setEmailLabel(error.response.data);
    });
}

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1%",
    width: "65vh",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "43vh", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  flexMe: {
    padding: "10%",
  },

  iconContainer: {
    height: "6vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  radioLabel: {
    marginLeft: "0px !important",
    marginRight: "5px !important",
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passRepeat, setPassRepear] = useState("");
  const [isPassError, setPassError] = useState(false);
  const [showSpinner, setSpinner] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [gender, setGender] = React.useState("");
  const [selectedDate, handleDateChange] = useState(null);

  let icon;

  if (showSpinner) {
    icon = <CircularProgress />;
  } else {
    icon = (
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
    );
  }

  return (
    <Paper
      elevation={3}
      className={
        accessGranted
          ? "animated bounceOutDown"
          : "animate__animated animate__flipInY"
      }
      onAnimationEnd={accessGranted ? props.accessGranted(true) : null}
    >
      <Grid
        container
        className={classes.flexMe}
        onAnimationEnd={accessGranted ? props.accessGranted(true) : null}
      >
        <Grid item xs={12}>
          <div className={classes.iconContainer}>{icon}</div>
          <Typography component="h1" variant="h5" align="center">
            Sign Up
          </Typography>
          <form noValidate>
            <TextField
              error={isEmailError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={emailLabel}
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => {
                if (e.target.value.indexOf("@") > -1 || e.target.value === "") {
                  setEmail(e.target.value);
                  setEmailError(false);
                  setEmailLabel("Email");
                } else {
                  setEmailError(true);
                  setEmailLabel("Not a valid email");
                }
              }}
            />
            <TextField
              error={isPassError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={isPassError ? "Passwords do not match" : "Set a Password"}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPass(e.target.value)}
            />
            <TextField
              error={isPassError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={isPassError ? "Passwords do not match" : "Repeat Password"}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                e.target.value !== pass
                  ? setPassError(true)
                  : setPassError(false)
              }
            />
            <FormControl component="fieldset" style={{width: "100%"}}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={4}>
                  <FormLabel component="legend">Gender</FormLabel>
                </Grid>
                <Grid item xs={8}>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    defaultValue="top"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio color="primary" />}
                      label="Male"
                      labelPlacement="start"
                      className={classes.radioLabel}
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio color="primary" />}
                      label="Female"
                      labelPlacement="start"
                      className={classes.radioLabel}
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={4}>
                  <FormLabel component="legend">Birthday</FormLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e)=>handleDateChange(e.target.value)}
                  />
                </Grid>
              </Grid>
            </FormControl>

            <Button
              disabled={
                isPassError ||
                isEmailError ||
                pass == "" ||
                email == "" ||
                gender == "" ||
                selectedDate == null
              }
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() =>
                postData(
                  email,
                  pass,
                  gender,
                  selectedDate,
                  setEmailError,
                  setSpinner,
                  setAccessGranted,
                  setEmailLabel
                )
              }
            >
              Get Started
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link onClick={props.SignInClick} variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Box mt={8}></Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
