import React, { Component } from 'react'
import Grid from '../../../components/grid';
import _ from "lodash";
import { RangeDatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment from "moment";
import Loader from "../../../components/loader/Loader"
import axios from 'axios';

export class LogHistoryView extends Component {
    state = {
        loading: false,
        rowData: [],
    };
    reportPayload = {
        endDate: moment(new Date()).format("YYYY-MM-DD"),
        startDate: moment(new Date()).subtract(90, "days").format("YYYY-MM-DD"),

    };
    getLogsHistory = async (params) => {
        let logs = await axios.get('api/logs/logs', { params }).catch(e => e);
        return logs?.data || [];
    };

    columnDefs = [
        {
            headerName: "Changed By", children: [
                { field: "changedBy.username", headerName: "User Name", sortable: true, filter: false, flex: 1, width: 110 },
                { field: "changedBy.company", headerName: "Company", sortable: true, filter: false, flex: 1, width: 110 }
            ]
        },
        { headerName: "Collection", field: "collectionName", sortable: true, filter: false, resizable: true, flex: 1, width: 200 },
        { headerName: "Record Id", field: "documentKey", sortable: true, filter: false, resizable: true, flex: 1, width: 150 },
        { headerName: "Operation Type", field: "operationType", sortable: true, filter: false, resizable: true, flex: 1, width: 200 },
        {
            headerName: "Changes", valueGetter: ({ data }) => {
                let str = ``;
                Object.entries((data?.document || {})).forEach((entry) => {
                    str += `${entry[0]}: ${entry[1]} `
                });
                return str;
            }, sortable: true, filter: false, resizable: true, width: 250
        },
        { headerName: "Changed At", field: "createdAt", sortable: true, filter: false, resizable: true, width: 150 },

    ];
    onGridReady = async (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.reportPayload.startRow = params.startRow;
                this.reportPayload.endRow = params.endRow;

                this.gridApi.showLoadingOverlay();
                let logsReport = await this.getLogsHistory({
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

    componentDidMount = async () => {
        /* this.setState({loading: true});
        await this.getLogsHistory({ startRow: 0, endRow: 200 });
        this.setState({loading:false}); */
    };

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

export default LogHistoryView;
