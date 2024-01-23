import React, { Component } from "react";
import { connect } from "react-redux";
//import Grid, { plugins } from 'griddle-react';
import Grid from '../../../components/grid';
import { API } from '../../../utils/api';
import Loader from "../../../components/loader/Loader";
import Axios from 'axios';

class AnnualBillingReport extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        report: [],
        columnDefs: [
            {
                headerName: "Company Id",
                field: "companyId",
                sortable: true,
                resizable: true,
            }, {
                headerName: "Company Short Name",
                field: "shortName",
                sortable: true,
                resizable: true,
            }, {
                headerName: "Client Name",
                field: "clientName",
                sortable: true,
                resizable: true,
            }, {
                headerName: "Month Total",
                field: "monthTotal",
                sortable: true,
                resizable: true,
                valueFormatter: params => this.formatAsCurrency(params.value)
            }, {
                headerName: "Projected Total",
                field: "projectedTotal",
                sortable: true,
                resizable: true,
                valueFormatter: params => this.formatAsCurrency(params.value)
            }, {
                headerName: "CSR Account",
                field: "csrAccount",
                sortable: true,
                resizable: true,
            }
        ]
    };

    formatAsCurrency = (val) => {
        return new Intl.NumberFormat('en-US',
            { style: 'currency', currency: 'USD' })
            .format(val);
    };

    getAnnualBillingReport = async (year) => {
        let billingReport = await Axios.get(API.getAnnualBilling, { params: { year } }).catch(e => e);
        return billingReport?.data || []/* ?.map(comp => {
            let { companyId, shortName, clientName, monthTotal, projectedTotal, csrAccount } = comp;
                monthTotal = this.formatAsCurrency(monthTotal);
                projectedTotal = this.formatAsCurrency(projectedTotal);
            return {
                "Company Id  ": companyId,
                "Short Name  ": shortName,
                "Client Name  ": clientName,
                "Last Month Total  ":
                    new Intl.NumberFormat('en-US',
                        { style: 'currency', currency: 'USD' })
                        .format(monthTotal),
                "Projected Total  ": new Intl.NumberFormat('en-US',
                    { style: 'currency', currency: 'USD' })
                    .format(projectedTotal),
                "CSR Account  ": csrAccount
            };
        })*/;
    };

    async componentDidMount() {

        let report = await this.getAnnualBillingReport(new Date().getFullYear() - 1);

        this.setState({ loading: false, report });
    };

    render() {
        let { loading, report, columnDefs } = this.state;
        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4">Annual Billing</h4>
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

function mapStateToProps({ user }) { return { user } };

export default connect(mapStateToProps)(
    AnnualBillingReport
);
