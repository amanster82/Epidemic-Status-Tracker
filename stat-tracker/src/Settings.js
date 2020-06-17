import React from "react";
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

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "65vh",
  },
  radioLabel: {
    marginLeft: "0px !important",
    marginRight: "5px !important",
  },
  centered:{
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
  },
  padding:{
      padding: '8%'
  }
}));

function Settings(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

function changePassword (){
    if(state.checkedB){
        return( 
            <>          
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField label="New Password"></TextField>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField label="Repeat Password"></TextField>
      </Grid>
      </>
      )
    }
}

function format_birthday(birthday){
  var year = birthday.getFullYear();
  var month = birthday.getMonth();
  var date = birthday.getDate();

  if(String(month).length < 2){
    month= "0"+month;
  }

  if(String(date).length < 2){
    date = "0"+date;
  }

  return(year+'-'+month+'-'+date)
  
}

  return (
    <div className={classes.centered}>
      <Paper className={classes.paper}>
        <Grid container alignItems="center" spacing={3} className={classes.padding}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <h1>Personal Info</h1>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Button variant="outlined" color="primary">Save Changes</Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField label="Email" value={props.email}></TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField label="Birthdate" defaultValue={format_birthday( new Date(props.birthdate) )} type="date"  InputLabelProps={{shrink: true}}></TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="top"
                value={props.gender}
                //onChange={(event) => setGender(event.target.value)}
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
            <FormControlLabel control={
            <Switch 
            checked={state.checkedB}
            onChange={handleChange}
            name="checkedB"
            color="primary"
            />} label="Change Password" />
          </Grid>
        
            {changePassword()}

        </Grid>
        <Grid container></Grid>
      </Paper>
    </div>
  );
}

export default Settings;
