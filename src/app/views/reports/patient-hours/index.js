import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from '../../../components/grid';
import {
    patientHoursAction,
    EinsHourAction,
    coordinatorAction,
    getSyncPatientHourReport,
    payrollDetailAction,
} from '../../../store/actions';
import { orderBy, find, isObject } from "lodash";
import './style.scss';
import Select from 'react-select';
import moment from "moment";
import Loader from "../../../components/loader/Loader";
class PatientHoursView extends Component {
    columnDefs = [
        {
            headerName: "Patient Info",
            children: [
                {
                    headerName: "Coordinator",
                    field: "coordinator",
                }, {
                    headerName: "Patient ID",
                    field: "patientId"
                }, {
                    headerName: "Patient Name",
                    field: "patientName",
                },
                {
                    headerName: "Patient Status",
                    field: "status",
                },
            ]

        }, {
            headerName: "Employee information",
            children: [
                {
                    headerName: "Employee Id",
                    field: "employeeId"
                }, {
                    headerName: "Employee First Name",
                    field: "empFirstName"
                }, {
                    headerName: "Employee Last Name",
                    field: "empLastName",
                }
            ]
        }
    ]

    state = {
        loading: false,
        endDate: moment(new Date()).format('MM-DD-YYYY'),
        startDate: moment(new Date()).subtract(7, "d").format('MM-DD-YYYY'),
        firstSelectOptions: [],
        firstSelectedOption: {},
        secondSelectOptions: [],
        secondSelectedOption: {},
        selectedStartWeek: "",
        selectedEndWeek: "",
        loader: false,
        firstPayrollId: "",
        secondPayrollId: ""


    }
    columnHeader = []

    rowData = [];
    reportPayload = {}

    getLastPayrolls = async () => {

        await this.props.payrollDetailAction(this.props.USER.company);
        await this.props.EinsHourAction(this.props.USER.companyId || this.props.USER.companyDetails._id);

    };

    async componentDidMount() {
        this.columnHeader = [...this.columnDefs]
        await this.getLastPayrolls();
        const defaultEin = this.props.EINS.defaultSelected;
        const eins = this.props.EINS.records;
        this.setSelectOptions(this.props.PayrollDetail, eins, defaultEin.companyEIN);
        this.setState({
            loader: true,
        });

    };

    submit = () => {
        this.gridApi.purgeServerSideCache();
    };

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.reportPayload = {
                    startRow: params.startRow,
                    endRow: params.endRow,
                    selectedStartWeek: this.state.startDate,
                    selectedEndWeek: this.state.endDate,
                    companyShortName: this.props.USER.company,
                    firstPayrollId: this.state.firstPayrollId,
                    secondPayrollId: this.state.secondPayrollId
                }

                this.gridApi.showLoadingOverlay();
                await this.props.patientHoursAction(this.reportPayload);
                const getPatientHoursList = this.props.PATIENT_HOURS;

