import React, { Component } from 'react'
import Grid from '../../../components/grid';
import _ from "lodash";
import { RangeDatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment from "moment";
import axios from 'axios';

export class CronLogsView extends Component {
    state = {
        loading: false,
        rowData: [],
    };
    reportPayload = {
        endDate: moment(new Date()).format("YYYY-MM-DD"),
        startDate: moment(new Date()).subtract(90, "days").format("YYYY-MM-DD"),

    };
    getCronLogs = async (params) => {
        let logs = await axios.get('api/logs/cron-logs', { params }).catch(e => e);
        return logs?.data || [];
    };

    columnDefs = [

        { field: "job", headerName: "Cron Job Name", filter: false, sortable: true, resizable: true, flex: 1 },
        { field: "ranAt", headerName: "Ran At", filter: false, sortable: true, resizable: true, flex: 1 },
        { headerName: "Status", field: "status", filter: false, sortable: true, resizable: true, flex: 1 },
        { headerName: "Message", field: "message", filter: false, sortable: true, resizable: true, flex: 1 },
    ];
    onGridReady = async (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.reportPayload.startRow = params.startRow;
                this.reportPayload.endRow = params.endRow;

                this.gridApi.showLoadingOverlay();
                let logsReport = await this.getCronLogs({
                    fromDate: this.reportPayload.startDate,
                    toDate: this.reportPayload.endDate,
                    startRow: this.reportPayload.startRow,
                    endRow: this.reportPayload.endRow,
                });
                this.gridApi.hideOverlay();
                if (!logsReport.records.length) {
                    this.gridApi.showNoRowsOverlay();
                }


                return params.successCallback(logsReport.records, logsReport.count);
            }
        }

        params.api.setDatasource(dataSource)

    }

    componentDidMount = () => {

    }

    onSelectedDatePicker = () => (...args) => {
        if (args[0] !== undefined && args[1] !== undefined) {
            this.reportPayload.startDate = moment(args[0]).format('MM/DD/YYYY');
            this.reportPayload.endDate = moment(args[1]).format('MM/DD/YYYY');
            this.gridApi.purgeInfiniteCache();
            // this.gridApi.refreshInfiniteCache();
        }
    };

    render() {
        const { loading } = this.state;
        return (
            <>
                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between">

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

                    <Grid
                        columnDefs={this.columnDefs}
                        onGridReady={this.onGridReady}
                        rowModelType='infinite'
                        height='600px'
                    >
                    </Grid>
                </div>
            </>
        )
    }
}

export default CronLogsView;
