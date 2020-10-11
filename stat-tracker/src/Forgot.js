import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";
import Dialog from "./components/Dialog/Dialog.js";
import { getBackendURL } from "./util";
import { useHistory } from 'react-router-dom';



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
  const [openDialoge, triggerDialog] = React.useState(false)
  const history = useHistory();

  async function sendToken() {
    let token = window.location.href;
    token = token.split("/");
    token = token[4];
    let x = await axios.post(
      getBackendURL() + `/api/verify`,
      { token: token, pass: pass },
      { withCredentials: true }
    );
      triggerDialog(true);
      setTimeout(()=>{
        history.push("/")
      },3000)
  }

  function checkPasswordMatch(value) {
    setPassRepeat(value);
    value !== pass ? setPassError(true) : setPassError(false);
  }

  return (
    <>
      <div className={classes.centered}>
        <Grid container justify="center" alignItems="center">
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

            <Button
              disabled={pass !== passRepeat || pass.length === 0}
              variant="contained"
              color="primary"
              onClick={() => sendToken()}
            >
              Change Password
            </Button>
            <Dialog open={openDialoge} content={
            <>
            <div>
              <h3>Password Changed Successfully!</h3>
            </div>
            <div>
              <h3>You will now be redirected to login.</h3>
              </div>
            </>
          }></Dialog>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Forgot;
