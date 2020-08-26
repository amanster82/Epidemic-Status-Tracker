import React, {useEffect} from "react";
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
    },

    input:{
      textTransform: 'uppercase',
      textAlign: 'center'
    },

    input2:{
      textAlign: 'center'
    },

    description: {
      marginLeft: '30px'
    },

    status:{
      fontWeight: 'bold !important'
    }
  
  
  }));


  const [statusValue, setStatusValue] = React.useState("");
  const [riskValue, setRiskValue] = React.useState("");
  const [sympValue, setSympValue] = React.useState({});
  const [postalCodeValue, setpostalCodeValue] = React.useState("");
  const [sympYesorNo, setSympYesorNo] =  React.useState("");
  const classes = useStyles();
  
  useEffect(() => {
   clearValuesWhenBack(); 
  });
  

  function clearValuesWhenBack(){
    if(props.step===0 && props.Ipressed==="Back"){
      setStatusValue("");
      setSympYesorNo("");
      setSympValue("");
      setRiskValue("");
      setpostalCodeValue("");
      props.setButton("Next");
    }else if(props.step===1 && props.Ipressed==="Back"){
      setSympYesorNo("");
      setSympValue("");
      setRiskValue("");
      setpostalCodeValue("");
      props.setButton("Next");
    }else if(props.step===2 && props.Ipressed==="Back"){
      setpostalCodeValue("");
      props.setButton("Next");
    }

  }

  console.log(sympValue);
  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
    props.response(event.target.value);
  };

  const handleSympYesOrNoChange = (e) => {
    setSympYesorNo(e.target.value); 
    console.log("Yes or No" + e.target.value)

    if(e.target.value === "No" && e.target.value !== ""){
      setSympValue({});
      props.response(false);
    }else{
      props.response(false);
    }
  }

  const handleRiskChange = (event) => {
    setRiskValue(event.target.value);
    console.log("are there symp??? " + !(Object.keys(sympValue).length === 0));
    console.log("if yes, what are the symps?", sympValue);
    if(
    //  statusValue === "+" && !(Object.keys(sympValue).length === 0 && sympValue.constructor === Object) || 
    //  statusValue === "s" && !(Object.keys(sympValue).length === 0 && sympValue.constructor === Object) ||
      statusValue === "+" && sympYesorNo === "No" && event.target.value !== "" || 
      statusValue === "+" && sympYesorNo === "Yes" && event.target.value !== "" && !(Object.keys(sympValue).length === 0) ||
      statusValue === "s" && sympYesorNo === "No" && event.target.value !== "" || 
      statusValue === "s" && sympYesorNo === "Yes" && event.target.value !== "" && !(Object.keys(sympValue).length === 0)
    ){
      props.response(true);
    }else if( statusValue === "=" || statusValue === "-"){
      props.response(event.target.value);
    }

  };


  const handleSympChange = (event) => {
    let obj = {...sympValue, [event.target.name]: event.target.checked }
    obj = Object.entries(obj).filter(([,v]) => v === true).reduce((prev, [k, v]) => ({...prev, [k]: v}), {})
    setSympValue(obj);
    console.log("this is the obj", obj);
    let showNext;
    showNext = !(Object.keys(obj).length === 0 && obj.constructor === Object) && riskValue !== "" && sympValue !==
    

    console.log("showNext", showNext)

    let specialCase = !(Object.keys(obj).length === 0 && obj.constructor === Object)

    if(statusValue === "=") {
      props.response(specialCase);
    }else{
      props.response(showNext);
    }
  
  };


  const handleLocationChange = (event) => {
    let regEx = /^[a-zA-Z][0-9][a-zA-Z]$/;
    if(regEx.test(event.target.value) ){
      setpostalCodeValue(event.target.value);
      const formResponses = [{
        status: statusValue,
        symptoms: Object.entries(sympValue).filter(([,v]) => v === true).reduce((prev, [k, v]) => ({...prev, [k]: v}), {}),
        risk: (riskValue=='Yes' ? true: false),
        postal: event.target.value
      }]
      props.response(formResponses);
    }else{
      console.log("error");
      props.response(false);
    }
  };


  const handleCodeChange = (event) => {
    const formResponses = [{
      status: statusValue,
      symptoms: Object.entries(sympValue).filter(([,v]) => v === true).reduce((prev, [k, v]) => ({...prev, [k]: v}), {}),
      risk: (riskValue=='Yes' ? true: false),
      postal: postalCodeValue,
      code: event.target.value
    }]
    props.response(formResponses);
  }

  function conditionalRender() {
      if(statusValue=== "+" && props.step === 1 || statusValue === "=" && props.step === 1 || statusValue=== "s" && props.step === 1){
        return ( 
              <div >
                {(statusValue === "=")
                ?<Typography variant="h6" align="center">Did you have any symptoms?</Typography>
                :<Typography variant="h6" align="center">Do you have any symptoms?</Typography>}
                
                <RadioGroup value={sympYesorNo} onChange={handleSympYesOrNoChange}>
                  <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio color="primary" />} label="No" />
                </RadioGroup>
              { 
                  (sympYesorNo !== "") ?
                    (sympYesorNo === "Yes") ?
                  <>
                  
                  { (statusValue === "=")
                      ? <Typography variant="h6" align="center">What symptoms did you encounter during your duration with COVID-19? (Please choose from below)</Typography>
                      : <Typography variant="h6" align="center">Please choose at least one of the following symptoms from the below list:</Typography>
                  }

                   <FormControl>
                   <FormGroup>
                       <FormControlLabel control={ <Checkbox name="Cough" color="primary" onChange={handleSympChange}/>}  label="Cough"></FormControlLabel>
                       <FormControlLabel control={ <Checkbox name="Fever" color="primary" onChange={handleSympChange}onChange={handleSympChange}/>} label="Fever"></FormControlLabel>
                       <FormControlLabel control={ <Checkbox name="Shortness of breath" color="primary" onChange={handleSympChange}/>} label="Shortness of breath"></FormControlLabel>
                   </FormGroup>
                 </FormControl>

                 <FormControl>
                   <FormGroup>
                   <FormControlLabel control={ <Checkbox name="Fatigue or tiredness" color="primary" onChange={handleSympChange}/>} label="Fatigue or tiredness"></FormControlLabel>
                     <FormControlLabel control={ <Checkbox name="Loss of smell or taste" color="primary" onChange={handleSympChange}/>} label="Loss sense of smell or taste"></FormControlLabel>
                     <FormControlLabel control={ <Checkbox name="Trouble breathing" color="primary" onChange={handleSympChange}/>} label="Trouble breathing"></FormControlLabel>
                   </FormGroup>
                 </FormControl>

                 <FormControl>
                   <FormGroup>
                     <FormControlLabel control={ <Checkbox name="Persistent pain or pressure in the chest" color="primary" onChange={handleSympChange}/>} label="Persistent pain or pressure in the chest"></FormControlLabel>
                     <FormControlLabel control={ <Checkbox name="Confusion" color="primary" onChange={handleSympChange}/>} label="Confusion"></FormControlLabel>
                     <FormControlLabel control={ <Checkbox name="Bluish lips or face" color="primary" onChange={handleSympChange}/>} label="Bluish lips or face"></FormControlLabel>
                   </FormGroup>
                 </FormControl>

                 <FormControl>
                   <FormGroup>
                         <FormControlLabel control={ <Checkbox name="Nausea" color="primary" onChange={handleSympChange}/>} label="Nausea"></FormControlLabel>
                         <FormControlLabel control={ <Checkbox name="Vomiting" color="primary" onChange={handleSympChange}/>} label="Vomiting"></FormControlLabel>
                         <FormControlLabel control={ <Checkbox name="Sweating and shaking chills" color="primary" onChange={handleSympChange}/>} label="Sweating and shaking chills"></FormControlLabel>
                         <FormControlLabel control={ <Checkbox name="Lower than normal temperatures" color="primary" onChange={handleSympChange}/>} label="Lower than normal temperatures"></FormControlLabel>
                   </FormGroup>
                 </FormControl>
                
                  <Typography variant="h6" align="center">Please indicate if you have left the house today and/or are planning to expose yourself to a public area:</Typography>
                  <RadioGroup name="risk" value={riskValue} onChange={handleRiskChange}>
                    <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes, I am planning to leave the house today" />
                    <FormControlLabel value="No" control={<Radio color="primary" />} label="No, I am planning to stay home" />
                  </RadioGroup>
                 </>
                
                : 
                  <>
                  <Typography variant="h6" align="center">Please indicate if you have left the house today and/or are planning to expose yourself to a public area:</Typography>
                  <RadioGroup name="risk" value={riskValue} onChange={handleRiskChange}>
                    <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes, I am planning to leave the house today" />
                    <FormControlLabel value="No" control={<Radio color="primary" />} label="No, I am planning to stay home" />
                  </RadioGroup>
                </>
                
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
                <Typography style={{ fontStyle: 'italic'}} variant="subtitle1" align="center">*Note: read the description carefully before making a selection!</Typography>
                <RadioGroup name="status" value={statusValue} onChange={handleStatusChange}>
                <FormControlLabel value="+" control={<Radio color="primary" />} label="Positive" className={classes.status}/>
                <div className={classes.description}>I have been tested, and I am currently confirmed positive</div>
                <br></br>
                <br></br>
                <br></br>
                <FormControlLabel value="s" control={<Radio color="primary"/>} label="Possible" />
                <div className={classes.description}>One or more of the below apply to me:</div>
                <ul className={classes.description}>
                <li>I have familiarized myself with viral symptoms and I think I am showing possible signs.</li>
                <li>I have been traveling, and I am currently self-isolating.</li>
                <li>I have been exposed to a confirmed COVID-19 case and I am currently self-isolating.</li>
                </ul>
                <br></br>
                <br></br> 
                <FormControlLabel value="-" control={<Radio color="primary"/>} label="Negative" />
                <div className={classes.description}>One or more of the below apply to me:</div>
                <ul className={classes.description}>
                <li>I have been tested and I am currently negative.</li>
                <li>I have not been tested, but I am confident I am COVID-19 free.</li>
                </ul>
                <br></br>
                <br></br>
                <FormControlLabel value="=" control={<Radio color="primary"/>} label="Recovered" />
                <div className={classes.description}>I tested positive for COVID-19, and I now test negative for COVID-19</div>
                <br></br>
                <br></br>                </RadioGroup>
            </>
        )
      }else if(props.step === 2){
        return(
          <>
              <Typography variant="h6" align="center">Please enter the first three letters of your postal code</Typography>
              {/* <GoogleMaps response={props.response}></GoogleMaps> */}
              <Grid container alignItems='center' justify="center">
                <Grid item xs={3}>
                <TextField 
              variant="outlined"
              onChange={handleLocationChange}
              inputProps={{
                maxLength: 3,
                className: classes.input
              }}
              >
            </TextField>
                </Grid>
            </Grid>
          </>
        ) 
      }else{
        return(
          <div className="animated zoomInUp">
              <Typography variant="h6" align="center">{'A code has been sent to ' + props.user_email}</Typography>
              <Typography variant="h6" align="center">Please enter the code below</Typography>
              {/* <GoogleMaps response={props.response}></GoogleMaps> */}
              <Grid container alignItems='center' justify="center">
                <Grid item xs={6}>
                <TextField 
              variant="outlined"
              onChange={handleCodeChange}
              inputProps={{
                maxLength: 6,
                className: classes.input2
              }}
              error={!props.codeCorrect && props.codeCorrect !== null && props.codeCorrect !== ""}
              label={(!props.codeCorrect && props.codeCorrect !== null) ? "Code incorrect" : ""}
              >
                </TextField>
              </Grid>
            </Grid>
          </div>
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
