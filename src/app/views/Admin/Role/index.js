import React, { Component } from 'react'
import { connect } from "react-redux";
import _, { sortBy } from 'lodash';

import { getUsers, GetRoleAction, UpdateRoleAction, getRolePermissions } from "../../../store/actions";
import './style.scss';
import Portal from "../../../components/portal/Portal";
import AddRoleView from "./add-role";
import SetPermissionView from './set-permission';



class RoleView extends Component {
  state = {
    loading: false,
    rowData: "",
    isShow: false,
    showSetPermission: false,
    title: "Add Role",
    roleList: [],
    idx: null,
    isUpdate: false,
    message: {}
  };

  async componentDidMount() {
    await this.getRolesAndPermissions();
  };

  async componentDidUpdate(prev, prevState) {
    if ((prevState.roleList.length && (prevState.roleList.length !== this.props.role_List.length)) || this.state.isUpdate) {
      await this.getRolesAndPermissions();
    };
  }

  getRolesAndPermissions = async () => {
    let user = this.props.USER;
    await this.props.GetRoleAction(user.company);
    let roleList = await Promise.all(this.props.role_List.map(async role => {
      await this.props.getRolePermissions(role._id);
      role.permissionList = this.props.GET_ROLE_PERMISSIONS;
      return role;
    }));
    roleList = sortBy(roleList, "role")
    this.setState({ roleList, isUpdate: false })
  }

  openPopup = (event) => {
    this.setState({
      title: "Add Role",
      rowData: null,
      showRolePopup: true,
      showSetPermission: false
    });
  };

  setPermission = (el, event) => {
    event.stopPropagation();
    this.setState({
      rowData: el,
      showSetPermission: true,
    });
  }

  closePermissionView = () => {
    this.setState({
      showSetPermission: false
    });
  }

  toggleClose = () => {
    this.setState({
      showRolePopup: false
    });
  };

  editRole = (el, index) => {
    this.setState({
      title: "Edit Role",
      rowData: el,
      idx: index,
      showSetPermission: false,
      showRolePopup: true
    });
  };

  editUpdate(isUpdate) {
    this.setState({
      isUpdate: isUpdate
    });
  };


  render() {
    return (

      <>
        <div className="table-header d-flex align-items-center justify-content-between">
          <h4 className="heading_h4"> Role </h4>
        </div>

        <div className="shadow_white_box full-box mt-0">
          <div className="d-flex">
            <div className="role_left">
              <div className="top_role_content">
                <p>People can have access with full control or partial control. Everyone who works on your company
                  can have a different role depending on what they need to work on.</p>
              </div>

              <div className="role_list">

                {this.state.roleList.map((el, i) => (
                  <div className="role_inner_list d-flex align-items-center justify-content-between" onClick={this.closePermissionView} key={el._id}>
                    <div className="role_name">
                      <h3>{el.role}</h3>
                      <p>{el.roleDescription}</p>
                    </div>
                    <div className="role_edit" onClick={() => this.editRole(el, i)}>
                      <p>Edit</p>
                    </div>
                    <div className="role_set_permission" onClick={(event) => this.setPermission(el, event)} >
                      <p className="clr_blu">Set Permission</p>
                    </div>
                  </div>

                ))}


              </div>

              <div className="add_more_role" onClick={() => this.openPopup()}>
                <p className="clr_blu">+ Add new role</p>
              </div>

            </div>
            {
              this.state.showSetPermission && (<SetPermissionView rowData={this.state.rowData} action={this.props} editUpdate={(e) => this.editUpdate(e)}></SetPermissionView>)
            }

          </div>
          {this.state.showRolePopup && (
            <Portal
              zIndex="101"
              height="380px"
              width="380px"
              close={this.toggleClose}
              title={this.state.title} >
              <AddRoleView
                roleItem={this.state.rowData}
                close={this.toggleClose}
                action={this.props}
                editUpdate={(e) => this.editUpdate(e)}
              ></AddRoleView>
            </Portal>
          )}
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS, role_List, PERMISSIONS }) => {
  const { GET_ROLE_PERMISSIONS } = PERMISSIONS;
  return { USER, GET_USERS, role_List, GET_ROLE_PERMISSIONS };
};
export default connect(mapStateToProps, { getUsers, GetRoleAction, UpdateRoleAction, getRolePermissions })(RoleView);