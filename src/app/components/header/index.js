import './style.scss';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { logout, refreshUserAction } from "../../store/actions";
import logo from '../../assets/images/logo.png'
import adminLogo from '../../assets/images/admin-logo.svg'
import userIcon from '../../assets/images/user-icon.jpg'
import bellIcon from '../../assets/images/bell-icon.png'
import menuCollapse from '../../assets/images/Icon ionic-ios-menu.png'
// ui imports
import { bindActionCreators } from "redux";
import SessionTimeout from './SessionTimeout';
import { editClientData } from '../../store/actions';

const HeaderView = (props) => {

  const adminCompany = props.USER.companyDetails?.companyType === 'Admin';

  const logout = ($e) => {
    props.logout();
    if (adminCompany) {
      props.history.replace('/admin/login')
    } else {
      props.history.replace('/login')
    }
  }
  return (
    <header className="row align-items-center fixed-header">
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex align-items-center">
          <div className="logo_outer">
            {adminCompany ? <img src={adminLogo} alt="" className="logo" /> : <img src={logo} alt="" className="logo" />}
          </div>
          <div className="menuCollapse" onClick={props.clickHeader}>
            <img src={menuCollapse} alt="" className="menuCollapse-icon" />
          </div>
          {(props.USER.LOGIN_AS) && (

            <span className="companyShortName"><b>{props.USER.company}</b> - {props.USER.companyName}</span>
          )}
        </div>
        <div className="d-flex align-items-center">
          <div className="notification-box" >
            <img src={bellIcon} alt="" />
          </div>
          <div className="user-image" >
            <button className="btn logout_btn" onClick={logout}>Log Out</button>
          </div>
        </div>
      </div>
      <SessionTimeout />
    </header>
  );
};
const mapStateToProps = ({ USER, EDIT_CLIENT_DATA }) => ({ USER, EDIT_CLIENT_DATA });
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    logout,
    editClientData,
    refreshUserAction,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(HeaderView)
