import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { get } from 'axios';
import Loader from "../../../components/loader/Loader";
import Select from 'react-select'
import { pick } from 'lodash';
import Grid from '../../../components/grid';
import { API } from '../../../utils/api';

const AccrualsReport = props => {
    const [loading, setLoading] = useState();
    const [report, reportState] = useState([]);
    const [aggregatedReport, updateAggregated] = useState([]);
    const [timeOffs, updateTimeOffs] = useState([]);
    const [eins, einsState] = useState([]);
    const [ein, updateEin] = useState("");

    async function getReport() {
        setLoading(true);
        let accrualsReport = await get(API.getAccruals, {
            params: {
                company: getCompany()
            }
        }).catch(e => e);
        let { report, timeOffs, eins } = accrualsReport?.data;
        timeOffs = timeOffs.map(t => ({
            name: t,
            selected: true
        }));
        updateTimeOffs(timeOffs);
        einsState(eins);
        updateEin(eins[0]);
        reportState(report);
        aggregateReport(report, timeOffs, eins[0]);
    };

    function getCompany() {
        let _company = JSON.parse(localStorage.getItem("USER")).company.toLowerCase();
        let company = _company === 'pcpayadmin' ? 'h3827' : _company;
        return company;
    }

    function handleTimeOffChange(timeOffs, idx) {
        timeOffs[idx].selected = !timeOffs[idx].selected;
        let selected = timeOffs.filter(t => t.selected === true);
        updateTimeOffs([...timeOffs]);
        aggregateReport(report, selected, ein);
    }

    function aggregateReport(report, selectedTimeOffs, ein) {
        setLoading(true);
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
        updateAggregated(_report);
        setLoading(false);
    };

    function filterReport(report, ein) {
        updateEin(ein);
        aggregateReport(report, timeOffs, ein);
    }

    useEffect(() => {
        getReport()
    }, []);

    return (
        <div className="df ffc wp_report_page">
            <div className="df filters_wrpr">
                {timeOffs.map((to, ix) => {
                    return (
                        <div className="filter_inpt_sec" key={ix}>
                            <label className="fs12 label">
                                {to.name}
                                <input type="checkbox"
                                    id={ix}
                                    checked={!!to.selected}
                                    onChange={e => handleTimeOffChange(timeOffs, ix, !!e.target.checked)}
                                ></input>
                            </label>
                        </div>
                    )
                })}
                <div className="filter_inpt_sec" style={{ width: '115px' }}>
                    <Select
                        options={eins.map(e => ({ value: e, label: e }))}
                        onChange={e => filterReport(report, e.value)}
                        value={{ value: ein, label: ein }}
                    ></Select>
                </div>
            </div>

            {loading ? (
                <div className="table_wrpr">
                    <Loader></Loader>
                </div>
            ) : (
                <div
                    className="table_wrpr"
                >
                    <div className="tbl_hdr_wrpr df acsa fs12" style={{ width: '64%' }}>
                        <p className="tal lw_clc_5">Last Name</p>
                        <p className="tal lw_clc_5">First Name</p>
                        <p className="tal lw_clc_5">Total Hours Remaining</p>
                        <p className="tal lw_clc_5">Total Hours Earned YTD</p>
                        <p className="tal lw_clc_5">Total Hours Taken YTD</p>
                    </div>
                    {
                        aggregatedReport.map((empl, idx) => {
                            return (
                                <div className="df w75 acsa" key={idx}>
                                    <p className="tal lw_clc_5">{empl.lastName}</p>
                                    <p className="tal lw_clc_5">{empl.firstName}</p>
                                    <p className="tal lw_clc_5">{empl.totalHoursRemaining.toFixed(2)}</p>
                                    <p className="tal lw_clc_5">{empl.totalHoursEarnedYtd.toFixed(2)}</p>
                                    <p className="tal lw_clc_5">{empl.totalHoursTakenYtd.toFixed(2)}</p>
                                </div>
                            )
                        })
                    }
                </div>
            )}
        </div>
    );
};

export default AccrualsReport;