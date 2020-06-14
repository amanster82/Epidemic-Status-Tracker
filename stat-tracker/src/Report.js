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
import ReportSound from './static/sounds/Drip_Echo.wav';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
  },
}));

function getSteps() {
  return ["Status", "Risk", "Location"];
}

function getStepContent(whichButton, setButtonPress, stepIndex, getResponse, value) {
  console.log("is this called twice?")
  switch (stepIndex) {
    case 0:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)}></Form>;
    case 1:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)}></Form>;
    case 2:
      return <Form Ipressed={whichButton} setButton={(value) => setButtonPress(value)} step={stepIndex} response={(value)=> getResponse(value, stepIndex)} ></Form>;
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
  const steps = getSteps();

//   useEffect(() => {
//     setButtonPress("Next");   
// });
 

  function getResponse(value, stepIndex){
      console.log("got response", value)
      setResponse(value);
      setFormResponseObj(value);
      
      // if(stepIndex>1){
      //   FormReponsesObj = value;
      // }
  }

  const handleNext = async () => {
    if(activeStep === steps.length - 1){
      props.setSpinner(true);
      let responseA = await axios.get("http://geogratis.gc.ca/services/geolocation/en/locate?q="+(FormReponsesObj[0].postal).toUpperCase())
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

  return (
    <div className={classes.root+" animated zoomIn"}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div className={classes.flex}>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <Paper elevation={0}>
            <div className={classes.flex}>
              <div className={classes.instructions}>
                  {getStepContent(whichButton,setButtonPress, activeStep, getResponse)}
              </div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button disabled={!Response} variant="contained" color="primary" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </Paper>
        )}
      </div>
    </div>
  );
}
