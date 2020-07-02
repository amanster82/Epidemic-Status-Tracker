import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  centered: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
     height: "60vh",
  },
}));

function Forgot(props) {
  const classes = useStyles();
  const [pass, setPass] = React.useState("");
  const [passRepeat, setPassRepeat] = React.useState("");
  const [isPassError, setPassError] = React.useState(false);

  async function sendToken(){
    let url = window.location.href;
    url = url.split(":");
    url = url[0] + ":" + url[1];
    console.log(url);

    let token = window.location.href
    token = token.split("/")
    token = token[4];
    console.log(token);

    let x = await axios.post(url + `:9000/api/verify`, {token: token, pass: pass}, { withCredentials: true })
    

  }

  function checkPasswordMatch(value) {
    setPassRepeat(value);
    value !== pass ? setPassError(true) : setPassError(false);
  }


  return (
    <>
      <div className={classes.centered}>
        <Grid container   justify="center"
  alignItems="center">
        <Grid item xs={9} sm={8} md={6} lg={6} xl={6}>
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

          <Button disabled={(pass !== passRepeat || pass.length === 0)} variant="contained" color="primary" onClick={()=> sendToken()}>
            Change Password
          </Button>
        </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Forgot;