                let list = [];
                if (!getPatientHoursList.count) {
                    this.gridApi.showNoRowsOverlay();
                    list = getPatientHoursList.records;
                } else {

                    list = this.processData(getPatientHoursList.records);
                }
                this.gridApi.hideOverlay();
                if (list.length) {
                    this.gridApi.setColumnDefs(this.columnHeader);
                    this.gridApi.setColumnDefs(this.columnDefs);
                }
                else {
                    this.gridApi.setColumnDefs(this.columnHeader);
                }
                return params.successCallback(list, list.length);

            }
        };
        this.columnApi.autoSizeColumns();
        params.api.setServerSideDatasource(dataSource)
    }

    processData = (patientHoursList) => {

        let preparedData = [];
        let dynamicColumn = [];
        this.columnDefs = [];
        let columnPermission = this.props.USER.permissions?.filter(prm => prm.type === "Comparison Columns" && prm.isActive);
        if (!patientHoursList) return preparedData;
        const { selectedStartWeek, selectedEndWeek, startDate, endDate } = this.state;
        dynamicColumn = [
            ...([{ name: selectedStartWeek, date: startDate }, { name: selectedEndWeek, date: endDate }].map(week => {
                return {
                    headerName: `${week.name} - Week ending ${week.date}`,
                    children: [
                        {
                            headerName: 'Regular',
                            field: `${week.name}_reg`
                        },
                        {
                            headerName: 'Check #2',
                            field: `${week.name}_check2`
                        }
                    ]
                };
            })),
            ...(columnPermission.map(comparison => {
                let name = comparison.label.split(" ")[0];
                return {
                    headerName: comparison.label,
                    children: [
                        {
                            headerName: 'Difference',
                            field: `${name}Diff`,
                            sortable: true, filter: true, resizable: true
                        },
                        {
                            headerName: 'Employee only Diff',
                            field: `${name}EmpDiff`,
                            sortable: true, filter: true, resizable: true
                        }
                    ]
                }
            }))
        ]
        patientHoursList.forEach(el => {
            const empPayrolls = Object.keys(el.values);
            const obj = { ...el };
            empPayrolls.forEach((prl, i) => {
                obj[`${prl}_reg`] = el.values[prl].reg;
                obj[`${prl}_check2`] = el.values[prl].check2;
            });

            obj.StraightDiff = obj.diffs.straight;
            obj.StraightEmpDiff = obj.empOnlyDiffs.straight;
            obj.RegularDiff = obj.diffs.regOnly;
            obj.RegularEmpDiff = obj.empOnlyDiffs.regOnly;
            obj.CombinedDiff = obj.diffs.combined;
            obj.CombinedEmpDiff = obj.empOnlyDiffs.combined;

            this.columnDefs = [...this.columnHeader, ...dynamicColumn]
            preparedData.push(obj);
        });
        return preparedData;
    }

    handleStartWeekChanges = selected => {
        this.setState({
            selectedStartWeek: selected.label,
            firstPayrollId: selected.value,
            firstSelectedOption: selected
        });
        this.setSecondOptions(selected);
    };

    handlePreviousWeekChanges = selected => {
        let secondPayrollId = selected.value
        this.setState({
            selectedEndWeek: selected.label,
            secondPayrollId,
            secondSelectedOption: selected
        });
    };

    loadingData = async () => {
        this.setState({ loading: true });
        let payload = this.state;
        await this.props.getSyncPatientHourReport(payload);
        this.setState({ loading: false });

    };

    setSelectOptions = (payrollsList, einList, defaultEin) => {
        einList = einList.map(e => e.companyEIN).sort();
        let defaultEinIndex = einList.indexOf(defaultEin);
        let orderedEins = einList;
        if (defaultEinIndex && defaultEinIndex > 0) {
            orderedEins.splice(defaultEinIndex, 1);
            orderedEins.unshift(defaultEin);
        };
        let firstSelectOptions = orderedEins.reduce((arr, einGroup) => {
            let group = {
                label: einGroup,
                options: orderBy(payrollsList.filter(prl => {
                    return prl.payrollName.includes(einGroup);
                }).map(prl => ({
                    label: prl.payrollName,
                    value: prl.payrollSystemId,
                    date: moment.utc(prl.payPeriodEnd).format('YYYY-MM-DD'),
                    einGroup
                })),
                    elem => Date.parse(elem.date), "desc")
            };
            return [...arr, group]
        }, []);
        let firstSelectedOption = firstSelectOptions[0].options[0] || {};
        let { label, value, date } = firstSelectedOption;
        let startDate = date;
        let firstPayrollId = value;
        let selectedStartWeek = label
        this.setState({ firstSelectOptions, firstSelectedOption, startDate, firstPayrollId, selectedStartWeek });
        this.setSecondOptions(firstSelectedOption);
    }

    setSecondOptions = firstSelectedOption => {
        let secondSelectOptions = this.state.firstSelectOptions.find(op => op.label === firstSelectedOption.einGroup);
        let indexOfSelected = secondSelectOptions.options.findIndex(op => op.value === firstSelectedOption.value);
        secondSelectOptions = secondSelectOptions.options.map((el, idx) => ({ ...el, isDisabled: idx <= indexOfSelected }));
        let secondSelectedOption = {}, endDate, selectedEndWeek, secondPayrollId;
        if (indexOfSelected < (secondSelectOptions.length - 1)) {
            secondSelectedOption = secondSelectOptions[indexOfSelected + 1];
            let { date, label, value } = secondSelectedOption;
            endDate = date;
            selectedEndWeek = label;
            secondPayrollId = value;
        };
        this.setState({ secondSelectOptions, secondSelectedOption, endDate, selectedEndWeek, secondPayrollId });
    };

    render() {

        const { loading, startDate, endDate, firstSelectOptions, loader, secondSelectOptions, firstSelectedOption, secondSelectedOption } = this.state;

        const labelStyle = {
            color: 'black',
            bold: true,
            fontSize: '12px'
        }
        const formatGroupLabel = (data) => (
            <div >
                <span style={labelStyle}>{data.label}</span>
            </div>
        );
        return (
            <>
                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between table-header patient_hours">
                        <div className="filter-field d-flex align-items-center justify-content-between">
                            <label>Current Week</label>
                            <Select className="reactSelect"
                                onChange={(e) => this.handleStartWeekChanges(e)}
                                value={firstSelectedOption}
                                options={firstSelectOptions}
                                formatGroupLabel={formatGroupLabel}
                            >

                            </Select>
                            <div className="filter-field d-flex">
                                <label>Compare to week</label>
                                <Select className="reactSelect"
                                    onChange={(e) => this.handlePreviousWeekChanges(e)}
                                    options={secondSelectOptions}
                                    value={secondSelectedOption}
                                >
                                </Select>
                            </div>

                            <button className="mla fs12 primary mini" onClick={this.submit} disabled={loading}>
                                {loading && (<Loader id="loader-patient"></Loader>)}
                                {loading ? <span>Loading data </span> : <span>Go</span>}
                            </button>
                        </div>
                    </div>
                    {loader && (<Grid
                        columnDefs={this.columnDefs}
                        rowModelType='serverSide'
                        onGridReady={this.onGridReady}
                        height='600px'
                    >
                    </Grid>)}

                </div>
            </>
        )
    }
}
const mapStateToProps = ({ USER, GET_PATIENT_HOUR, PayrollDetail, defaultEins }) => {
    const { PATIENT_HOURS, COORDINATOR, EINS, SYNC_PH } = GET_PATIENT_HOUR;
    return { USER, PATIENT_HOURS, COORDINATOR, EINS, SYNC_PH, PayrollDetail, defaultEins }
};

export default connect(mapStateToProps, {
    patientHoursAction,
    coordinatorAction,
    EinsHourAction,
    getSyncPatientHourReport,
    payrollDetailAction,
})(PatientHoursView);
