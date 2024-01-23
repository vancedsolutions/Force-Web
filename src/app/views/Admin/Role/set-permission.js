import React, { Component } from 'react'
import { connect } from "react-redux";
import './style.scss';
import PermissionJSONList from '../../../assets/data/permissionList.json';
import Switch from '../../../components/ui/switch/Switch';
import { getRolePermissions, savePermissions } from "../../../store/actions";
import { groupBy, flatMap, difference } from "lodash";

class SetPermissionView extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    permissionList: [],
    permissionGrouped: {},
    changes: []
  }

  handleChange = (key, value, group, idx) => {
    let permissionGrouped = { ...this.state.permissionGrouped }
    let permissionObject = permissionGrouped[group][idx];
    permissionObject.isActive = value;
    this.monitorChanges(key);
    this.setState({
      permissionGrouped,
    });
  };
  monitorChanges = key => {
    let changes = this.state.changes;
    if (changes.includes(key)) {
      changes.splice(changes.indexOf(key), 1);
    }
    else changes.push(key);
    this.setState({ changes });
  };

  componentDidMount() {
    this.setPermissionView();
  };


  componentDidUpdate(prev, prevState) {
    if (prev.rowData.role !== this.props.rowData.role) {
      this.setPermissionView();
    };
  };

  setPermissionView() {
    let permissionList = PermissionJSONList.filter(p => p.portal === 'Admin').map(pl => {
      let isActive = !!this.props.rowData.permissionList.find(r => r.key === pl.key && r.isActive);
      return { ...pl, isActive };
    });
    let permissionGrouped = groupBy(permissionList, "groupLabel");
    this.setState({
      permissionList,
      permissionGrouped,
    });
  }


  saveUpdate = async () => {
    let updatedPermissions = this.state.permissionList.map(p => {
      let { key, isActive } = p;
      let { companyDetails } = this.props.USER;
      let permission = { key, isActive, company: companyDetails._id, role: this.props.rowData._id };
      return permission;
    });
    await this.props.savePermissions(updatedPermissions);
    this.setState({ changes: [] });
    await this.props.GET_ROLE_PERMISSIONS;
    this.props.editUpdate(true);
  };

  render() {
    const { permissionGrouped } = this.state;
    return (
      <>
        <div className="role_popup">
          <div className="header_role_popup d-flex align-items-center justify-content-between">
            <div className="role_title">
              <h4>{this.props.rowData.role}</h4>
            </div>
            <div className="role_button">
              <button className="btn role_save_btn" onClick={this.saveUpdate} disabled={!this.state.changes.length}>Save</button>
            </div>
          </div>
          <div className="header_role_popup">

            {permissionGrouped && (Object.keys(permissionGrouped).map((group) => (
              <div>
                <div className="role_popup_title">
                  <h5>{group}</h5>
                </div>

                {permissionGrouped[group].map((perm, i) => (
                  <div className="header_role_list d-flex align-items-center justify-content-between">
                    <div className="role_switch_title">
                      <h3>{perm.label}</h3>
                    </div>
                    <div className="role_switch_btn">
                      <Switch
                        switchAction={(key, val) => this.handleChange(key, val, group, i)}
                        id={perm.key}
                        value={perm.isActive}
                      ></Switch>
                    </div>
                  </div>))}
              </div>
            )))}
          </div>
        </div>
      </>)
  }
}
const mapStateToProps = ({ USER, PERMISSIONS }) => {
  const { GET_ROLE_PERMISSIONS, SAVE_PERMISSIONS } = PERMISSIONS;
  return { USER, GET_ROLE_PERMISSIONS, SAVE_PERMISSIONS };
};
export default connect(mapStateToProps, { getRolePermissions, savePermissions })(SetPermissionView);