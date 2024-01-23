import './style.scss';
import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import HeaderView from "../../components/header";
import SideMenu from "../../components/side-menu/index";


import { Route } from "react-router-dom";
import WageParityView from "../reports/wage-parity";
import PatientHoursView from "../reports/patient-hours";

import NoPayrollActivityView from "../reports/no-payroll-activity";
import TaxCollectionView from "../file-conversions";
import LocationWage from "../Admin/wage"
import ClientsView from "../Admin/Clients"
import AnnualBillingReportView from '../reports/annual-billing'
import CSRAssignmentsReport from '../reports/csr-assignments';
import AdminLogin from "../login/index-admin"
import ManagementOverview from '../reports/management-overview/managementOverview';
import EmployeeAccruals from "../reports/accruals";
import GridExample from "../reports/accruals/index_copy";

import TeamSupportHistory from "../team-support";
import TabsLatePayrolls from "../reports/tabs-late-payroll/tabs-late-payroll"

import Users from "../Admin/Users"
import TimeInventory from '../time-inventoy'

import EmailSetup from '../email-setup'
import TabsCertifiedPayroll from "../reports/tabs-certified-payroll/tabs-certified-payroll";

import RoleView from '../Admin/Role';
import BillingServices from '../Admin/report-settings/billing-services';
import BillingDiscrepancy from '../reports/billing-discrepancy/billing-discrepancy';
import TabsLogs from '../reports/tabs-logs/tabs-logs';
import { bindActionCreators } from "redux";
import { loginAction, getPermissionByCompany, getPermissions, editClientData, getCompanyPermissions, refreshUserAction } from '../../store/actions';
import PermissionList from '../../assets/data/permissionList.json';

import AnnualBillingView from '../Admin/report-settings/annual-billing';
import ManagementBillingView from '../Admin/report-settings/management-overview';
import BillingView from '../Admin/report-settings/billing-discrepancy';
import CSRAssignments from '../Admin/report-settings/csr-assignments';

class HomeView extends Component {
  state = {
    ShowSidebar: false,
    active: false,
    mobClass: 'hellll',
    HoverSidebarName: null,
  };

  toggleHeader = () => {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
    this.setState({ mobClass: "" })
  };

