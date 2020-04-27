import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from '@material-ui/core/FormGroup';
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GoogleMaps from '../Canvas/GoogleMaps';
import { makeStyles } from '@material-ui/core/styles';



function Form(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }}));


  const [statusValue, setStatusValue] = React.useState("");
  const [riskValue, setRiskValue] = React.useState("");
  const [sympValue, setSympValue] = React.useState({});
  const [postalCodeValue, setpostalCodeValue] = React.useState("");
  const classes = useStyles();
  
  const submitResponses = () => {
    const formResponses = [{
    status: statusValue,
    symptoms: Object.entries(sympValue).filter(([,v]) => v === true).reduce((prev, [k, v]) => ({...prev, [k]: v}), {}),
    risk: riskValue,
    location: postalCodeValue
  }];
  

  return(formResponses);
  };

  
  console.log(sympValue);
  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
    props.response(event.target.value);
  };

  const handleRiskChange = (event) => {
    setRiskValue(event.target.value);
    props.response(event.target.value);
  };

  const handleSympChange = (event) => {
    setSympValue({...sympValue, [event.target.name]: event.target.checked });
    
    if(statusValue==="="){
      props.response(true);
    }else{
      props.response(event.target.value);
    }
    
  };


  const handleLocationChange = (event) => {
    let regEx = /[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/;
    if(regEx.test(event.target.value) ){
      setpostalCodeValue(event.target.value);
      const formResponses = [{
        status: statusValue,
        symptoms: Object.entries(sympValue).filter(([,v]) => v === true).reduce((prev, [k, v]) => ({...prev, [k]: v}), {}),
        risk: riskValue,
        location: event.target.value
      }]
      props.response(formResponses);
    }else{
      console.log("error");
      //props.response(false);
    }
  };

  function conditionalRender() {
      if(statusValue=== "+" && props.step === 1 || statusValue === "s" && props.step === 1 || statusValue === "=" && props.step === 1){
        return(
            <div className={classes.root}>
                { (statusValue === "=")
                  ? <Typography variant="h6" align="center">What symptoms did you encounter during your duration with COVID-19? (Please choose from below)</Typography>
                  : <Typography variant="h6" align="center">Please choose at least one of the following symptoms from the below list:</Typography>
                }


                  <FormControl>
                    <FormGroup>
                        <FormControlLabel control={ <Checkbox name="Cough" onChange={handleSympChange}/>}  label="Cough"></FormControlLabel>
                        <FormControlLabel control={ <Checkbox name="Fever" onChange={handleSympChange}onChange={handleSympChange}/>} label="Fever"></FormControlLabel>
                        <FormControlLabel control={ <Checkbox name="Shortness of breath" onChange={handleSympChange}/>} label="Shortness of breath"></FormControlLabel>
                    </FormGroup>
                  </FormControl>

                  <FormControl>
                    <FormGroup>
                    <FormControlLabel control={ <Checkbox name="Fatigue or tiredness" onChange={handleSympChange}/>} label="Fatigue or tiredness"></FormControlLabel>
                      <FormControlLabel control={ <Checkbox name="Loss of smell or taste" onChange={handleSympChange}/>} label="Loss sense of smell or taste"></FormControlLabel>
                      <FormControlLabel control={ <Checkbox name="Trouble breathing" onChange={handleSympChange}/>} label="Trouble breathing"></FormControlLabel>
                    </FormGroup>
                  </FormControl>

                  <FormControl>
                    <FormGroup>
                      <FormControlLabel control={ <Checkbox name="Persistent pain or pressure in the chest" onChange={handleSympChange}/>} label="Persistent pain or pressure in the chest"></FormControlLabel>
                      <FormControlLabel control={ <Checkbox name="Confusion" onChange={handleSympChange}/>} label="Confusion"></FormControlLabel>
                      <FormControlLabel control={ <Checkbox name="Bluish lips or face" onChange={handleSympChange}/>} label="Bluish lips or face"></FormControlLabel>
                    </FormGroup>
                  </FormControl>

                  <FormControl>
                    <FormGroup>
                          <FormControlLabel control={ <Checkbox name="Nausea" onChange={handleSympChange}/>} label="Nausea"></FormControlLabel>
                          <FormControlLabel control={ <Checkbox name="Vomiting" onChange={handleSympChange}/>} label="Vomiting"></FormControlLabel>
                          <FormControlLabel control={ <Checkbox name="Sweating and shaking chills" onChange={handleSympChange}/>} label="Sweating and shaking chills"></FormControlLabel>
                          <FormControlLabel control={ <Checkbox name="Lower than normal temperatures" onChange={handleSympChange}/>} label="Lower than normal temperatures"></FormControlLabel>
                    </FormGroup>
                  </FormControl>
                <br></br>
                { (statusValue !== "=")
                  ?<div>
                  <Typography variant="h6" align="center">Please indicate if you have left the house today and/or are planning to expose yourself to a public area:</Typography>
                  <RadioGroup name="risk" value={riskValue} onChange={handleRiskChange}>
                    <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes, I am planning to leave the house today" />
                    <FormControlLabel value="No" control={<Radio color="primary" />} label="No, I am planning to stay home" />
                  </RadioGroup>
                  </div>
                  : <div></div>
                }

            </div>
        )
      }else if(statusValue === "-" && props.step === 1){
        return(
        <>
            <Typography variant="h6" align="center">Please indicate if you have left the house today and/or are planning to expose yourself to a public area</Typography>
            <RadioGroup name="risk" value={riskValue} onChange={handleRiskChange}>
              <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes, I am planning to leave the house today" />
              <FormControlLabel value="No" control={<Radio color="primary" />} label="No, I am planning to stay home" />
            </RadioGroup>
        </>
        )
      }
      else if (props.step === 0) {
        return(
            <>
                <Typography variant="h6" align="center">Please select a status that best suites you</Typography>
                <RadioGroup name="status" value={statusValue} onChange={handleStatusChange}>
                <FormControlLabel value="+" control={<Radio color="primary" />} label="Positive" />
                <FormControlLabel value="s" control={<Radio color="primary"/>} label="Symptomatic" />
                <FormControlLabel value="-" control={<Radio color="primary"/>} label="Negative" />
                <FormControlLabel value="=" control={<Radio color="primary"/>} label="Recovered" />
                </RadioGroup>
            </>
        )
      }else{
        return(
          <>
              <Typography variant="h6" align="center">Please type the first 3 digits of your postal code (where you reside)</Typography>
              {/* <GoogleMaps response={props.response}></GoogleMaps> */}
              <TextField 
              onChange={handleLocationChange}>
            </TextField>
          </>
        ) 
      }
  }

  return (
    <FormControl style={{padding: '24px'}} component="fieldset">
        {conditionalRender()}
    </FormControl>
  );
}

export default Form;
