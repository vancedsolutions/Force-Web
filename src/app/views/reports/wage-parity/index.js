import './style.scss';
import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "../../../components/grid";
import { wageParityAction, getSyncWageParity } from "../../../store/actions"
import * as _ from "lodash";
import { RangeDatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment from "moment"
import Loader from "../../../components/loader/Loader"

class WageParityView extends Component {

    columnDefs = [

        { headerName: "Employee ID", field: "employeeId", sortable: true, filter: true, resizable: true, width: 110 },
        { headerName: "Subject to Wage Parity Hours", field: "totalHoursHours", sortable: true, filter: true, resizable: true, width: 160 },
        { headerName: "Subject to Wage Parity Earnings", field: "totalHoursPaid", sortable: true, filter: true, resizable: true, width: 220 },
        { headerName: "Hourly Rate", field: "hourlyRate", sortable: true, resizable: true, filter: true, width: 110 },
        { headerName: "3rd Party Wage Parity", field: "thirdPartyPay", sortable: true, resizable: true, filter: true, width: 165 },
        { headerName: "Wage Parity Benfits Earnings", field: "earningBenfit", sortable: true, resizable: true, filter: true, width: 165 },
        { headerName: "HHA Holiday Amount", field: "totalpremiumPaid", sortable: true, resizable: true, filter: true, width: 165 },
        { headerName: "HHA Premium", field: "totalPremiumCalculated", sortable: true, resizable: true, filter: true, width: 125 },
        { headerName: "Time off Accruals Hours", field: "accruals", sortable: true, resizable: true, filter: true, width: 165 },
        { headerName: "Time off Accruals Amount", field: "accrualsPay", sortable: true, resizable: true, filter: true, width: 165 },
        { headerName: "Total Hourly Rate", field: "totalHours", sortable: true, resizable: true, filter: true, width: 165 },
        { headerName: "PTO actual paid", field: "totalPaidAccruals", sortable: true, resizable: true, filter: true, width: 165 },

    ];
    state = {
        rowData: [],
        employeeId: '',

    }
    reportPayload = {
        endDate: moment(new Date()).format('MM/DD/YYYY'),
        startDate: moment(new Date()).subtract(365, "days").format('MM/DD/YYYY'),

    }
    getCompany() {
        let _company = this.props.USER.company.toLowerCase();
        return _company === 'pcpayadmin' ? 'u1100' : _company;
    };
    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.reportPayload.startRow = params.startRow;
                this.reportPayload.endRow = params.endRow;
                this.reportPayload.employeeId = this.state.employeeId;
                this.reportPayload.companyShortCode = this.getCompany();
                // use redux..
                this.gridApi.showLoadingOverlay();
                await this.props.wageParityAction(this.reportPayload);
                const getWageParityList = this.props.WAGE_PARITY;
                this.gridApi.hideOverlay();
                if (getWageParityList !== undefined && getWageParityList.records.length > 0) {
                    getWageParityList.records.forEach(element => {
                        let combinedBenefitsPay = (Number(element.totalDeductionPaid) || 0) + (Number(element.totalBenefitsPaid) || 0);
                        // let  thirdPartyPay = ((18.40 * element.totalHoursHours) - element.totalHoursPaid)
                        let accrualsPay = (Number(element.hourlyRate) || 0) * (Number(element.accruals) || 0.000000000001);
                        let totalHourPaid = element.totalHoursPaid;
                        element.totalHoursHours = _.round(element.totalHoursHours, 2);
                        element.totalHoursPaid = '$ ' + _.round(element.totalHoursPaid, 2);
                        element.hourlyRate = '$ ' + _.round(element.hourlyRate, 2);
                        element.thirdPartyPay = _.round(element.thirdPartyPay, 2);
                        element.totalDeductionPaid = '$ ' + _.round(element.totalDeductionPaid, 2);
                        element.totalpremiumPaid = '$ ' + _.round(element.totalpremiumPaid, 2)
                        element.totalPremiumCalculated = _.round(element.totalPremiumCalculated, 2);
                        element.accruals = _.round(element.accruals, 2);
                        element.earningBenfit = '$ ' + _.round(combinedBenefitsPay, 2);
                        element.accrualsPay = '$ ' + _.round(accrualsPay, 2)
                        if (element.totalHoursHours > 0) {
                            element.totalHours = _.round(((totalHourPaid + combinedBenefitsPay + element.totalPremiumCalculated + accrualsPay + parseFloat(element.thirdPartyPay)) / element.totalHoursHours), 2)
                        }
                        else
                            element.totalHours = 0;
                    });


                }
                if (!getWageParityList.records.length) {
                    this.gridApi.showNoRowsOverlay();
                }
                this.setState({ rowData: getWageParityList.records })
                return params.successCallback(getWageParityList.records, getWageParityList.count);

            }
        }
        params.api.setDatasource(dataSource)
    }
    componentDidMount() {
        if (!this.props.USER || !Object.keys(this.props.USER).length) {
            this.props.history.push('/login');
        }
    }
    refreshGrid = () => {
        this.gridApi.refreshInfiniteCache();
    }
    searchInput = (e) => {
        this.setState({ employeeId: e.target.value });
        this.gridApi.purgeInfiniteCache();
        // this.gridApi.refreshInfiniteCache();
    }
    onSelectedDatePicker = () => (...args) => {
        if (args[0] !== undefined && args[1] !== undefined) {
            this.reportPayload.startDate = moment(args[0]).format('MM/DD/YYYY');
            this.reportPayload.endDate = moment(args[1]).format('MM/DD/YYYY');
            this.gridApi.purgeInfiniteCache();
            // this.gridApi.refreshInfiniteCache();
        }

    };
    onSyncAction = async () => {
        this.setState({ loading: true });
        await this.props.getSyncWageParity();
        this.gridApi.refreshInfiniteCache();
        this.setState({ loading: false });

        //Faking API call here

    }

    render() {

        const { loading } = this.state;

        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4"> Wage Parity </h4>
                    <button className="mla fs12 primary mini" onClick={() => this.onSyncAction()} disabled={loading}>{loading && (<Loader></Loader>)}
                        {loading ? <span>Loading data </span> : <span>Sync Now</span>}</button>
                </div>

                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between">
                        <div className="filter-field d-flex">
                            <input type="text" placeholder="Search" onChange={(e) => this.searchInput(e)} />
                            {/* <button onClick={(e) => this.refreshGrid()} >Filter</button> */}
                        </div>
                        <div className="date-range d-flex">
                            <label>Date Range</label>

                            <RangeDatePicker
                                initialStartDate={this.reportPayload.startDate}
                                initialEndDate={this.reportPayload.endDate}
                                startPlaceholder="Start Date"
                                endPlaceholder="End Date"
                                className="RangeDatePicker" dateFormat="MM/DD/YYYY" onChange={this.onSelectedDatePicker()} />

                        </div>

                    </div>
                    <Grid rowModelType={'infinite'}
                        onGridReady={this.onGridReady}
                        height='600px'

                        columnDefs={this.columnDefs}>
                    </Grid>
                </div>


            </>
        )
    }
}
const mapStateToProps = ({ USER, WAGE_PARITY }) => ({ USER, WAGE_PARITY });

export default connect(mapStateToProps, { wageParityAction, getSyncWageParity })(WageParityView);
