import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  makeStyles,
  Slide
} from "@material-ui/core";
import clsx from "clsx";
import red from "@material-ui/core/colors/red";

const useStyles = makeStyles(() => ({
  dialog: {
    borderRadius: 5,
    padding:10
  },
  button: {
    borderRadius: 0,
    textTransform: "none",
    padding: 5
  },
  logout: {
    color: "#fff",
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  countdown: {
    color: red[700]
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SessionTimeoutDialog = ({  open, countdown, onLogout,onContinue }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.dialog }}
      TransitionComponent={Transition}
    >
     <h2 className="session_title">Session Timeout</h2> 
      <DialogContent>
        <Typography variant="body2">
          The current session is about to expire in{" "}
          {countdown} seconds.
        </Typography>
        <Typography variant="body2">{`Would you like to continue the session?`}</Typography>
      </DialogContent>
      <DialogActions >
        <button className="session_btn_logout"  onClick={onLogout}><span> Logout</span></button>
        <button className="session_btn_continue"  onClick={onContinue}><span> Continue Session</span></button>
      </DialogActions>
    </Dialog>
  );
}
export default SessionTimeoutDialog;