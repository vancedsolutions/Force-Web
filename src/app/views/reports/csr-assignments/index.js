import React, { Component } from "react";
import { toDecimal, toCurrency } from "../../../utils/helpers";
import Grid from '../../../components/grid';
import { API } from '../../../utils/api';
import Loader from "../../../components/loader/Loader";
import Axios from 'axios';

class CSRAssignmentsReport extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        report: [],
        columnDefs: [
            {
                headerName: "Employee Name",
                field: "Full Name"
            }, {
                headerName: "Employee Capacity",
                field: "Employee Capacity",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "Account Capacity",
                field: "Account Capacity",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "Enterprise Accounts Capacity",
                field: "Enterprise Accts Capacity",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "Total Accounts",
                field: "TotalAccounts",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "PR-Only Accounts",
                field: "PROnlyAccounts",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "TLM Accounts",
                field: "TLMAccounts",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "Enterprise Accounts",
                field: "EnterpriseAccounts",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "Total Employees",
                field: "TotalEmpCount",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "PR-Only Employees",
                field: "PROnlyEmpCount",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "TLM Employees (x²)",
                field: "TLMEmpCount",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "Enterprise Employees",
                field: "EnterpriseEmpCount",
                valueFormatter: params => toDecimal(params.value)
            }, {
                headerName: "% TLM Accounts",
                field: "TLM2Comp",
                valueFormatter: params => `${params.value}%`
            }, {
                headerName: "% Enterprise Accounts",
                field: "Enterprise2Comp", valueFormatter: params => `${params.value}%`
            }, {
                headerName: "% TLM Employees",
                field: "TLM2Emps", valueFormatter: params => `${params.value}%`
            }, {
                headerName: "% Enterprise Employees",
                field: "Enterprise2Emps", valueFormatter: params => `${params.value}%`
            }, {
                headerName: "Workload",
                field: "Workload", valueFormatter: params => `${params.value}%`
            }, {
                headerName: "Annual Income",
                field: "AnnualIncome", //valueFormatter: params => toCurrency(params.value)
            }, {
                headerName: "CSR Account",
                field: "csrAccount",
            }
        ]
    };

    getCSRAssignmentsReport = async (year) => {
        let CSRAssignmentsReport = await Axios.get(API.getCsrAssignments).catch(e => e);
        return CSRAssignmentsReport?.data || []
    };

    async componentDidMount() {

        let report = await this.getCSRAssignmentsReport(new Date().getFullYear() - 1);

        this.setState({ loading: false, report });
    };

    render() {
        let { loading, report, columnDefs } = this.state;
        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4">CSR Assignments</h4>
                    <button className="mla fs12 primary mini" onClick={this.loadingData} disabled={loading}>
                        {loading && (<Loader></Loader>)}
                        {loading ? <span>Loading data </span> : <span>Sync Now</span>}
                    </button>
                </div>
                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between">
                        <div className="filter-field d-flex">
                        </div>

                    </div>
                    <Grid
                        enableRangeSelection={true}
                        rowData={report}
                        columnDefs={columnDefs}
                        height='600px'
                    >
                    </Grid>


                </div>

            </>
        );
    }
}
export default CSRAssignmentsReport;
