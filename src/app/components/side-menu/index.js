import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import menuData from "../../assets/data/menu.json";
import PermissionList from "../../assets/data/permissionList.json";
import caretArrow from '../../assets/images/download.png';
import backArrow from '../../assets/images/back_icon.png';
import './style.scss';
import _ from 'lodash';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginAction, editClientData, getPermissions, refreshUserAction } from '../../store/actions';

const SideMenu = (props) => {

  let [navs, setNavs] = useState([]);

  useEffect(() => {
    const { permissions } = props.USER;
    let userPermissions = permissions?.filter(p => p.isActive)?.map(p => p.key);
    let permissionList = PermissionList.filter(p => userPermissions?.includes(p.key));
    let menu = menuData.filter(item => {
      return checkAccess(item, permissionList);
    });
    setNavs([...menu])
  }, [props.USER.permissions, props.USER.LOGIN_AS, props.USER.companyName, props.USER.role]);

  function openCloseNav(e, i) {
    e.stopPropagation();
    e.preventDefault();
    let updateNavs = [...navs];
    updateNavs[i].showSubs = !updateNavs[i].showSubs;
    setNavs(updateNavs);
  }

  function checkAccess(menuItem, permissionList) {
    if (menuItem.openAccess) return true;
    let isKey = permissionList.find(p => p.key === menuItem.key);
    let isGroupKey = permissionList.find(p => p.group === menuItem.key);
    if (isKey) return true;

    if (isGroupKey && menuItem.groupHeader) {
      if (menuItem.subItems) {
        menuItem.subs = menuItem.subItems.filter(sub => checkAccess(sub, permissionList));
        return menuItem.subs.length;
      };
      return true;
    }
    return false
  };

  return (
    <div className={`left-sidebar ${props.className}`} onMouseEnter={props.hoverOn} onMouseLeave={props.hoverOff} >
      {(props.USER.LOGIN_AS) && (
        <>
          <button className="back_btn" onClick={props.backAdmin}>
            <span className="menu-label df">
              <span className="icon-svg">
                <img src={backArrow} alt="" />
              </span>
              <span className="menu-label-text"> Back to admin </span>
            </span>
          </button>
        </>
      )}
      <ul className="list-group">
        {navs?.map((nav, i) => {
          return (
            <span key={i}>
              {!nav.hidden && (
                <li className="list-group-item" key={i}>
                  <div className="nav_wrpr" key={i}>
                    <NavLink
                      exact
                      activeClassName="active"
                      className={`${nav.className}`}
                      to={nav.url}
                    >
                      {nav.subs?.length > 0 ?
                        <span className={`menu-label df  ${nav.showSubs ? "open" : ""} `}
                          onClick={(e) => { openCloseNav(e, i) }} >
                          <span className="icon-svg">
                            <img src={nav.navIcon} alt="" />
                          </span>
                          <span className="menu-label-text"> {nav.label} </span>
                          <div className={`df  expand`}><img stc={caretArrow} alt="" /></div>
                        </span> :
                        <span className={`menu-label df  ${nav.showSubs ? "open" : ""}`}>
                          <span className="icon-svg gg">
                            <img src={nav.navIcon} alt="" />
                          </span>
                          <span className="menu-label-text">  {nav.label} </span>
                        </span>}

                    </NavLink>

                    {nav.showSubs && (

                      <div className="subMenu">

                        {nav.subs.map((sub, idx) => (

                          <span key={idx}>
                            {
                              !sub.hidden && (

                                <NavLink
                                  key={`${i}_${idx}`}
                                  exact
                                  activeClassName="active"
                                  data-itm="home"
                                  className="df fs12 ffmm fwm sub_nav"
                                  to={sub.url}
                                >
                                  <span className="menu-label">  {sub.label} </span>
                                  <div className="mla"></div>
                                </NavLink>
                              )}
                          </span>
                        ))}


                      </div>
                    )}
                  </div>

                </li>

              )}
            </span>
          )
        })}

      </ul>
    </div>
  )
}

const mapStateToProps = ({ USER, getPermissionActive, UserRollPermission, EDIT_CLIENT_DATA }) => ({ USER, getPermissionActive, UserRollPermission, EDIT_CLIENT_DATA });
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    loginAction,
    editClientData,
    getPermissions,
    refreshUserAction
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

