import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import './style.scss';
import { AddRoleAction, GetRoleAction } from "../../../store/actions";


export const AddRolePermissionView = (props) => {

  const [userRole, updateUserRole] = useState("");
  const [roleDescription, updateRoleDescription] = useState("");


  useEffect(() => {
    if (props.roleItem) {
      let data = props.roleItem;
      updateUserRole(data.role);
      updateRoleDescription(data.roleDescription);

    }

  }, [])

  const updateRole = async ($e) => {
    $e.preventDefault();
    let payload = {
      id: roleData._id,
      role: userRole,
      roleDescription: roleDescription,
    }
    await props.action.UpdateRoleAction(payload);
    let user = props.USER;

    await props.GetRoleAction(user.company);
    props.editUpdate(true);
    props.close();

  }

  const saveRole = async ($e) => {
    const user = props.USER;
    $e.preventDefault();

    let payload = {
      companyShortCode: user.company,
      role: userRole,
      roleDescription: roleDescription,
    }
    await props.AddRoleAction(payload);
    await props.GetRoleAction(user.company);
    props.editUpdate(false);
    props.close();
  }
  let roleData = props.roleItem;
  return (

    <>
      <div className={`addRole`} >

        <form onSubmit={roleData == null ? saveRole : updateRole}>
          <div className="user-body">
            <div className="userList">
              <div className="userNameLabel">
                <span>Role</span>
              </div>
              <div className="userNameOutput">
                <input type="text" id="txtRole" value={userRole} onChange={(event) => updateUserRole(event.target.value)}></input>
              </div>

            </div>
            <div className="userList">
              <div className="userNameLabel">
                <span>Description</span>
              </div>
              <div className="userNameOutput">
                <textarea type="text" id="txtDescription" value={roleDescription} onChange={(event) => updateRoleDescription(event.target.value)}></textarea>
              </div>

            </div>


          </div>

          <div className="user-footer text-end">
            <button className="mla fs12 primary mini">{props.roleItem == null ? 'Save' : 'Update'}</button>
          </div>
        </form>
      </div>
    </>
  )


}


const mapStateToProps = ({ USER, }) => ({ USER, });
export default connect(mapStateToProps, { AddRoleAction, GetRoleAction })(AddRolePermissionView);