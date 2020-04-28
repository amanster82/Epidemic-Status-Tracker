import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    marginBottom: 25
  },
  media: {
    height: 140,
  },
  center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  }

});

export default function MediaCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent className={classes.center}>
          <Typography variant="h5" component="h2" style={{marginRight: '25px'}}>
            {props.status} Cases
          </Typography>
          
          <Typography variant="h5" component="h2">
            {props.number}          
        </Typography>
          
        </CardContent>
      </CardActionArea>
    </Card>
  );
}