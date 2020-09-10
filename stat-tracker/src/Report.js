import React, {useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Form from "./components/Status/Form";
import Paper from '@material-ui/core/Paper';
import { BrowserRouter, Route, RouteComponentProps } from "react-router-dom";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import ReportSound from './static/sounds/Drip_Echo.wav';
import { getBackendURL } from "./util";
import { set } from "date-fns";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    //height: "100%"
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: '80vh'
  },
}));

function getSteps(accountVerified) {

  console.log("VERIFIED ACCOUNT???? "+accountVerified)
  if(accountVerified){
    return ["Status", "Risk", "Location"];
  }else{
    return ["Status", "Risk", "Location", "Unlock"];
  }
  
}

function getStepContent(whichButton, setButtonPress, stepIndex, getResponse, codeVerify, email, changeEmail) {
  console.log("is this called twice?")
  switch (stepIndex) {
    case 0:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)}></Form>;
    case 1:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)}></Form>;
    case 2:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)} ></Form>;
    case 3:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)} 
                codeCorrect={codeVerify} emailChange={(email_change) => changeEmail(email_change)} user_email={email}></Form>;
    default: 
      return "Unknown stepIndex";
  }
}

export default function Report(props) {
  var audio = new Audio(ReportSound);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [Response, setResponse] = React.useState(false);
  const [FormReponsesObj, setFormResponseObj] = React.useState({});
  const [whichButton, setButtonPress] = React.useState("Next");
  const [codeVerify, setCodeVerify] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [accountVerified, setAccountVerified] = React.useState(false);

  console.log(">>>>>>>>>>>"+accountVerified);
  const steps = getSteps(accountVerified);

  useEffect(() => {
    sendCode();
},[activeStep === 3]);

useEffect(() => {
  checkUser();
});

 

  async function getResponse(value, stepIndex){
      console.log("got response", value)
      console.log(stepIndex);

      if(stepIndex === 3 ){
        if(value[0].code.length === 6){
            let codeCheck = await axios.post(getBackendURL() + `/api/codeCheck`, {code: value[0].code}, { withCredentials: true })
            console.log(codeCheck);
            setResponse(codeCheck.data.verify);
            setCodeVerify(codeCheck.data.verify)
        }else{
          setCodeVerify(null)
        }

      }else{
        setResponse(value)
      }

      setFormResponseObj(value);
      // if(stepIndex>1){
      //   FormReponsesObj = value;
      // }
  }


  async function changeEmail(email_change) {
    let response = await axios.post(getBackendURL() + `/api/codeCheck`, {changeEmail: email_change}, { withCredentials: true })
    console.log("Trying to change the email> ", response)
    sendCode();
  }


  const handleNext = async () => {
    if(activeStep === steps.length - 1){
      props.setSpinner(true);
      let responseA = await axios.get("https://geogratis.gc.ca/services/geolocation/en/locate?q="+(FormReponsesObj[0].postal).toUpperCase())
      let responseB =  await axios.get("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + responseA.data[0].geometry.coordinates[1] + "&lon=" + responseA.data[0].geometry.coordinates[0]) ;

      let restructuredResponse = 
      {
        postal: (FormReponsesObj[0].postal).toUpperCase(),
        risk: FormReponsesObj[0].risk,
        status: FormReponsesObj[0].status,
        symptoms: Object.keys(FormReponsesObj[0].symptoms),
        lat: responseA.data[0].geometry.coordinates[1],
        long: responseA.data[0].geometry.coordinates[0],
        location: responseB.data.display_name,
        province: responseB.data.address.state
      }
       
      console.log("this is restructured", restructuredResponse);
      props.submit(restructuredResponse);
      //audio.play();
    }else {
      console.log("getting here??")
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setResponse(false);
    }
    setButtonPress("Next");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setResponse(false);
    setButtonPress("Back");
  };

  const handleReset = () => {
    setActiveStep(0);
  };

async function sendCode(){
  if(activeStep === steps.length - 1){
    let code = await axios.get(getBackendURL() + `/api/sendCode`, { withCredentials: true })
    setEmail(code.data.email);
  }
}

async function checkUser(){
  console.log("CHECKING THE USER")
  let checkUser = await axios.get(getBackendURL() + `/api/verifiedUser`, { withCredentials: true })
  setAccountVerified(checkUser.data.verification);
}

  return (
    <Paper elevation={0} className={classes.root}>
    <Grid className={classes.root+ " animated fadeIn"} container justify="center" alignItems="center" >
      <Grid item xs={12}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      </Grid>
      <Grid item xs={12}>
        {activeStep === steps.length ? (
          <div className={classes.flex}>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
            <div className={classes.flex}>
              <div className={classes.instructions}>
                  {getStepContent(whichButton, setButtonPress, activeStep, getResponse, codeVerify, email, changeEmail)}
              </div>
              <div>
                <Button
                  onClick={activeStep === 0 ? props.exit : handleBack} 
                  className={classes.backButton}
                  variant="outlined"
                >
                  {activeStep === 0 ? "Exit" : "Back"}
                </Button>
                <Button disabled={!Response} variant="contained" color="primary" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
        )}
      </Grid>
    </Grid>
    </Paper>
  );
}
