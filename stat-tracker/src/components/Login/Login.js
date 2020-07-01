import React, { useState } from "react";
import axios from "axios";
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
import CircularProgress from "@material-ui/core/CircularProgress";

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
  setSpinner,
  setAccessGranted,
  setEmailError,
  setEmailLabel,
  setPassError,
  setPassLabel
) {
  console.log("email:", email);
  console.log("pass:", pass);

  const login = {
    email: email,
    pass: pass,
  };

  setSpinner(true);
  let url = window.location.href;
  url = url.split(":");
  url = url[0] + ":" + url[1];
  console.log(url);
  axios
    .post(url + `:9000/api/login`, login, { withCredentials: true })
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
      console.log(error.response.data);
      console.log(error.response);
      if (error.response.data.message.indexOf("Password") > -1) {
        setPassLabel(error.response.data.message);
        setPassError(true);
      } else {
        setEmailLabel(error.response.data.message);
        setEmailError(true);
      }

      setSpinner(false);
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    height: "6vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isEmailError, setEmailError] = useState(false);
  const [isPassError, setPassError] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [passLabel, setPassLabel] = useState("Password");
  const [showSpinner, setSpinner] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
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
    <div
      className={
        accessGranted
          ? classes.flexMe + " animated bounceOutDown"
          : classes.flexMe
      }
      onAnimationEnd={accessGranted ? props.accessGranted(true) : null}
    >
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.iconContainer}>{icon}</div>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <div>
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
                setEmail(e.target.value);
                setEmailLabel("Email");
                setEmailError(false);
              }}
            />
            <TextField
              error={isPassError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={passLabel}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPass(e.target.value);
                setPassLabel("Password");
                setPassError(false);
              }}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              onClick={() =>
                postData(
                  email,
                  pass,
                  setSpinner,
                  setAccessGranted,
                  setEmailError,
                  setEmailLabel,
                  setPassError,
                  setPassLabel
                )
              }
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" onClick={props.ForgotPassClick} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" onClick={props.SignUpClick} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </div>
        </form>
        <Box mt={8}></Box>
      </Paper>
    </div>
  );
}
