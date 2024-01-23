import React, { Component, createRef } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import {
  getCostCenterByTreeIndex,
  clearCostCenters,
  addWageRate,
  getWPSetup,
  setupWP,
  getWageRatesPerLocation,
  wpLocationLink,
} from "../../../../../../store/actions";

//import scss
import "./RateConfig.scss";
import Axios from "axios";
import CostCenter from "./cost-center/CostCenter";
import FlatCostCenter from "./cost-center/FlatCostCenter";

const options = [
  { label: "1", value: "0" },
  { label: "2", value: "1" },
  { label: "3", value: "2" },
  { label: "4", value: "3" },
  { label: "5", value: "4" },
  { label: "6", value: "5" },
  { label: "7", value: "6" },
  { label: "8", value: "7" },
  { label: "9", value: "8" },
];

class RateConfig extends Component {
  constructor(props) {
    super(props);

    this.canvesRef = createRef();
  }
  state = {
    lines: [],
    ccIndex: undefined,
    locationsList: [],
    costCenter: undefined,
    showEdit: false,
    ratesType: undefined,
  };

  async componentDidMount() {
    const company = this.props['reportParams'].reportSettingsTab.isSelectedRowData;
    await this.props.getWPSetup(company.companyId);
    this.setState({ ratesType: this.props.WPSetup.ratesType || "detailed" });

    if (this.props.WPSetup.costCenterIndex && this.props.WPSetup.ratesType !== "flat") {

      await this.props.getCostCenterByTreeIndex(this.props.WPSetup.costCenterIndex, company.companyId);
      let data;

      // Functionality is not available for this company.
      if (
        this.props.GET_COST_CENTERS === "Cost Center not used." ||
        this.props.GET_COST_CENTERS ===
        "Functionality is not available for this company."
      ) {
        data = this.props.GET_COST_CENTERS;
      } else {
        data = await this.props.GET_COST_CENTERS?.map((cc) => {
          return { ...cc, periods: [] };
        });
      }

      this.setState({
        lines: data,
        ccIndex: this.props.WPSetup.costCenterIndex,
      });
    } else if (this.props.WPSetup.ratesType === "flat") {
    }

    let ll = await Axios.post("api/wage-setup/wage-locations-list");

    let list = await ll.data.data.map((line) => ({
      value: line._id,
      label: line.name,
    }));
    this.setState({ locationsList: list });
  }

  handleChange = async (value) => {
    const { companyId } = this.props['reportParams'].reportSettingsTab.isSelectedRowData;
    await this.props.getCostCenterByTreeIndex(value.value, companyId);

    let data;
    if (
      this.props.GET_COST_CENTERS === "Cost Center not used." ||
      this.props.GET_COST_CENTERS ===
      "Functionality is not available for this company."
    ) {
      data = this.props.GET_COST_CENTERS;
    } else {
      data = await this.props.GET_COST_CENTERS?.map((cc) => ({
        ...cc,
        useDefault: true,
        periods: [],
      }));
    }

    this.setState({ lines: data, ccIndex: value });
  };

  handleLocationLinkChange = async (location, i, costCenterId) => {
    let rates = await Axios.post(
      `api/wage-setup/wage-rate/${location.value}/${costCenterId ? costCenterId : ""}`
    );

    this.setState((prevState) => {
      let lines = prevState.lines;
      let line = lines[i];
      line.selectedLocation = location;
      line.periods = rates.data.data;
      return { lines };
    });
  };

  updateWPDis = (line, period, value) => {
    if (value === false) {
      this.setState((prevState) => {
        let linesCopy = [...prevState.lines];
        let lineCopy = { ...linesCopy[line] };
        let periodCopy = lineCopy.periods[period];
        periodCopy.overrideWPDis = false;
        lineCopy[period] = periodCopy;
        linesCopy[line] = lineCopy;
        return { linesCopy };
      });
    } else if (value === true) {
      this.setState((prevState) => {
        let linesCopy = [...prevState.lines];
        let lineCopy = { ...linesCopy[line] };
        let periodCopy = lineCopy.periods[period];
        periodCopy.overrideWPDis = true;
        lineCopy[period] = periodCopy;
        linesCopy[line] = lineCopy;
        return { linesCopy };
      });
    } else {

      this.setState((prevState) => {
        let linesCopy = [...prevState.lines];
        let lineCopy = { ...linesCopy[line] };
        let periodCopy = { ...lineCopy.periods[period] };
        periodCopy.disbursementAmount.$numberDecimal = value;
        lineCopy.periods[period] = periodCopy;
        linesCopy[line] = lineCopy;

        return { linesCopy };
      });
    }
    // overrideWPDis
  };

  submitLocation = (i, fromId) => {

    const { companyId } = this.props['reportParams'].reportSettingsTab.isSelectedRowData;



    this.state.lines[i].periods.map((period) => {
      let data = {
        override: true,
        disbursementAmount: period.disbursementAmount.$numberDecimal,
        effectiveDate: period.effectiveDate,
        location: period.location,
        clientId: companyId,
        fromMinimumWageId: period.fromMinimumWageId || period._id,
        costCenterId: this.state.lines[i].id,
        _id: period.fromMinimumWageId !== undefined ? period._id : undefined,

      };

      return this.props.addWageRate(data, "custom");
    });



    let linkData = {
      companyId: companyId,
      costCenterId: this.state.lines[i].id,
      locationId: this.state.lines[i].selectedLocation.value,
      // useDefault: this.state.lines[i].useDefault
    };

    this.props.wpLocationLink(linkData);
  };

