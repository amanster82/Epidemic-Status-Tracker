import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>How does this work?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            A user will create an account and login.
            For the first time, the user will be prompted with a short questionnaire, which they must complete.
            Once completed, the user will be able to see data about COVID-19 cases around their area.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>How is this different than any other COVID-19 App?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Currently, COVID-19 trackers only provide data from tested cases, which are a copy of health records issued by government agencies.
            They do not disclose any information about cases in regions, districts, municipalities, or area codes. 
            This leaves the public unware about where the virus truly is and whether the virus is directly within the bounds of their social circle.
            <b></b>
            This application is different because it uses our own data, to present a clearer picture about COVID-19.
            The application will present a map of COVID cases by postal code, a more pinpointed view, about whether the virus is within ones reach.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Is it safe to use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes. This application is safe to use. We DO NOT sell your information, nor do we ask for it.
            Your account and information is completely anonymous.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>What happens to my data?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Your data will get logged in our database, and remain there indefinitely.
            We do not verify data, and we do not sell your information. Your data is completely anonymous.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Can I use this application in my country?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Currently, this application only services those living in Canada.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
