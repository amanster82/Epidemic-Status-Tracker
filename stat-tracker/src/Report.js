import React from "react";
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

function getStepContent(stepIndex, getResponse, value) {
  console.log("is this called twice?")
  switch (stepIndex) {
    case 0:
      return <Form step={stepIndex}  response={(value)=> getResponse(value, stepIndex)}></Form>;
    case 1:
      return <Form step={stepIndex} response={(value)=> getResponse(value, stepIndex)}></Form>;
    case 2:
      return <Form step={stepIndex} response={(value)=> getResponse(value, stepIndex)} ></Form>;
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
  const steps = getSteps();

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
      let response = await axios.get("http://geogratis.gc.ca/services/geolocation/en/locate?q="+(FormReponsesObj[0].location).toUpperCase())
      let restructuredResponse = 
      {
        location: (FormReponsesObj[0].location).toUpperCase(),
        risk: FormReponsesObj[0].risk,
        status: FormReponsesObj[0].status,
        symptoms: Object.keys(FormReponsesObj[0].symptoms),
        lat: response.data[0].geometry.coordinates[1],
        long: response.data[0].geometry.coordinates[0]
      }
       
      console.log("this is restructured", restructuredResponse);
      props.submit(restructuredResponse);
      //audio.play();
    }else {
      console.log("getting here??")
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setResponse(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
                  {getStepContent(activeStep, getResponse)}
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
