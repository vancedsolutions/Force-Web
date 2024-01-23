import { pick } from 'lodash';
import Grid from '../../../components/grid';
import { connect } from "react-redux";
import { GetAccrualsReport, saveTimeOffs, getTimeOffs } from "../../../store/actions";
import React, { Component } from 'react'
import './style.scss';

class AccrualsReport extends Component {
    state = {
        loading: false,
        isSelectedRowData: "",
        isShow: false,
        //locked: "No",
        savedTimeOffs: [],
        einsState: [],
        reportState: [],
        isOpened: false,
        selected: [],
        flag: false,
        messageErr: false,
        messageErrList: [],
        timeOffsList: [],
        columnDefs: [
            {
                headerName: "EIN",
                field: "employeeEin",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,

            },
            {
                headerName: "Employee ID",
                field: "employeeId",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
            },

            {
                headerName: "Last Name",
                field: "lastName",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
            },
            {
                headerName: "First Name",
                field: "firstName",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,

            },
            {
                headerName: "Total Hours Remaining",
                field: "totalHoursRemaining",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                valueFormatter: params => params.data.totalHoursRemaining.toFixed(2),
            },

            {
                headerName: "Total Hours Earned Ytd",
                field: "totalHoursEarnedYtd",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                valueFormatter: params => params.data.totalHoursEarnedYtd.toFixed(2),
            },

            {
                headerName: "Total Hours Taken Ytd",
                field: "totalHoursTakenYtd",
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                valueFormatter: params => params.data.totalHoursTakenYtd.toFixed(2),

            },

        ],
        rowData: [],
        searchText: '',
    };
    usersPayload = {};
    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        const updateData = (data) => {
            let dataSource = {
                getRows: async (params) => {

                    this.gridApi.showLoadingOverlay();
                    let { report, timeOffs, eins } = data;

                    this.setState({ einsState: eins, reportState: report });
                    this.mergeTimeOffLists(timeOffs, this.state.savedTimeOffs);

                    let aggregatedReportList = this.aggregateReport(report, this.state.selected, eins[0]);
                    if (this.state.searchText.length) {
                        const regex = new RegExp(this.state.searchText, 'i');

                        aggregatedReportList = aggregatedReportList.filter(res => regex.test(res.firstName) || regex.test(res.lastName) || regex.test(res.employeeEin) || regex.test(res.employeeEin) || regex.test(res.employeeId) || regex.test(res.employeeStatus))
                    }
                    this.gridApi.hideOverlay();
                    return params.successCallback(aggregatedReportList, aggregatedReportList.length);

                }
            }
            params.api.setServerSideDatasource(dataSource);
        }
        this.gridApi.showLoadingOverlay();
        this.getAccrualsReport((getUsersList) => {
            updateData(getUsersList)
        })
    }
    getAccrualsReport = async (callback) => {
        await this.props.GetAccrualsReport(this.getCompany());
        const getUsersList = this.props.AccrualsReportList;
        if (getUsersList.hasOwnProperty('message')) {
            this.setState({ messageErr: true })
        }
        const ddd = this.props.AccrualsReportList.message
        this.setState({ messageErrList: ddd })
        return callback(getUsersList)
    }
    aggregateReport = (report, selectedTimeOffs, ein) => {
        let _report = [];
        if (selectedTimeOffs.length) {
            _report = report.map(elem => {
                let emp = pick(elem, ["accrualProfile", "employeeEin", "employeeId", "firstName", "lastName", "employeeStatus", "dateHired", "updatedToDate"]) || {}
                selectedTimeOffs.forEach(timeOff => {
                    emp.totalHoursRemaining = (emp.totalHoursRemaining || 0) + (Number(elem[timeOff.name]?.hoursRemaining) || 0);
                    emp.totalHoursEarnedYtd = (emp.totalHoursEarnedYtd || 0) + (Number(elem[timeOff.name]?.hoursEarnedYtd) || 0);
                    emp.totalHoursTakenYtd = (emp.totalHoursTakenYtd || 0) + (Number(elem[timeOff.name]?.hoursTakenYtd) || 0);
                });
                return emp;
            });
        }

        return _report;
    };

    searchInput = (e) => {
        this.setState({ searchText: e.target.value });
        this.gridApi.purgeServerSideCache();
    }


    getCompany() {
        let _company = this.props.USER.company;
        let company = _company === 'pcpayadmin' ? 'h3827' : _company;
        return company;
    };

    handleTimeOffChange(timeOffs, idx) {
        timeOffs[idx].selected = !timeOffs[idx].selected;
        let selected = timeOffs.filter(t => t.selected === true);
        this.setState({
            savedTimeOffs: [...timeOffs],
            selected,
            timeOffsList: [...timeOffs],
            flag: true
        })
        this.gridApi.purgeServerSideCache();
    };


    selectCheckBox = () => {
        this.setState({ isOpened: !this.state.isOpened });
    };

    setAsDefault = async ($e) => {

        $e.preventDefault();


        let payload = {
            company: this.props.USER.companyId || this.props.USER.companyDetails._id,
            timeOffs: this.state.timeOffsList,
        }
        await saveTimeOffs(payload);
        this.setState({ isOpened: false });
        this.gridApi.purgeServerSideCache();
    }
    async componentDidMount() {

        let savedTimeOffs = await getTimeOffs(this.props.USER.companyId || this.props.USER.companyDetails._id);

        if (savedTimeOffs?.length) {
            this.setState({ savedTimeOffs });
        }
    }

    mergeTimeOffLists = (plain, saved) => {
        let list = plain.reduce((arr, el) => {
            let isSaved = saved.find(sto => sto.name === el);
            let tOff = { name: el };
            tOff.selected = isSaved ? isSaved.selected : true;
            arr.push(tOff);
            return arr;
        }, []);
        let selected = list.filter(t => t.selected);
        this.setState({ timeOffsList: list, selected });
    }

    render() {
        const { loading, timeOffsList, messageErrList } = this.state;
        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4"> Employee Accrual Totals </h4>
                </div>

                <div className="shadow_white_box full-box mt-0">

                    {this.state.messageErr ?
                        <>
                            <h4 className="heading_h4 mb-3"> Error </h4>
                            <div className="ErrorField">
                                {messageErrList.map((to, ix) => {
                                    return (
                                        <div className="alert alert-danger" key={ix}>
                                            {to.message}
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                        :
                        <>
                            <div className="filter-list d-flex align-items-center justify-content-between">
                                <div className="filter-field d-flex">
                                    <input type="text" placeholder="Search" autoComplete="off" onChange={(e) => this.searchInput(e)} />
                                </div>
                                <div className="filter-fields d-flex">
                                    <div className="toggle_btn">
                                        <button className="btn acc_btn" onClick={this.selectCheckBox}>Time Offs<span className="countNumber">{this.state.timeOffsList.length}</span></button>

                                        {this.state.isOpened && (
                                            <div className="toggle_output">
                                                {timeOffsList.map((to, ix) => {
                                                    return (
                                                        <div className="filter_inpt_sec" key={ix}>
                                                            <input type="checkbox"
                                                                id={ix}
                                                                checked={!!to.selected}
                                                                onChange={e => this.handleTimeOffChange(timeOffsList, ix, !!e.target.checked)}
                                                            ></input>
                                                            {to.name}
                                                        </div>
                                                    )
                                                })}
                                                <button className="btn acc_btn" onClick={this.setAsDefault}>Set as default</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="clients_grid">
                                <Grid
                                    columnDefs={this.state.columnDefs}
                                    rowModelType='serverSide'
                                    onGridReady={this.onGridReady}
                                    height='600px'
                                >
                                </Grid>
                            </div></>}



                </div>
            </>
        )
    }
}

const mapStateToProps = ({ AccrualsReportList, USER }) => ({ AccrualsReportList, USER });
export default connect(mapStateToProps, { GetAccrualsReport })(AccrualsReport);

