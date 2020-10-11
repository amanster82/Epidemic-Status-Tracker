import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import {
  TextField,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { MyContext } from "./MyContext";
import Alert from "@material-ui/lab/Alert";
import { getBackendURL } from "./util";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "700px",
  },
  radioLabel: {
    marginLeft: "0px !important",
    marginRight: "5px !important",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  padding: {
    padding: "8%",
  },
}));

function Settings(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    setPass("");
    setPassRepeat("");
  };

  const [state, setState] = React.useState({ switch: false });
  const [email, setEmail] = React.useState(props.email);
  const [birth, setBirth] = React.useState(
    format_birthday(new Date(props.birthdate))
  );
  const [gender, setGender] = React.useState(props.gender);
  const [pass, setPass] = React.useState("");
  const [passRepeat, setPassRepeat] = React.useState("");
  const [isPassError, setPassError] = React.useState(false);
  const [alertVar, setAlert] = React.useState(true);
  const { MetaData, getMetaData, setMetaData } = useContext(MyContext);

  async function updateData() {
    let values = {
      email: email,
      birth: birth,
      gender: gender,
      pass: pass,
    };

    console.log("TELL ME THE VALUES:", values);

    let update = await axios.post(getBackendURL() + `/api/settings`, values, {
      withCredentials: true,
    });
    console.log("UPDATED?", update);
    setAlert(update);
    alert("Updated");

    let reloadMetaData = await getMetaData(setMetaData);
  }

  function checkPasswordMatch(value) {
    setPassRepeat(value);
    value !== pass ? setPassError(true) : setPassError(false);
  }

  const handleClick = () => {
    setAlert(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  function changePassword() {
    if (state.switch) {
      return (
        <>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              error={isPassError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={isPassError ? "Passwords do not match" : "New Password"}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPass(e.target.value);
                setPassError(false);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
              onChange={(e) => checkPasswordMatch(e.target.value)}
            />
          </Grid>
        </>
      );
    }
  }

  function format_birthday(birthday) {
    console.log("WHAT IS THE BIRTHDAY:", birthday);
    var year = birthday.getFullYear();
    var month = birthday.getMonth() + 1;
    var date = birthday.getDate();
    console.log("Year", year);
    console.log("Month", month);
    console.log("date", date);

    if (String(month).length < 2) {
      month = "0" + month;
    }

    if (String(date).length < 2) {
      date = "0" + date;
    }

    return year + "-" + month + "-" + date;
  }

  return (
    <div>
      <div className={classes.centered}>
        <Paper className={classes.paper}>
          <Grid
            container
            alignItems="center"
            spacing={3}
            className={classes.padding}
          >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <h1>Personal Info</h1>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Button
                disabled={
                  state.switch && (pass !== passRepeat || pass.length === 0)
                }
                variant="outlined"
                color="primary"
                onClick={() => updateData()}
              >
                Save Changes
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              ></TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                label="Birthdate"
                defaultValue={birth}
                type="date"
                onChange={(event) => setBirth(event.target.value)}
                InputLabelProps={{ shrink: true }}
              ></TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl component="fieldset">
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.switch}
                    onChange={handleChange}
                    name="switch"
                    color="primary"
                  />
                }
                label="Change Password"
              />
            </Grid>

            {changePassword()}
          </Grid>
          {/* <Grid container>
            <Grid item>
              <div>
                <Button variant="outlined" onClick={handleClick}>
                  Open success snackbar
                </Button>
                <Snackbar autoHideDuration={8000} open={alert} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success">
                    This is a success message!
                  </Alert>
                </Snackbar>
              </div>
            </Grid>
          </Grid> */}
        </Paper>
      </div>
    </div>
  );
}

export default Settings;
