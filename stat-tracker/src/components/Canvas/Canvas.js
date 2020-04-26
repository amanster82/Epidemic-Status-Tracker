import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from './Card';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

function Canvas(props) {

    const classes = useStyles();

    function FormRow() {
        return (
        <React.Fragment>
            <Grid item xs={3}>
            <Card status="Positive" number="8" ></Card>
            </Grid>
            
            <Grid item xs={3}>
            <Card status="Possible" number="7"></Card>
            </Grid>
            
            <Grid item xs={3}>
            <Card status="Negative" number="6"></Card>
            </Grid>

            <Grid item xs={3}>
            <Card status="Recovered" number="5"></Card>
            </Grid>
        </React.Fragment>
        );
    }


    return (
        <div> 
            <Grid item xs={6}>
                <h1>{props.location}</h1>
            </Grid>
            <Grid item xs={6}>
                <h1>Welcome!</h1>
            </Grid>
            <Grid container spacing={1}>
            <Grid container item xs={12} spacing={3}>
            <FormRow />
            </Grid>
            </Grid>

        </div>
    );
}

export default Canvas;