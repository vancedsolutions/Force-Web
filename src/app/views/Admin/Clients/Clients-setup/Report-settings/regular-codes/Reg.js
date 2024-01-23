import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getEarningsCodes,
  getClient,
  setCertifiedECS,
  getSavedEarningsCodes,
} from "../../../../../../store/actions";
import _ from "lodash";

//import scss
import "./Reg.scss";
import Checkbox from "../../../../../../components/ui/inputs/checkbox/Checkbox";
import Loader from "../../../../../../components/loader/Loader";
import Axios from "axios";
class CPEC extends Component {
  state = {
    loading: true,
    rg: [],
    ot: [],
    PTOstate: [],
    holidayRG: [],
    holidayOT: [],
  };

  async componentDidMount() {

    // await this.props.getEarningsCodes(this.props.EDIT_CLIENT_DATA?.companyId);
    // await this.props.getSavedEarningsCodes(this.props.match.params.id);
    let savedEarningsCodesData = await Axios.post(
      `/api/certified-payroll/earnings-codes/${this.props.EDIT_CLIENT_DATA?.companyId}`
    ).catch(e => e);
    let savedEarningsCodes = _.pick(savedEarningsCodesData.data, "regRG", "regOT");
    let RG, OT, PTOlocal, HORG, HOOT;
    if (!savedEarningsCodes) {
      Object.keys(this.props.earningsCodes).map((ec) => (ec.checked = false));
    } else {
      if (Object.keys(this.props.earningsCodes).length) {
        // let ecObject = _.groupBy(this.props.earningsCodes, )
        RG = this.props.earningsCodes.map((ec) => {
          return {
            ...ec,
            checked: _.includes(savedEarningsCodes.regRG, ec.id),
          };
        });
        OT = this.props.earningsCodes.map((ec) => {
          return {
            ...ec,
            checked: _.includes(savedEarningsCodes.regOT, ec.id),
          };
        });

        PTOlocal = this.props.earningsCodes.map((ec) => {
          return {
            ...ec,
            checked: _.includes(savedEarningsCodes.PTOstate, ec.id),
          };
        });

        HORG = this.props.earningsCodes.map((ec) => {
          return {
            ...ec,
            checked: _.includes(savedEarningsCodes.holidayRG, ec.id),
          };
        });

        HOOT = this.props.earningsCodes.map((ec) => {
          return {
            ...ec,
            checked: _.includes(savedEarningsCodes.holidayOT, ec.id),
          };
        });
      }
    }

    //function mapCodes(earningCodes, )



    this.setState({
      rg: RG || this.props.earningsCodes,
      ot: OT || this.props.earningsCodes,
      holidayRG: HORG || this.props.earningsCodes,
      holidayOT: HOOT || this.props.earningsCodes,
      PTOstate: PTOlocal || this.props.earningsCodes,

      loading: false,
      id: this.props.EDIT_CLIENT_DATA?.companyId,
    });
  }

  /**
   * TODO: REFACTORING ASAP!!
   * @param {*} field 
   * @param {*} idx 
   * @param {*} checked 
   */
  clickAction = (field, idx, checked) => {
    this.setState((prevState) => {

      let tempRG = [...prevState.rg];
      let tempOT = [...prevState.ot];
      let tempHolRG = [...prevState.holidayRG];
      let tempHolOT = [...prevState.holidayOT];
      let tempPTO = [...prevState.PTOstate];

      let tempRgField = { ...tempRG[idx] };
      let tempOtField = { ...tempOT[idx] };
      let tempHolRgField = { ...tempHolRG[idx] };
      let tempHolOtField = { ...tempHolOT[idx] };
      let tempPTOField = { ...tempPTO[idx] };

      if (field === "rg") {

        if (tempOtField.checked) tempOtField.checked = false;
        if (tempHolRgField.checked) tempHolRgField.checked = false;
        if (tempHolOtField.checked) tempHolOtField.checked = false;
        if (tempPTOField.checked) tempPTOField.checked = false;

        tempRgField.checked = !tempRgField.checked;

        tempRG[idx] = tempRgField;
        tempOT[idx] = tempOtField;
        tempHolRG[idx] = tempHolRgField;
        tempHolOT[idx] = tempHolOtField;
        tempPTO[idx] = tempPTOField;

        return {
          rg: tempRG,
          ot: tempOT,
          holidayRG: tempHolRG,
          holidayOT: tempHolOT,
          PTOstate: tempPTO,
        };
      }

      if (field === "ot") {

        if (tempRgField.checked) tempRgField.checked = false;
        if (tempHolRgField.checked) tempHolRgField.checked = false;
        if (tempHolOtField.checked) tempHolOtField.checked = false;
        if (tempPTOField.checked) tempPTOField.checked = false;

        tempOtField.checked = !tempOtField.checked;

        tempRG[idx] = tempRgField;
        tempOT[idx] = tempOtField;
        tempHolRG[idx] = tempHolRgField;
        tempHolOT[idx] = tempHolOtField;
        tempPTO[idx] = tempPTOField;

        return {
          rg: tempRG,
          ot: tempOT,
          holidayRG: tempHolRG,
          holidayOT: tempHolOT,
          PTOstate: tempPTO,
        };
      }

      if (field === "pto") {
        if (tempRgField.checked) tempRgField.checked = false;
        if (tempHolRgField.checked) tempHolRgField.checked = false;
        if (tempHolOtField.checked) tempHolOtField.checked = false;
        if (tempOtField.checked) tempOtField.checked = false;

        tempPTOField.checked = !tempPTOField.checked;

        tempRG[idx] = tempRgField;
        tempOT[idx] = tempOtField;
        tempHolRG[idx] = tempHolRgField;
        tempHolOT[idx] = tempHolOtField;
        tempPTO[idx] = tempPTOField;

        return {
          rg: tempRG,
          ot: tempOT,
          holidayRG: tempHolRG,
          holidayOT: tempHolOT,
          PTOstate: tempPTO,
        };
      }

      if (field === "hol_rg") {

        if (tempRgField.checked) tempRgField.checked = false;
        if (tempHolOtField.checked) tempHolOtField.checked = false;
        if (tempOtField.checked) tempOtField.checked = false;
        if (tempPTOField.checked) tempPTOField.checked = false;

        tempHolRgField.checked = !tempHolRgField.checked;

        tempRG[idx] = tempRgField;
        tempOT[idx] = tempOtField;
        tempHolRG[idx] = tempHolRgField;
        tempHolOT[idx] = tempHolOtField;
        tempPTO[idx] = tempPTOField;

        return {
          rg: tempRG,
          ot: tempOT,
          holidayRG: tempHolRG,
          holidayOT: tempHolOT,
          PTOstate: tempPTO,
        };
      }

      if (field === "hol_ot") {

        if (tempRgField.checked) tempRgField.checked = false;
        if (tempHolRgField.checked) tempHolRgField.checked = false;
        if (tempOtField.checked) tempOtField.checked = false;
        if (tempPTOField.checked) tempPTOField.checked = false;

        tempHolOtField.checked = !tempHolOtField.checked;

        tempRG[idx] = tempRgField;
        tempOT[idx] = tempOtField;
        tempHolRG[idx] = tempHolRgField;
        tempHolOT[idx] = tempHolOtField;
        tempPTO[idx] = tempPTOField;

        return {
          rg: tempRG,
          ot: tempOT,
          holidayRG: tempHolRG,
          holidayOT: tempHolOT,
          PTOstate: tempPTO,
        };
      }
    });
  };

