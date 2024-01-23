import React, { Component } from 'react'
import { connect } from "react-redux";
import { noPayrollActivityAction } from '../../../store/actions';
import Grid from '../../../components/grid';
import _ from "lodash";
import { RangeDatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment from "moment";
import Axios from "axios"

import Loader from "../../../components/loader/Loader"
export class NoPayrollActivityView extends Component {

    state = {
        loading: false,
        rowData: [],
        endDate: moment(new Date()).format("YYYY-MM-DD"),
        startDate: moment(new Date()).subtract(90, "days").format("YYYY-MM-DD"),
    }

    columnDefs = [
        {
            headerName: "Short Name",
            field: "companyShortName",
            sortable: true,
            filter: 'agMultiColumnFilter',
            resizable: true,
            width: "auto",
            rowGroup: true,
            hide: true,
            floatingFilter: true
        },
        {
            headerName: "Company Name",
            field: "companyName",
            sortable: true,
            filter: 'agMultiColumnFilter',
            resizable: true,
            width: "auto",
            floatingFilter: true
        },
        {
            headerName: "Start Date",
            field: "companyStartDate",
            sortable: true,
            filter: 'agDateColumnFilter',
            resizable: true, width: "auto",
            floatingFilter: true
        },
        {
            headerName: "CSR",
            field: "CSRAccount", sortable: true,
            resizable: true,
            filter: 'agMultiColumnFilter',
            width: "auto",
            floatingFilter: true
        },
        {
            headerName: "EIN Name",
            field: "payrollEINName",
            sortable: true, resizable: true,
            filter: 'agMultiColumnFilter',
            width: "auto",
            floatingFilter: true
        },
        {
            headerName: "Payrolls in Range",
            field: "recentPayrolls",
            sortable: true, resizable: true,
            filter: 'agNumberColumnFilter', width: "auto",
            floatingFilter: true
        },
        {
            headerName: "Last Payroll (12 Months)",
            field: "lastPayroll",
            sortable: true,
            filter: 'agDateColumnFilter',
            resizable: true, flex: 1, width: "auto",
            floatingFilter: true
        },
        {
            headerName: "Has Later Payrolls",
            field: "hasLaterPayrolls",
            sortable: true,
            filter: 'true',
            resizable: true, flex: 1, width: "auto",
            floatingFilter: true
        },

    ];
    /*  onGridReady = async (params) => {
         this.gridApi = params.api;
         this.gridColumnApi = params.columnApi;
         let dataSource = {
             getRows: async (params) => {
                 this.reportPayload.startRow = params.startRow;
                 this.reportPayload.endRow = params.endRow;
                 this.gridApi.showLoadingOverlay();
                 await this.props.noPayrollActivityAction({
                     fromDate: this.reportPayload.startDate,
                     toDate: this.reportPayload.endDate,
                     startRow: this.reportPayload.startRow,
                     endRow: this.reportPayload.endRow,
 
                     view: true,
                     zeroOnly: false
                 })
 
                 let noPayrollActiveList = this.props.NO_PAYROLL_ACTIVITY;
                 this.gridApi.hideOverlay();
                 if (!noPayrollActiveList?.records?.length) {
                     this.gridApi.showNoRowsOverlay();
                 }
 
                 return params.successCallback(noPayrollActiveList.records, noPayrollActiveList.count);
             }
         }
 
         params.api.setDatasource(dataSource)
 
     } */

    async componentDidMount() {
        await this.loadingData();
    }


    onSelectedDatePicker = () => (...args) => {
        if (args[0] && args[1]) {
            this.setState({
                startDate: moment(args[0]).format('MM/DD/YYYY'),
                endDate: moment(args[1]).format('MM/DD/YYYY')
            });
        }
    };

    loadingData = async () => {
        this.setState({ loading: true });
        let records = await Axios.get('api/active-payroll/active-clients-report', {
            params:
                { startDate: this.state.startDate, endDate: this.state.endDate }
        });
        this.setState({ loading: false, rowData: records.data || [] });
    };

    render() {
        const { loading, rowData } = this.state;
        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4"> No Payroll Activity</h4>

                </div>

                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between">
                        <div className="date-range d-flex">
                            <label>Date Range</label>
                            <RangeDatePicker
                                initialStartDate={this.state.startDate}
                                initialEndDate={this.state.endDate}
                                startPlaceholder="Start Date"
                                endPlaceholder="End Date"
                                className="RangeDatePicker" dateFormat="MM/DD/YYYY" onChange={this.onSelectedDatePicker()} />
                        </div>
                        <button className="mla fs12 primary mini" onClick={this.loadingData} disabled={loading}>
                            {loading && (<Loader></Loader>)}
                            {loading ? <span>Loading data </span> : <span>Run</span>}
                        </button>
                    </div>

                    <Grid
                        columnDefs={this.columnDefs}
                        groupDisplayType='groupRows'
                        rowData={rowData}
                        groupDefaultExpanded={1}
                        height='600px'
                    >
                    </Grid>
                </div>
            </>
        )
    }
}
const mapStateToProps = ({ USER, }) => ({ USER, });

export default connect(mapStateToProps, { noPayrollActivityAction })(NoPayrollActivityView);
