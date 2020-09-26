import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import {
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {props.name}
      </Button>
      <Dialog
        fullScreen
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Inventor Story
        </DialogTitle>
        <DialogContent dividers>
          <div style={{marginLeft:'20%', width:'60%'}}>
            <h3>The Beginning</h3>
            <div>
              On March 24 2020, Facebook, Microsoft and a several other tech
              companies released a five day hackathon that promoted the
              development of software for COVID-19. The world did not know what
              to do in this dire unprecedented situation and were challenging
              anyone to figure out a solution.
            </div>
            <br></br>
            <div>
              Always up for a challenge, I called a few friends of mine, asking
              if they would be interested in pursing the hackathon, but no one
              was interested. Everyone on my contact list was extremely busy
              with their jobs, and by the time they finished work, they were so
              burnt out that they did not want to pursue an additional tech
              project during their spare time.
            </div>
            <br></br>
            <div>
              At the time, I had just started a new job at a tech company
              myself, and I did not blame them for not having the time. It is
              tough working a job during the day, and then trying to push
              yourself to work on a project that should be relatively complete
              within five days at night. As a result,{" "}
              <strong>I did not enroll</strong> in the hackathon, but that did
              not stop my inspiration.
            </div>
            <h3>The Idea</h3>
            <div>
              Ultimately, I concluded that I would not join the hackathon, but
              that I would start my own project, to make some sort of difference
              in the world. As a result, I ended up taking on this project over
              a period of months. Instead of five days. The only thing left was,
              the idea.
            </div>
            <br></br>
            <div>
              I had been pondering on what I could do to help impact COVID-19,
              and I felt like the answer was right in my face. To tackle a
              problem, you have to “find” the problem… and BOOM, there you have
              it, an self-reporting application that allows users to
              geographically, yet anonymously plot where COVID-19 is.
            </div>
            <h3>The solution</h3>
            <div>
              I had never built an entire application from scratch myself. I was
              always working on a team or had help with architectural decisions,
              so this was a unique opportunity to do something exclusively
              myself. The result: wherescovid.ca.
            </div>
            <b></b>
            <br></br>
            <h3>Bio</h3>
            <div>
              My name’s Aman Bhayani. I am a software developer and computer
              scientist. I love coming up with solutions to tough problems.
              Recently I lost my job due to COVID-19 related reasons and am
              actively seeking employment opportunities. If you like what you
              see and would like to learn more about me, visit my website at:
              amanbhayani.me
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
