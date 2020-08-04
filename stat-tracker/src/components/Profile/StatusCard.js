import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import useMediaQuery from "@material-ui/core/useMediaQuery";



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100px',
    margin: '20px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    width: '100%'
  },
  "+": {
    width: 20,
    background: 'red',
  },
  "s":{
    width: 20,
    background: 'yellow',
  },
  "-":{
    width: 20,
    background: 'green',
  },
  
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  container:{
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end'
  },
  icon:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
  }

}));

export default function MediaControlCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const mobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
  
  function colorStrip () {
      return <div className={classes[props.color]}></div>
  }


  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5" color="textSecondary">
            {props.title}
          </Typography>
        </CardContent>
      </div>
      <div className={classes.icon}>
      <CardContent className={classes.content}>
      <Typography variant={"h4"}>
            {props.data}
      </Typography>      
      <Typography component="h" variant="button" color="textSecondary" align="right">
            {props.sub}
      </Typography>
      </CardContent>
          </div>
      <div className={classes.container}>
      {colorStrip()}
      </div>
    </Card>
  );
}