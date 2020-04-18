import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import GoogleMaps from './GoogleMaps';


function Form(props) {

  const [statusValue, setStatusValue] = React.useState("");
  const [sympValue, setSympValue] = React.useState({});
  const formResponses = [];

  console.log(sympValue);

  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
  };

  const handleSympChange = (event) => {
    setSympValue({...sympValue, [event.target.name]: event.target.checked });
  };

  function conditionalRender() {
      if(statusValue=== "+" && props.step === 1 || statusValue === "s" && props.step === 1){
        return(
            <>
                <Typography variant="h5" align="center">Please choose at least one of the following symptoms from the below list:</Typography>
                <FormControlLabel control={ <Checkbox name="Cough" onChange={handleSympChange}/>}  label="Cough"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Fever" onChange={handleSympChange}onChange={handleSympChange}/>} label="Fever"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Shortness of breath" onChange={handleSympChange}/>} label="Shortness of breath"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Fatigue or tiredness" onChange={handleSympChange}/>} label="Fatigue or tiredness"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Loss of smell or taste" onChange={handleSympChange}/>} label="Loss sense of smell or taste"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Trouble breathing" onChange={handleSympChange}/>} label="Trouble breathing"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Persistent pain or pressure in the chest" onChange={handleSympChange}/>} label="Persistent pain or pressure in the chest"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Confusion" onChange={handleSympChange}/>} label="Confusion"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Bluish lips or face" onChange={handleSympChange}/>} label="Bluish lips or face"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Nausea" onChange={handleSympChange}/>} label="Nausea"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Vomiting" onChange={handleSympChange}/>} label="Vomiting"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Sweating and shaking chills" onChange={handleSympChange}/>} label="Sweating and shaking chills"></FormControlLabel>
                <FormControlLabel control={ <Checkbox name="Lower than normal temperatures" onChange={handleSympChange}/>} label="Lower than normal temperatures"></FormControlLabel>
            </>
        )
      }else if(statusValue === "-" && props.step === 1){
        return(
        <>
            <Typography variant="h5" align="center">You are negative</Typography>
            <Checkbox name="checkedB"color="primary"/>
        </>
        )
      }
      else if (props.step === 0) {
        return(
            <>
                <Typography variant="h5" align="center">Please select a status that best suites you</Typography>
                <RadioGroup name="gender1" value={statusValue} onChange={handleStatusChange}>
                <FormControlLabel value="+" control={<Radio color="primary" />} label="Positive" />
                <FormControlLabel value="s" control={<Radio color="primary"/>} label="Symptomatic" />
                <FormControlLabel value="-" control={<Radio color="primary"/>} label="Negative" />
                </RadioGroup>
            </>
        )
      }else{
        return(
          <>
              <GoogleMaps></GoogleMaps>
          </>
        ) 
      }
  }

  return (
    <FormControl component="fieldset">
        {conditionalRender()}
    </FormControl>
  );
}

export default Form;
