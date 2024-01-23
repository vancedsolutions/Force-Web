import React, { useState, useEffect } from "react";
import { get } from 'axios';
import { API } from '../../../utils/api';
import Loader from "../../../components/loader/Loader";
import DatePicker from 'react-date-picker';
import moment from 'moment'
import { startCase } from 'lodash';
import './style.scss';

const ManagementOverview = props => {

    const [loading, setLoading] = useState();
    const [report, reportState] = useState({});
    const [startDate, updateStartDate] = useState(moment(new Date()).subtract(2, 'M').toDate());
    const [endDate, updateEndDate] = useState(new Date());
    const [searchText, searchInputText] = useState("");


    async function getReport(startDate, endDate) {
        setLoading(true);
        let mangeOverView = {};
        let MOReport = await get(API.getManagementOverviewReport, {
            params: {
                startDate,
                endDate
            }
        }).catch(e => e);

        
        let data = MOReport?.data || {};
        Object.keys(data).map(key => {
            mangeOverView[startCase(key)]= data[key] 
        })
        
        reportState(mangeOverView);
        setLoading(false);
    };

    function mapReport(report) {
        let _report = [];
        for (let key in report) {
            let o = getKeyVal(key, report[key]);
            _report.push(o);
        };
    };

    function getKeyVal(key, val) {
        let dispKey = startCase(key);
        if (Array.isArray(val)) return { [dispKey]: val.length };
        return { [dispKey]: val };
    };


    const searchInput = async (e) => {
        let dataChange = e.target.value
        searchInputText(dataChange)
      
    }

    useEffect(() => {
        getReport(startDate, endDate)
    }, []);




    return (
        <>

            <div className="table-header d-flex align-items-center justify-content-between">
                <h2 className="page_title">Report</h2>
            </div>

            <div className="shadow_white_box management-overview full-box mt-0">
            <div className=" filter-list d-flex align-items-center justify-content-between">
           
                <div className="filter-field d-flex">
                    <input type="text" placeholder="Search" autoComplete="off" onChange={searchInput} />
                </div>

                <div className="filter-field d-flex">
                <div className="filter-list d-flex align-items-center justify-content-between">
                    <div className="filter_inpt_sec">
                        <label className="fs12 label">From</label>
                        <DatePicker
                            disabled={loading}
                            value={startDate}
                            onChange={updateStartDate}
                            maxDate={endDate}
                        ></DatePicker>
                    </div>
                    <div className="filter_inpt_sec">
                        <label className="fs12 label">To</label>
                        <DatePicker
                            disabled={loading}
                            value={endDate}
                            onChange={updateEndDate}
                            maxDate={new Date()}
                            minDate={startDate}
                        ></DatePicker>
                    </div>
                    <div className="df mla">
                        <button
                            className="ttuc fs12 primary"
                            onClick={() => getReport(startDate, endDate)}
                            disabled={loading}>Run Report</button>
                    </div>

                </div>
                </div>
                </div>
              
                <div className="clients_grid mt-5 ">
                    {loading ? (
                        <div className="table_wrpr_management">
                            <Loader></Loader>
                        </div>
                    ) : (
                        <div
                            className="table_wrpr_management"
                        >
                            {mapReport(report)}
                                {Object.keys(report).filter(key => {
                                    let regex = new RegExp(searchText, 'i');
                                    return regex.test(key)
                            } ).map((key,i) => {
                                let dispKey = startCase(key);
                                return (
                                    <div className="w75" key={i}>
                                        <div className="w75_inner" key={dispKey} >
                                            <div className="fl">{dispKey}</div>
                                            <div className="fr"> {Array.isArray(report[key]) ?
                                                report[key].length :
                                                key.includes("Billing") ?
                                                    new Intl.NumberFormat('en-US',
                                                        { style: 'currency', currency: 'USD' }
                                                    ).format(report[key]) :
                                                    report[key]}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>

            </div>

        </>

    );
};

export default ManagementOverview;