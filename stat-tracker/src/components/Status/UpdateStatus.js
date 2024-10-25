import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Report from '../../Report';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);




export default function CustomizedDialogs(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    props.analytics(true);
  };

  return (
    <div>
      <Button size="small" variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.name}
      </Button>
      <Dialog fullScreen onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}  fullWidth={true} maxWidth={'lg'}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {props.name}
        </DialogTitle>
        <DialogContent dividers>
          <Report submit={(x) => props.submit(x)} setSpinner={(x) => props.setSpinner(x)} exit={ handleClose }></Report>
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
