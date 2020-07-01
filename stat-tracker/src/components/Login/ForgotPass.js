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
  const [showSpinner, setSpinner] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Email");

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

  function sendEmail(){
    setSpinner(true);
    let url = window.location.href;
    url = url.split(":");
    url = url[0] + ":" + url[1];
    console.log(url);
    axios
      .post(url + `:9000/api/email`, {email: email, link: url}, { withCredentials: true })
      .then(function (res) {
        console.log(res);
        setSpinner(false);
      })
      .catch(function (error) {
        console.log(error.response);
        setEmailError(true);
        setEmailLabel(error.response.data);
        setSpinner(false);
      });
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
          Forgot Password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            error={isEmailError}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={emailLabel}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailLabel("Email");
              setEmailError(false);
            }}
          ></TextField>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={()=> sendEmail()}
          >
            Reset Account
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={props.ForgotPassClick}
          >
            Back
          </Button>
        </form>
        <Box mt={8}></Box>
      </Paper>
    </div>
  );
}
