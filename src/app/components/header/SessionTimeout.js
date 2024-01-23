import React, { useRef, useState } from "react";
import IdleTimer from "react-idle-timer";
import SessionTimeoutDialog from "./SessionTimeoutDialog";
import { logout } from "../../store/actions/User";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
let countdownInterval;
let timeout;
let timerReadyToStart = false;
let tabFocused = true;
const onTabFocus = () => {
  tabFocused = true
};
const onTabBlur = () => {
  tabFocused = false
};
window.addEventListener('focus', onTabFocus);
window.addEventListener('blur', onTabBlur);

const SessionTimeout = (props) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);
  const idleTimer = useRef(null);
  let history = useHistory();
  const clearSessionTimeout = () => {
    clearTimeout(timeout);
  };
  const clearSessionInterval = () => {
    clearInterval(countdownInterval);
  };

  const handleLogout = async (isTimedOut = false) => {
    try {
      setTimeoutModalOpen(false);
      clearSessionInterval();
      clearSessionTimeout();
      props.logout();
      if (props.USER.role === 'Admin') {
        history.replace('/admin/login')
      } else {
        history.replace('/login')
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleContinue = () => {
    timerReadyToStart = false;
    setTimeoutModalOpen(false);
    clearSessionInterval();
    clearSessionTimeout();
  };

  const onActive = () => {
    if (!timeoutModalOpen) {
      clearSessionInterval();
      clearSessionTimeout();
    }
  };

  const onIdle = () => {
    const delay = 1000 * 1;
    if (!timeoutModalOpen) {
      timeout = setTimeout(() => {
        let countDown = 15;
        setTimeoutModalOpen(true);
        setTimeoutCountdown(countDown);
        countdownInterval = setInterval(() => {
          if (countDown > 0) {
            if (timerReadyToStart || tabFocused) {
              timerReadyToStart = true
              setTimeoutCountdown(--countDown);
            }
            else {
              setTimeout(() => {
                handleLogout(true);
              }, 300000);
            }
          } else {
            handleLogout(true);
          }
        }, 1000);
      }, delay);
    }
  };
  return (
    <>
      <IdleTimer
        ref={idleTimer}
        onActive={onActive}
        onIdle={onIdle}
        debounce={250}
        timeout={3e+6}
      />
      <SessionTimeoutDialog
        countdown={timeoutCountdown}
        onContinue={handleContinue}
        onLogout={() => handleLogout(false)}
        open={timeoutModalOpen}
      />
    </>
  );
}



const mapStateToProps = (state) => ({ USER: state.USER });
const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    logout
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(SessionTimeout)