  render() {
    return (
      <div className="RateConfig df ffc rc_content">
        <div className="df acsa type_wrpr">
          <p>Pay Type</p>
          <div className="df acsa inpt_wrpr">
            <label htmlFor="detailed">Detailed</label>
            <input
              type="radio"
              name="type"
              id="detailed"
              checked={this.state.ratesType === "detailed"}
              onChange={() => this.setState({ ratesType: "detailed" })}
            ></input>
          </div>
          <div className="df acsa inpt_wrpr">
            <label htmlFor="flat">Flat</label>
            <input
              type="radio"
              name="type"
              id="flat"
              checked={this.state.ratesType === "flat"}
              onChange={() => this.setState({ ratesType: "flat" })}
            ></input>
          </div>

          <div className="mla">
            <button className="btn reportBtn"
              onClick={() =>
                this.props.setupWP({
                  clientId: this.props['reportParams'].reportSettingsTab.isSelectedRowData.companyId,
                  ratesType: this.state.ratesType,
                })
              }
            >
              Save
            </button>
          </div>
        </div>

        {this.props.WPSetup.ratesType && (
          <>
            {(!this.props.WPSetup.costCenterIndex &&
              this.props.WPSetup.ratesType === "detailed") ||
              (this.state.showEdit &&
                this.props.WPSetup.ratesType === "detailed") ? (
              <div className="edit_cc_wrpr">
                <div className="df acsa cc_select_sec_wrpr">
                  <div className="ffmr fs12 lbl">Select your cost center:</div>
                  <div className="slct_wrpr">
                    <Select
                      placeholder="Select"
                      options={options}
                      value={this.state.ccIndex}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="df ffmr fs14  info_line">
                  <div className="lbl  fs12">Cost center: </div>
                  {this.state.lines === "Cost Center not used." ||
                    this.state.lines ===
                    "Functionality is not available for this company."
                    ? this.state.lines
                    : this.state.lines.length > 0 && this.state.lines[0].name}
                  <div className="mla">
                    <button className="btn reportBtn"
                      disabled={
                        !this.state.lines ||
                        (this.state.lines && !this.state.lines.length) ||
                        this.state.lines === "Cost Center not used." ||
                        this.state.lines ===
                        "Functionality is not available for this company."
                        // this.props.COST_CENTER ===
                        //   "Functionality is not available for this company."
                      }
                      onClick={async () => {
                        await this.props.setupWP({
                          clientId: this.props['reportParams'].reportSettingsTab.isSelectedRowData.companyId,
                          costCenterIndex: this.state.ccIndex['value'],
                        });

                        this.setState({ showEdit: false });
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {this.props.WPSetup.ratesType === "detailed" ? (
                  <p className="ffmr fs12 cc_name_wrpr">
                    Cost center:
                    <span className="val fs14">
                      {this.state.lines.length > 0 && this.state.lines[0].name}
                    </span>
                    <button className="btn reportBtn" onClick={() => this.setState({ showEdit: true })}>
                      Update
                    </button>
                  </p>
                ) : (
                  <>
                    {this.state.locationsList.length ? (
                      <FlatCostCenter
                        key={0}
                        i={0}
                        elem={[]}
                        lines={this.state.lines}
                        locationsList={this.state.locationsList}
                        handleLinkChange={this.handleLocationLinkChange}
                        submitLocation={this.submitLocation}
                        updateWPDis={this.updateWPDis}
                        addWageRate={this.props.addWageRate}
                      ></FlatCostCenter>
                    ) : undefined}
                  </>
                )}
              </>
            )}
            <div className="cc_list_wrpr">
              {this.props.WPSetup.ratesType !== "flat" && this.state.lines.length > 0 &&
                this.state.lines !== "Cost Center not used." &&
                this.state.lines !==
                "Functionality is not available for this company." && (
                  <div className="list_wrpr">
                    {this.state.lines.map(
                      (line, i) =>
                        i > 0 &&
                        i < 300 &&
                        this.state.locationsList.length > 0 && (
                          <CostCenter
                            key={i}
                            i={i}
                            elem={line}

                            lines={this.state.lines}
                            locationsList={this.state.locationsList}

                            handleLinkChange={this.handleLocationLinkChange}
                            submitLocation={this.submitLocation}

                            updateWPDis={this.updateWPDis}
                          ></CostCenter>
                        )
                    )}
                  </div>
                )}
            </div>{" "}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ COST_CENTERS, WPSetup, user }) => {
  const { GET_COST_CENTERS } = COST_CENTERS;
  return {
    GET_COST_CENTERS,
    WPSetup,
    user,
  };
}

export default connect(mapStateToProps, {
  getCostCenterByTreeIndex,
  clearCostCenters,
  addWageRate,
  getWPSetup,
  setupWP,
  getWageRatesPerLocation,
  wpLocationLink,
})(RateConfig);
