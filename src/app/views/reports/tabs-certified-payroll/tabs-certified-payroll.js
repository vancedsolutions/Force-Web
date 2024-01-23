import React, { Component } from 'react'
import 'react-tabs/style/react-tabs.css';
import { getCPReport, getLatestPayrollsNew } from "../../../store/actions/reports/certifiedPayrollA";
import { getDefaultEINByCompanyID } from "../../../store/actions";
import { orderBy } from "lodash";
import { connect } from "react-redux";
import Select from "react-select";
class TabsCertifiedPayroll extends Component {
    constructor(props) {
        super(props);
        this.htmlReportTimeout = null;
        this.user = JSON.parse(localStorage.getItem("USER"))
    }

    getCompany() {
        let _company = this.user.company.toLowerCase();
        return _company === 'pcpayadmin' ? 'g3023' : _company;
    };

    getLastPayrolls = async () => {
        let data = await getLatestPayrollsNew(this.getCompany())
        //await this.props.getDefaultEINByCompanyID(this.getCompany());
        if (!data.data) {
            data.data = []
        }
        return data && data.data
    };

    runReport = async (company, payrollId, payrollName) => {

        this.setState({ loading: true, pdfUrl: undefined });
        let res = await getCPReport(company, payrollId, payrollName, this.user.token);
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));

        //window.open(url);
        this.setState({ loading: false, pdfUrl: url });
    }

    handleChanges = selectedOption => {
        this.setState({ selectedOption });
    };

    serializeUrl = params => {
        let str = "";
        for (let key in params) {
            if (str !== "") str += "&";
            else str += "?";
            str += key + "=" + encodeURIComponent(params[key]);
        };
        return str;
    }


    state = {
        loading: true,
        selectOptions: []
    };

    async componentDidMount() {
        const SelectOptions = await this.getLastPayrolls();
        //const defaultEins = this.props.defaultEins;
        let selectOptions = orderBy(SelectOptions.reduce((memo, payroll) => {
            //if (payroll["Payroll Name"].includes(defaultEins?.CompanyEIN))
            memo.push({
                label: payroll["Payroll Name"],
                value: payroll["Payroll System Id"],
                date: payroll["Pay Period End"]
            });
            return memo;
        }, []), elem => Date.parse(elem.date), "desc");

        this.setState({ selectOptions, loading: false });
    }
    render() {
        let { selectedOption, loading, pdfUrl } = this.state;
        if (!selectedOption) selectedOption = this.state.selectOptions[0];
        return (
            <div className="df ffc wp_report_page" style={{ height: "100%" }}>
                <div className="df download_actns">
                    <div className="mla"></div>
                </div>
                {!loading ?
                    (<div className="df filters_wrpr mb-5">
                        <div style={{ height: "38px", width: '250px' }}>
                            <Select

                                options={this.state.selectOptions}
                                value={selectedOption}
                                onChange={this.handleChanges}>
                            </Select>

                        </div>

                        <div className="df mla">
                            <button
                                className="ttuc fs12 primary"
                                disabled={!this.state.selectOptions}
                                onClick={() => {
                                    this.runReport(this.getCompany(), selectedOption.value, selectedOption.label);
                                }}
                            >
                                Run
                            </button>
                        </div>
                    </div>

                    ) : (

                        <div style={{ textAlign: "center", top: '138px' }}>
                            <h3>Preparing your report...</h3>
                            <h4>Please wait...</h4>
                            <div className="ec_setup_cntnt df acc loading">
                                {/*<Loader></Loader>*/}
                            </div>
                        </div>

                    )}
                {!loading && pdfUrl && <object data={pdfUrl} width="100%" height="100%"></object>}
                {!loading && !pdfUrl && <div className="df acc table_wrpr">
                    <p style={{ fontSize: "24px", marginBottom: "150px" }}>
                        Please click run to generate the report
                    </p>
                </div>}
            </div>
        );
    }
}

const mapStateToProps = ({ USER, defaultEins }) => ({ USER, defaultEins });

export default connect(mapStateToProps, {
    getDefaultEINByCompanyID
})(TabsCertifiedPayroll);