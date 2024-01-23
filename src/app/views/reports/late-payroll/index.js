import React, {
    Component
} from 'react'
import './style.scss';
import {
    connect
} from "react-redux";
import {
    DatePicker
} from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment from "moment";
import Grid from '../../../components/grid';
import Loader from "../../../components/loader/Loader";
import {
    latePayrollAction, getSyncLatePayroll
} from "../../../store/actions"
class LatePayrollView extends Component {
    state = {
        rowData: [],
        startDate: moment(new Date()).format('MM/DD/YYYY')
    }
    columnDefs = [{
        headerName: "Short Name",
        field: "shortName",
        sortable: true,
        resizable: true,
        width: 120
    },
    {
        headerName: "MasterTax ID",
        field: "masterTaxId",
        sortable: true,
        resizable: true,
        width: 120
    },
    {
        headerName: "Company Name",
        field: "companyName",
        sortable: true,
        resizable: true,
        width: 180
    },
    {
        headerName: "EIN Name",
        field: "einName",
        sortable: true,
        resizable: true,
        width: 180
    },
    {
        headerName: "MasterTax Start Date",
        field: "masterTaxStartDate",
        sortable: true,
        resizable: true,
        width: 150
    },

    {
        headerName: "Total Payrolls Past 365 Days",
        field: "total_payroll_365_days",
        sortable: true,
        resizable: true
    },
    {
        headerName: "On Time Payrolls",
        field: "withinLimits",
        sortable: true,
        resizable: true
    },
    {
        headerName: "Late Payrolls",
        field: "overTreshhold",
        sortable: true,
        resizable: true
    },
    {
        headerName: "% Late",
        field: "payroll_365_latePercent",
        sortable: true,
        resizable: true
    },
    {
        headerName: "Avg DD $",
        field: "avrage_dd_365",
        sortable: true,
        resizable: true
    },

    {
        headerName: "Total Payrolls Past 90 Days",
        field: "total_payroll_90_days",
        sortable: true,
        resizable: true
    },
    {
        headerName: "On Time Payrolls",
        field: "last90WithinLimits",
        sortable: true,
        resizable: true
    },
    {
        headerName: "Late Payrolls",
        field: "last90Over",
        sortable: true,
        resizable: true
    },
    {
        headerName: "% Late",
        field: "payroll_90_latePercent",
        sortable: true,
        resizable: true
    },
    {
        headerName: "Avg DD $",
        field: "avrage_dd_90",
        sortable: true,
        resizable: true
    },

    {
        headerName: "Total Payrolls Past 30 days",
        field: "total_payroll_30_days",
        sortable: true,
        resizable: true
    },
    {
        headerName: "On Time Payrolls",
        field: "last30WithinLimits",
        sortable: true,
        resizable: true
    },
    {
        headerName: "Late Payrolls",
        field: "last30Over",
        sortable: true,
        resizable: true
    },
    {
        headerName: "% Late",
        field: "payroll_30_latePercent",
        sortable: true,
        resizable: true
    },
    {
        headerName: "Avg DD $",
        field: "avrage_dd_30",
        sortable: true,
        resizable: true
    },



    ];
    rowData = [];
    reportPayload = {}
    onSelectedDatePicker = () => (...args) => {
        if (args[0] !== undefined && args[1] !== undefined) {
            this.reportPayload.startDate = moment(args[1]).format('MM/DD/YYYY');
            this.setState({ startDate: this.reportPayload.startDate })
            this.gridApi.purgeInfiniteCache();
            // this.gridApi.refreshInfiniteCache();

        }

    };


    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.reportPayload.startRow = params.startRow;
                this.reportPayload.endRow = params.endRow;
                this.reportPayload.startDate = this.state.startDate;
                // use redux..
                this.gridApi.showLoadingOverlay();
                await this.props.latePayrollAction(this.reportPayload);
                const getLatePayrollReport = this.props.LATE_PAYROLL_REPORT;
                getLatePayrollReport["records"].forEach(element => {
                    element.total_payroll_365_days = Number(element.withinLimits) + Number(element.overTreshhold);
                    let percentage_365 = 0;
                    if (element.overTreshhold !== 0 && element.withinLimits === 0) {
                        percentage_365 = "100%"
                    } else if (element.overTreshhold === 0 && element.withinLimits !== 0) {
                        percentage_365 = "0%"
                    } else if (element.overTreshhold === 0 && element.withinLimits === 0) {
                        percentage_365 = "0%"
                    } else {
                        percentage_365 = (element.overTreshhold * 100 / (Number(element.withinLimits) + Number(element.overTreshhold))).toFixed(0) + '%';
                    }
                    element.payroll_365_latePercent = percentage_365;
                    let avrage_dd_365;
                    if (element.ddCount === 0) {
                        avrage_dd_365 = "N/A"
                    } else {
                        avrage_dd_365 = '$' + Number((element.ddAmoount / element.ddCount).toFixed(2))
                    }
                    element.avrage_dd_365 = avrage_dd_365;
                    element.total_payroll_90_days = Number(element.last90WithinLimits) + Number(element.last90Over);
                    let percentage_90;
                    if (Number(element.last90Over) !== 0 && Number(element.last90WithinLimits) === 0) {
                        percentage_90 = "100%"
                    } else if (Number(element.last90Over) === 0 && Number(element.last90WithinLimits) !== 0) {
                        percentage_90 = "0%"
                    } else if (Number(element.last90Over) === 0 && Number(element.last90WithinLimits) === 0) {
                        percentage_90 = "0%"
                    } else {
                        percentage_90 = (Number(element.last90Over) * 100 / (Number(element.last90WithinLimits) + Number(element.last90Over))).toFixed(0) + "%"
                    }
                    element.payroll_90_latePercent = percentage_90;
                    let avrage_dd_90;
                    if (Number(element.ddCount90) === 0) {
                        avrage_dd_90 = "N/A"
                    } else {
                        avrage_dd_90 = '$' + Number((element.ddAmoount90 / element.ddCount90).toFixed(2))
                    }
                    element.avrage_dd_90 = avrage_dd_90;
                    element.total_payroll_30_days = Number(element.last30WithinLimits) + Number(element.last30Over);

                    let percentage_30;
                    if (Number(element.last30Over) !== 0 && Number(element.last30WithinLimits) === 0) {
                        percentage_30 = "100%"
                    } else if (Number(element.last90Over) === 0 && Number(element.last90WithinLimits) !== 0) {
                        percentage_30 = "0%"
                    } else if (Number(element.last90Over) === 0 && Number(element.last90WithinLimits) === 0) {
                        percentage_30 = "0%"
                    } else {
                        percentage_30 = (Number(element.last90Over) * 100 / (Number(element.last90WithinLimits) + Number(element.last90Over))).toFixed(0) + "%"
                    }
                    element.payroll_30_latePercent = percentage_30;
                    let avrage_dd_30;
                    if (Number(element.ddCount30) === 0) {
                        avrage_dd_30 = "N/A"
                    } else {
                        avrage_dd_30 = '$' + Number((element.ddAmoount30 / element.ddCount30).toFixed(2))
                    }
                    element.avrage_dd_30 = avrage_dd_30;

                });