  async componentDidMount() {
    if (!this.props.USER || !Object.keys(this.props.USER).length) {
      this.props.history.push('/login');
    }


    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  isPermission(key, isGroupPermission) {
    let { permissions } = this.props.USER;
    if (isGroupPermission) return this.findInGroup(permissions, this.getPermissionGroup(key));
    return this.findPermission(permissions, key);
  }

  findPermission = (permissions, key) => {
    return permissions?.find(p => p.key === key && p.isActive);
  }

  findInGroup = (permissions, group) => {
    return permissions?.filter(p => group.find(pl => pl.key === p.key && pl.isActive));
  }

  getPermissionGroup = (groupKey) => {
    return PermissionList.filter(p => p.group === groupKey);
  }


  updateDimensions() {
    if (window.innerWidth <= 992) {
      this.setState({ mobClass: "mobie-sidebar" })
    } else {
      this.setState({ mobClass: "" })
    }
  }

  hoverOn = () => {
    this.setState({ HoverSidebarName: "MouseEnter" })
  }
  hoverOff = () => {
    this.setState({ HoverSidebarName: "MouseOut" })
  }

  backAdmin = ($e) => {

    $e.preventDefault();
    const { prevPermissions, prevRole, prevCompany, company } = this.props.USER;
    this.props.USER.role = prevRole;
    this.props.USER.company = prevCompany;
    this.props.USER.LOGIN_AS = false;
    this.props.USER.prevRole = null;
    this.props.USER.prevCompany = company;
    this.props.USER.permissions = prevPermissions;
    this.props.USER.companyId = this.props.USER.companyDetails._id;
    this.props.USER.compSystemId = this.props.USER.companyDetails.companyId
    localStorage.setItem('USER', JSON.stringify(this.props.USER));
    this.props.refreshUserAction();
    // this.setState   
    this.props.history.replace(`/admin/clients`);
  };

  render() {
    return (

      <div className="container-fluid">
        <HeaderView history={this.props.history} clickHeader={this.toggleHeader} />
        <div className="body-outer">
          <div className="row">
            <SideMenu className={`${this.state.active ? 'hide-sidebar' : 'show-sidebar'} ${this.state.mobClass} ${this.state.HoverSidebarName} `} hoverOn={this.hoverOn} hoverOff={this.hoverOff} backAdmin={this.backAdmin} />
            {/* {
              (this.props.getPermissionActive.length ? true : false) && ( */}
            <div className={`page-wrapper ${this.state.active ? 'full_wrapper' : 'short_wrapper'} ${this.state.mobClass ? 'full_mobile_wrapper' : 'short_mobile_wrapper'} ${this.state.HoverSidebarName}`}>
              {this.isPermission('WAGE_PARITY') && (<Route path='/reports/wage-parity' component={WageParityView} />)}
              {this.isPermission('PATIENT_HOURS') && (<Route path='/reports/patient-hours' component={PatientHoursView} />)}
              {this.isPermission('CERTIFIED_PAYROLL') && (<Route path='/reports/certified-payroll' component={TabsCertifiedPayroll} />)}
              {this.isPermission('EMPLOYEES_ACCRUALS') && (<Route path='/reports/accruals' component={EmployeeAccruals} />)}
              {this.isPermission('FILE_CONVERSION', true) && (<Route path='/file-conversions' component={TaxCollectionView} />)}
              {this.isPermission('NO_PAYROLL_ACTIVITY') && (<Route path='/reports/no-payroll-activity' component={NoPayrollActivityView} />)}
              {this.isPermission("LATE_PAYROLL") && (<Route path='/reports/late-payroll' component={TabsLatePayrolls} />)}
              {this.isPermission("ANNUAL_BILLING") && (<Route path='/reports/annual-billing' component={AnnualBillingReportView} />)}
              {this.isPermission('CSR_ASSIGNMENT') && (<Route path='/reports/csr-assignments' component={CSRAssignmentsReport} />)}
              {this.isPermission('BILLING_DISCREPANCY') && (<Route path='/reports/billing-discrepancy' component={BillingDiscrepancy} />)}
              {this.isPermission('MANAGEMENT_OVERVIEW') && (<Route path='/reports/management-overview' component={ManagementOverview} />)}
              {this.isPermission('LOGS') && (<Route path='/reports/logs' component={TabsLogs} />)}
              {this.isPermission('WAGE_RATES') && (<Route path='/wage' component={LocationWage} />)}
              {this.isPermission("CLIENT_LIST") && (<Route path='/admin/clients' component={ClientsView} />)}
              {this.isPermission("USERS_LIST") && (<Route path='/admin/users' component={Users} />)}
              {this.isPermission("ADMIN_RBAC_ACCESS") && (<Route path='/admin/Role' component={RoleView} />)}
              {(<Route path='/admin/login' component={AdminLogin} />)}
              {this.isPermission("TEAM_SUPPORT") && (<Route path='/team-support-history' component={TeamSupportHistory} />)}
              {this.isPermission('TIME_INVENTORY') && (<Route path='/time-inventory' component={TimeInventory} />)}
              {this.isPermission('EDIT_SETTING_OR_PERMISSION', true) && (<Route path='/admin/billing-services' component={BillingServices} />)}
              {this.isPermission('EMAIL_SETUP') && (<Route path='/email-setup' component={EmailSetup} />)}
              {this.isPermission('EDIT_SETTING_OR_PERMISSION', true) && (<Route path='/admin/annual-billing' component={AnnualBillingView} />)}
              {this.isPermission('EDIT_SETTING_OR_PERMISSION', true) && (<Route path='/admin/management-billing' component={ManagementBillingView} />)}
              {this.isPermission('EDIT_SETTING_OR_PERMISSION', true) && (<Route path='/admin/billing' component={BillingView} />)}
              {this.isPermission('EDIT_SETTING_OR_PERMISSION', true) && (<Route path='/admin/csr-assignments' component={CSRAssignments} />)}

            </div>
          </div>
        </div>
      </div>



      // <Header/>
      // <SideMenu/>
    )
  }
}


const mapStateToProps = ({ USER, getPermissionActive, PERMISSIONS, EDIT_CLIENT_DATA }) => ({ USER, getPermissionActive, PERMISSIONS, EDIT_CLIENT_DATA });
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    loginAction,
    refreshUserAction,
    getPermissionByCompany,
    getCompanyPermissions,
    getPermissions,
    editClientData
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