  saveECS = () => {
    this.setState({ disabled: true });
    let filterdRG = this.state.rg
      .filter((rg) => rg.checked === true)
      .map((el) => el.id);

    let filterdOT = this.state.ot
      .filter((ot) => ot.checked === true)
      .map((el) => el.id);

    let filterdPTO = this.state.PTOstate.filter(
      (pto) => pto.checked === true
    ).map((el) => el.id);

    let filterdHolRG = this.state.holidayRG
      .filter((horg) => horg.checked === true)
      .map((el) => el.id);

    let filterdHolOT = this.state.holidayOT
      .filter((hoot) => hoot.checked === true)
      .map((el) => el.id);

    this.props.setCertifiedECS({
      regRG: filterdRG,
      regOT: filterdOT,
      PTO: filterdPTO,
      holidayRG: filterdHolRG,
      holidayOT: filterdHolOT,
      companyId: this.state.id,
    });
  };
  render() {
    return (
      <>
        {!this.state.loading ? (
          <div className="over_scroll">
            <div className="ec_setup_cntnt reg">
              <div className="list_wrpr">
                <div className="df hdr_line">
                  <h5 className="ec_sec">Earnings code</h5>
                  <h5 className="swp_sec">
                    Regular Pay
                    {this.state.rg.length > 0 && (
                      <span>
                        ({this.state.rg.filter((rg) => rg.checked).length})
                      </span>
                    )}
                  </h5>
                  <h5 className="bp_sec">
                    Overtime{" "}
                    {this.state.ot.length > 0 && (
                      <span>
                        ({this.state.ot.filter((ot) => ot.checked).length})
                      </span>
                    )}
                  </h5>
                </div>

                <div className="inner_wrpr">
                  {
                    (Object.keys(this.props.earningsCodes).length ? true : false) && (
                      this.props.earningsCodes.map((ec, i) => (
                        <div key={`ec_${i}`} className="df acsa ec_line">
                          <div className="ec_sec">
                            <p title={ec.name}>{ec.name}</p>
                          </div>

                          <div className="swp_sec">
                            <Checkbox
                              key={`rg_${i}`}
                              checked={this.state.rg[i].checked}
                              id={`rg_${i}`}
                              clickAction={this.clickAction}
                              value={i}
                              field="rg"
                            ></Checkbox>
                          </div>

                          <div className="bp_sec">
                            <Checkbox
                              key={`ot_${i}`}
                              checked={this.state.ot[i].checked}
                              id={`ot_${i}`}
                              clickAction={this.clickAction}
                              value={i}
                              field="ot"
                            ></Checkbox>
                          </div>
                        </div>
                      )))}
                </div>
              </div>

              <div className="df acsa jcfe ftr">
                <button
                  // disabled={this.state.disabled}
                  className="ttuc primary mini"
                  onClick={() => this.saveECS()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="ec_setup_cntnt df acc loading">
            <Loader></Loader>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = ({
  earningsCodes,
  client,
  clients,
  savedEarningsCodes,
  EDIT_CLIENT_DATA,
}) => ({
  earningsCodes,
  client,
  clients,
  savedEarningsCodes,
  EDIT_CLIENT_DATA,
});
export default connect(mapStateToProps, {
  getEarningsCodes,
  getClient,
  setCertifiedECS,
  getSavedEarningsCodes,
})(CPEC);
