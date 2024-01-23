import React, { Component } from 'react';
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ClientsPermissionsView from './Clients-permissions';
import ReportSettingsView from './Report-settings';
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import SettingSetupView from './Settings/conversion-setup';
import { getCompanyPermissions, getPermissions, getEarningsCodes, syncCompanyData, refreshUserAction } from "../../../../store/actions";
import ToolTipButton from "../../../../components/ui/inputs/tool-tip-button"

class RightSidebarView extends Component {

  constructor() {
    super();
  }
  state = {
    loading: false,
    toolTipMessage: `<p>Sync Earning code</p>
    <p>Sync Cost Center</p>
    <p>Sync Payroll</p>
    <p>Sync EINs</p>`
  }
  async componentDidMount() {
    this.setState({ loading: true })
    const { _id, companyShortName } = this.props.EDIT_CLIENT_DATA;
    await this.props.getEarningsCodes(_id, companyShortName);
    this.setState({ loading: false })
  }

  login = ($e) => {
    $e.preventDefault();

    const { role, company, permissions, compSystemId } = this.props.USER;
    let { _id, companyId, companyName, companyShortName } = this.props.EDIT_CLIENT_DATA;

    this.setState({ loading: true });
    this.props.USER.LOGIN_AS = true;
    this.props.USER.prevRole = role;
    this.props.USER.role = 'Client';
    this.props.USER.prevCompany = company;
    this.props.USER.company = companyShortName;
    this.props.USER.companyId = _id;
    this.props.USER.compSystemId = companyId;
    this.props.USER.companyName = companyName;
    this.props.USER.prevPermissions = permissions;
    this.props.USER.permissions = this.props.GET_PERMISSIONS;
    localStorage.setItem('USER', JSON.stringify(this.props.USER));
    this.props.refreshUserAction();
    this.props['isLocation'].push(`/`);
  }

  isRolePermission(key) {
    return this.props.USER.permissions.find(p => p.key === key);
  }

  syncAll = async () => {
    this.setState({
      loading: true
    })
    const { companyShortName } = this.props.EDIT_CLIENT_DATA
    await this.props.syncCompanyData(companyShortName);

    this.setState({
      loading: false
    })
  }


  render() {
    let { loading } = this.state;
    return (
      <div className="rightSidebar">
        <div className="top_header_popup d-flex align-items-center justify-content-between">
          {this.props.isSelectedRowData?.companyName}
          <div className="iconRight" onClick={this.props.closeSidebar}>
            <img src={iconRight} alt="" ></img>
          </div>
        </div>

        <div className="overlay-pop" onClick={this.props.closeSidebar}></div>
        <Tabs>
          <div className="tabNav d-flex align-items-center justify-content-between">
            {this.isRolePermission("EDIT_SETTING_OR_PERMISSION") && (<TabList>
              <Tab>Products</Tab>
              <Tab>Settings</Tab>
              <Tab>Report Settings</Tab>
            </TabList>)}
            {this.isRolePermission("LOGIN_SA") && (
              <div className="iconRight">
                <button className="btn reportBtn" onClick={this.login} disabled={this.state.loading}>Login as SA</button>
              </div>
            )}
          </div>
          <div className="tabContent">
            <TabPanel>
              <ClientsPermissionsView></ClientsPermissionsView>
            </TabPanel>
            <TabPanel>
              <SettingSetupView settingsTab={this.props}></SettingSetupView>
            </TabPanel>
            <TabPanel>
              <ReportSettingsView reportSettingsTab={this.props}></ReportSettingsView>
            </TabPanel>

            <div className="footer">

              <div className="df align-items-end justify-content-between flex-row-reverse mt-4 mb-3">
                {loading ? <span className="btn">Loading data.... </span> : <span> <ToolTipButton name="Sync All Data" action={this.syncAll} textMessage={this.state.toolTipMessage} disabled={loading}></ToolTipButton></span>}

              </div>
            </div>
          </div>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = ({ USER, EDIT_CLIENT_DATA, PERMISSIONS, savedEarningsCodes }) => {
  const { GET_PERMISSIONS } = PERMISSIONS;
  return { USER, EDIT_CLIENT_DATA, GET_PERMISSIONS, savedEarningsCodes }
};
export default connect(mapStateToProps, { getPermissions, refreshUserAction, getEarningsCodes, syncCompanyData, getCompanyPermissions })(RightSidebarView);
