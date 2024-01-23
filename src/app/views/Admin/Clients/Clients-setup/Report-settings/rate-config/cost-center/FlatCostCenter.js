import React, { Component } from "react";
import Select from "react-select";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { editClientData } from '../../../../../../../store/actions';
import "./FlatCostCenter.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class FlatCostCenter extends Component {
  state = { selectedLocation: undefined, ratesList: [], customRates: [] };
  async componentDidMount() {
    this.getLinkedLocation();
  }

  updateSelectedLocation = async (val) => {
    this.setState({ selectedLocation: val });
  };

  saveWageLocationID = async () => {
    let d = await Axios.post("/api/wage-parity/wp-setup", {
      clientId: this.props.EDIT_CLIENT_DATA?.companyId,
      flatLocationId: this.state.selectedLocation.value,
    });

    let res = await Axios.post(

      `/api/wage-setup/wage-locations-report/${d.data.data.flatLocationId}/${this.props.EDIT_CLIENT_DATA?.companyId}`
    );
    this.setState({ ratesList: res.data.data.rates });
  };
  getLinkedLocation = async () => {
    let d = await Axios.post(`/api/wage-parity/wp-setup/${this.props.EDIT_CLIENT_DATA?.companyId}`);

    if (!d.data.data.flatLocationId) return;
    let val = await _.find(this.props.locationsList, {
      value: d.data.data.flatLocationId,
    });

    this.setState({
      selectedLocation: val,
    });

    let res = await Axios.post(
      `/api/wage-setup/wage-locations-report/${d.data.data.flatLocationId}/${this.props.EDIT_CLIENT_DATA?.companyId}`
    );

    this.setState({
      ratesList: res.data.data.rates,
      flatLocationId: d.data.data.flatLocationId,
    });
  };

  setCustom = (e, idx) => {
    if (e.target.checked) {
      let checked = [...this.state.customRates];
      checked.push(idx);
      this.setState({ customRates: checked });
    } else {
      let checked = [...this.state.customRates];
      checked.splice(checked.indexOf(idx), 1);
      this.setState({ customRates: checked });
    }
  };

  updateDisAmount = (e, idx, dbAmount) => {
    let data = _.cloneDeep(this.state.ratesList);

    let hasOverride = data[idx][Object.keys(data[idx])[0]]
      .overrideDisbursementAmount
      ? true
      : false;

    data[idx].oldDisbursementAmount = !data[idx].oldDisbursementAmount
      ? dbAmount
      : data[idx].oldDisbursementAmount;
    data[idx][Object.keys(data[idx])[0]][
      hasOverride ? "overrideDisbursementAmount" : "globalDisbursementAmount"
    ] = e.target.value;

    this.setState({ ratesList: data });
  };

  saveCustom = async (idx) => {
    const { id } = this.props.EDIT_CLIENT_DATA?._id;

    let data = _.cloneDeep(this.state.ratesList);
    let currentObj = data[idx][Object.keys(data[idx])[0]];

    let hasOverride = currentObj.overrideDisbursementAmount ? true : false;

    let obj = {
      override: true,
      disbursementAmount: hasOverride
        ? currentObj.overrideDisbursementAmount
        : currentObj.globalDisbursementAmount,
      effectiveDate: currentObj.effectiveDate,
      location: currentObj.location,
      clientId: id,
      fromMinimumWageId: currentObj.fromMinimumWageId || currentObj._id,
      // costCenterId: this.state.lines[i].id,
      _id:
        currentObj.fromMinimumWageId !== undefined ? currentObj._id : undefined,
    };

    await this.props.addWageRate(obj, "custom");

    let res = await Axios.post(
      `/api/wage-setup/wage-locations-report/${this.state.flatLocationId}/${this.props.EDIT_CLIENT_DATA?.companyId}`
    );

    return this.setState({ ratesList: res.data.data.rates });
  };

  render() {
    return (
      <div
        className="location_line "
        key={this.props.i}
        style={{
          zIndex: this.props.selectOpen === this.props.i ? 1001 : "",
        }}
      ><div className="WPSavedReports reportId df align-items-center justify-content-between">
          <div className="reportIdField repordIDCS_wd_100">
            <Select
              value={this.state.selectedLocation}
              onChange={this.updateSelectedLocation}
              options={this.props.locationsList}
            ></Select>
          </div>
          <div className="reportIdField">
            <button
              className="btn reportBtn"
              disabled={!this.state.selectedLocation}
              onClick={this.saveWageLocationID}
            >
              Save
            </button>
          </div>

        </div>
        <div className="lines_wrpr">
          {this.state.ratesList.length ? (
            this.state.ratesList.map((rate, idx) => (
              <div className="df acsa line_wrpr" key={rate._id}>
                <p className="sec wp ffmr fs10">
                  {moment(Number(Object.keys(rate)[0])).format("MMM/DD/YYYY")}
                </p>
                <p className="sec wp ffmr fs10">
                  {Number(rate[Object.keys(rate)[0]].overrideAmount) ||
                    rate[Object.keys(rate)[0]].globalAmount}
                </p>

                <p className="sec wp ffmr fs10">
                  {Number(rate[Object.keys(rate)[0]].overrideWageParity) ||
                    rate[Object.keys(rate)[0]].globalWageParity}
                </p>

                <p className="df acsa sec wp wpdis ffmr fs10">
                  {/* {Number(
                    rate[Object.keys(rate)[0]].overrideDisbursementAmount
                  ) || rate[Object.keys(rate)[0]].globalDisbursementAmount} */}

                  {this.state.customRates.indexOf(idx) !== -1 ||
                    Number(
                      rate[Object.keys(rate)[0]].overrideDisbursementAmount
                    ) ? (
                    <>
                      <input
                        className="ffmr fs10"
                        type="text"
                        value={
                          Number(
                            rate[Object.keys(rate)[0]]
                              .overrideDisbursementAmount
                          )
                            ? rate[Object.keys(rate)[0]]
                              .overrideDisbursementAmount
                            : rate[Object.keys(rate)[0]]
                              .globalDisbursementAmount
                        }
                        onChange={(e) =>
                          this.updateDisAmount(
                            e,
                            idx,
                            Number(
                              rate[Object.keys(rate)[0]]
                                .overrideDisbursementAmount
                            )
                              ? rate[Object.keys(rate)[0]]
                                .overrideDisbursementAmount
                              : rate[Object.keys(rate)[0]]
                                .globalDisbursementAmount
                          )
                        }
                      />
                      {rate.oldDisbursementAmount &&
                        Number(
                          rate[Object.keys(rate)[0]].overrideDisbursementAmount
                        ) &&
                        rate[Object.keys(rate)[0]].overrideDisbursementAmount !==
                        rate.oldDisbursementAmount ? (
                        <button className="btn reportBtn" onClick={() => this.saveCustom(idx)}>
                          save
                        </button>
                      ) : undefined}

                      {/* {rate.oldDisbursementAmount &&
                      (Number(
                        rate[Object.keys(rate)[0]].overrideDisbursementAmount
                      ) ||
                        rate[Object.keys(rate)[0]].globalDisbursementAmount) !==
                        rate.oldDisbursementAmount ? (
                        <button onClick={() => this.saveCustom(idx)}>
                          save
                        </button>
                      ) : undefined} */}
                    </>
                  ) : (
                    <>
                      {Number(
                        rate[Object.keys(rate)[0]].overrideDisbursementAmount
                      ) || rate[Object.keys(rate)[0]].globalDisbursementAmount}
                    </>
                  )}
                  <input
                    checked={Number(
                      rate[Object.keys(rate)[0]].overrideDisbursementAmount
                    )}
                    className="mla"
                    type="checkbox"
                    onChange={(e) => this.setCustom(e, idx)}
                  ></input>
                </p>
              </div>


            ))
          ) : (
            <p>No rates found</p>
          )}
        </div>
      </div>
    );
  }
}




const mapStateToProps = ({ EDIT_CLIENT_DATA }) => ({ EDIT_CLIENT_DATA });
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    editClientData,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(FlatCostCenter)