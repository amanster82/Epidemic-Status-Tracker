import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DotIcon from "@material-ui/icons/FiberManualRecord";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    marginBottom: 25,
  },
  media: {
    height: 140,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function CaseCard(props) {
  const classes = useStyles();

  async function test() {
    console.log("hey");
    let coordinates = await axios.get(
      "http://geogratis.gc.ca/services/geolocation/en/locate?q=v7n"
    );
    console.log("coordinates:", coordinates);
  }

  return (
    <Card className={classes.root} onClick={() => test()}>
      <CardActionArea>
        <CardContent className={classes.center}>
          <DotIcon style={{color: props.color}} />
          <div style={{width: '5%'}}></div>
          <Typography
            variant="h5"
            component="h2"
            style={{ marginRight: "25px" }}
          >
            {props.status}
          </Typography>

          <Typography variant="h5" component="h2">
            {props.number}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
