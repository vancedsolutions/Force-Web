import React, { useState, useEffect } from "react";
import { get } from 'axios';
import Loader from "../../../components/loader/Loader";
import './billingDiscrepancy.scss';
import ReactTooltip from 'react-tooltip';
import { isObject, isArray } from "lodash";
import { connect } from "react-redux";
import XLSX from 'xlsx';

const BillingDiscrepancyReport = props => {
    const [loading, setLoading] = useState();
    const [report, reportState] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    async function getReport() {
        setLoading(true);
        let reportData = await get('/api/billing-services/discrepancy-report', {
            headers: {
                authentication: props.USER.token
            }
        }).catch(e => e);
        reportState(reportData?.data || []);
        setFilteredReport((reportData?.data || []).filter(e => !!e));
        setLoading(false);
    };

    useEffect(() => {
        getReport();
    }, []);

    function searchAll(text) {
        let searchRgx = new RegExp((text || /.+/), 'i');
        let searched = report.filter(client => {
            return searchRgx.test(JSON.stringify(client))
        });
        setFilteredReport(searched);
    }

    function exportToExcel() {
        let transformedData = transformDataForExport(filteredReport);
        let ws = XLSX.utils.json_to_sheet(transformedData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Discrepancy Report");
        XLSX.writeFile(wb, "Billing_Discrepancy.xlsx");
    }

    function transformDataForExport(data) {
        return data.reduce((list, company) => {
            let { companyName, shortName } = company;
            for (let serviceName in company) {
                if (isObject(company[serviceName]) && !isArray(company[serviceName])) {
                    list.push({
                        shortName,
                        companyName,
                        serviceName,
                        enabled: company[serviceName].enabled,
                        billed: company[serviceName].billed
                    });
                };
            };
            return list;
        }, []);
    };

    return (<div className="df ffc wp_report_page">
        <div className="df download_actns">
            <div className="mla">
                <button onClick={exportToExcel} disabled={loading} className="export_btn" title="export to excel"></button>
            </div>
        </div>

        <div className="df filters_wrpr">
            <input type="text" disabled={loading} onChange={(e) => searchAll(e.target.value)}></input>
        </div>
        {loading ? (
            <div className="table_wrpr">
                <Loader></Loader>
            </div>
        ) : (
            <div
                className="table_wrpr w75"
            >
                <div className="client_header align-items-center df justify-content-between" >
                    <div className="header"></div>
                    <div className="client_block_outer">
                        <div className="df fww acse client_block justify-content-between">
                            <h5 className="lw_clc_3 fwm">Service</h5>
                            <h5 className="lw_clc_3 fwm">Enabled</h5>
                            <h5 className="lw_clc_3 fwm">Billed</h5>
                        </div>
                    </div>
                </div>

                <div className="client_block_scroll">
                    {filteredReport?.map((client) => {
                        return (<div className="client_wrpr align-items-center df justify-content-between" key={client.shortName}>
                            <div className="header">
                                <h4 className="client_hdr">{client.shortName}</h4>
                                <h4 className="client_hdr">{client.companyName}</h4>
                            </div>
                            <div className="client_block_outer">


                                <div className="client_block">

                                    {Object.keys(client).sort().map(key => {
                                        return (
                                            isObject(client[key]) && (client[key].enabled != client[key].billed) && <div key={`${client.companyId}-${key}`} className="df fww acse w100 line_padding justify-content-between">
                                                <p className="lw_clc_3">{key}</p>
                                                <p className={`lw_clc_3 ${client[key].enabled ? "green" : "red"}`}></p>
                                                <p className={`lw_clc_3 ${client[key].billed ? "green" : "red"}`}
                                                    data-tip={client[key].billed ? `Billed Services: <br/>${client[key].billedServices.join("<br/>")}` : ""}
                                                    data-for={`${client.companyId}-${key}-tt`}
                                                    data-multiline="true"
                                                ></p>
                                                <ReactTooltip id={`${client.companyId}-${key}-tt`} />
                                            </div>

                                        )
                                    })}
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
        )}
    </div>)

}


const mapStateToProps = ({ USER }) => ({ USER });
export default connect(mapStateToProps, {})(BillingDiscrepancyReport);
