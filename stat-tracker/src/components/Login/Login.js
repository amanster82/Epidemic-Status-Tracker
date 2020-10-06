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
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { getBackendURL } from "../../util";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

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
  axios
    .post(getBackendURL() + `/api/login`, login, { withCredentials: true })
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
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [email, setEmail] = useState(window.localStorage.getItem("covid_email"));
  const [pass, setPass] = useState(window.localStorage.getItem("covid_pass"));
  const [isEmailError, setEmailError] = useState(false);
  const [isPassError, setPassError] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [passLabel, setPassLabel] = useState("Password");
  const [showPassword, setShowPassword] = useState(false);
  const [showSpinner, setSpinner] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [rememberMe, setRemember] = useState( (window.localStorage.getItem("covid_email") !== null) ? true : false );
  const theme = useTheme();
  const screenSize = useMediaQuery(theme.breakpoints.down("lg"));
  var w = window.innerWidth;
  var h = window.innerHeight;
  console.log("screenSize-->", w, h);
  //alert("Is your screen size is medium or smaller:" + screenSize)
  console.log(getBackendURL());

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

  function grantAccess(){
    
    if(accessGranted){
      props.accessGranted(accessGranted);
    }

  }

  function remember(value){
    setRemember(value);
    if(value){
      window.localStorage.setItem("covid_email", email);
      window.localStorage.setItem("covid_pass", pass);
    }else{
      window.localStorage.removeItem("covid_email");
      window.localStorage.removeItem("covid_pass");
    }
  }
  

  return (
    <Paper
      elevation={3}
      className={accessGranted ? "animated bounceOutDown" : ""}
      onAnimationEnd={ () => grantAccess() }
    >
      <Grid
        container
        className={classes.flexMe}
      >
        <Grid item xs={12}>
          <div className={classes.iconContainer}>{icon}</div>
          <Typography component="h1" variant="h5" align="center">
            Sign in
          </Typography>
          <form noValidate>
            <div>
              <TextField
                defaultValue = {email}
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
                onKeyDown={(e) =>
                  e.key === "Enter"
                    ? postData(
                        email,
                        pass,
                        setSpinner,
                        setAccessGranted,
                        setEmailError,
                        setEmailLabel,
                        setPassError,
                        setPassLabel
                      )
                    : false
                }
                // size={screenSize ? "small" : "medium"}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" required>{passLabel}</InputLabel>
                <OutlinedInput
                  defaultValue={pass}
                  error={isPassError}
                  variant="outlined"
                  margin="normal"
                  required
                  name="password"
                  //label={passLabel}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPass(e.target.value);
                    setPassLabel("Password");
                    setPassError(false);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter"
                      ? postData(
                          email,
                          pass,
                          setSpinner,
                          setAccessGranted,
                          setEmailError,
                          setEmailLabel,
                          setPassError,
                          setPassLabel
                        )
                      : false
                  }
                  // size={screenSize ? "small" : "medium"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={isPassError ? 150 : 80}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} color="primary" disabled={ (pass && email) ? false : true  }/>}
                label="Remember me"
                onClick={(event)=>remember(event.target.checked)}
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
              <Grid container direction="column">
                <Grid item xs>
                  <Link
                    href="#"
                    onClick={props.ForgotPassClick}
                    variant="body2"
                  >
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
          {/* <Box mt={8}></Box> */}
        </Grid>
      </Grid>
    </Paper>
  );
}