                this.gridApi.hideOverlay();

                if (!getLatePayrollReport.records.length) {
                    this.gridApi.showNoRowsOverlay();
                }
                this.setState({
                    rowData: getLatePayrollReport.records
                })
                return params.successCallback(getLatePayrollReport.records, getLatePayrollReport.count);
            }
        }
        params.api.setDatasource(dataSource)
    }



    loadingData = () => {
        this.setState({
            loading: true
        });
        this.props.getSyncLatePayroll();
        //Faking API call here
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 2000);
    };

    render() {
        const {
            loading
        } = this.state;
        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4">Late Payroll</h4>
                    <button className="mla fs12 primary mini" onClick={this.loadingData} disabled={loading}>
                        {loading && (<Loader></Loader>)}
                        {loading ? <span>Loading data </span> : <span>Sync Now</span>}
                    </button>
                </div>
                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between">
                        <div className="filter-field d-flex">


                        </div>
                        <div className="date-range d-flex">
                            <label>Date</label>
                            {/* <div className="calender_field">
                        01/01/2020  to 31/01/2020
                    </div> */}

                            <DatePicker
                                initialDate={this.state.startDate}
                                className="RangeDatePicker" dateFormat="MM/DD/YYYY" onChange={this.onSelectedDatePicker()} />


                        </div>
                    </div>
                    <Grid
                        columnDefs={this.columnDefs}
                        rowData={this.state.rowData}
                        rowModelType='infinite'
                        onGridReady={this.onGridReady}
                        height='600px'>
                    </Grid>


                </div>

            </>
        )
    }
}
const mapStateToProps = ({
    USER,
    LATE_PAYROLL_REPORT
}) => ({
    USER,
    LATE_PAYROLL_REPORT
});

export default connect(mapStateToProps, {
    latePayrollAction, getSyncLatePayroll
})(LatePayrollView)

