import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getEarningsCodes,
  setWageParityECS,
  getSavedEarningsCodes,
} from "../../../../../../store/actions";
import _ from "lodash";

//import scss
//import "./EarningsCodes.scss";
import Checkbox from "../../../../../../components/ui/inputs/checkbox/Checkbox";
import Loader from "../../../../../../components/loader/Loader";

class EarningsCodes extends Component {
  state = { loading: true, wp: [], bp: [], pp: [], pa: [] };

  async componentDidMount() {

    await this.props.getSavedEarningsCodes(this.props.reportParams.reportSettingsTab.isSelectedRowData.companyId);

    let earningCodeList = this.props.earningsCodes;
    let BP, WP, PP, PA;
    if (!this.props.savedEarningsCodes) {
      await earningCodeList.map((ec) => (ec.checked = false));
    } else {
      if (Object.keys(this.props.savedEarningsCodes).length && Object.keys(earningCodeList).length) {
        WP = await earningCodeList.map((ec) => {
          return {
            ...ec,
            checked: _.includes(this.props.savedEarningsCodes.wp, ec.id),
          };
        });

        BP = await earningCodeList.map((ec) => {
          return {
            ...ec,
            checked: _.includes(this.props.savedEarningsCodes.bp, ec.id),
          };
        });

        PP = await earningCodeList.map((pp) => {
          return {
            ...pp,
            checked: _.includes(this.props.savedEarningsCodes.pp, pp.id),
          };
        });

        PA = await earningCodeList.map((pa) => {
          return {
            ...pa,
            checked: _.includes(this.props.savedEarningsCodes.pa, pa.id),
          };
        });
      }

    }


    this.setState({
      wp: WP || earningCodeList,
      bp: BP || earningCodeList,
      pp: PP || earningCodeList,
      pa: PA || earningCodeList,
      loading: false,
      id: this.props.reportParams.reportSettingsTab.isSelectedRowData.companyId,
    });
  }


  clickAction = (field, idx, checked) => {
    this.setState((prevState) => {

      if (field === "wp") {
        let tempWP = [...prevState.wp];
        let tempBP = [...prevState.bp];
        let tempPP = [...prevState.pp];

        let tempWpField = { ...tempWP[idx] };
        let tempBpField = { ...tempBP[idx] };
        let tempPpField = { ...tempPP[idx] };

        if (tempBpField.checked) tempBpField.checked = false;
        if (tempPpField.checked) tempPpField.checked = false;

        tempWpField.checked = !tempWpField.checked;

        tempWP[idx] = tempWpField;
        tempBP[idx] = tempBpField;
        tempPP[idx] = tempPpField;
        return { wp: tempWP, bp: tempBP, pp: tempPP };
      }

      if (field === "bp") {
        let tempBP = [...prevState.bp];
        let tempWP = [...prevState.wp];
        let tempPP = [...prevState.pp];

        let tempBpField = { ...tempBP[idx] };
        let tempWpField = { ...tempWP[idx] };
        let tempPpField = { ...tempPP[idx] };

        if (tempWpField.checked) tempWpField.checked = false;
        if (tempPpField.checked) tempPpField.checked = false;

        tempBpField.checked = !tempBpField.checked;

        tempBP[idx] = tempBpField;
        tempWP[idx] = tempWpField;
        tempPP[idx] = tempPpField;

        return { wp: tempWP, bp: tempBP, pp: tempPP };
      }

      if (field === "pp") {
        let tempBP = [...prevState.bp];
        let tempWP = [...prevState.wp];
        let tempPP = [...prevState.pp];

        let tempBpField = { ...tempBP[idx] };
        let tempWpField = { ...tempWP[idx] };
        let tempPpField = { ...tempPP[idx] };

        if (tempWpField.checked) tempWpField.checked = false;
        if (tempBpField.checked) tempBpField.checked = false;

        tempPpField.checked = !tempPpField.checked;

        tempBP[idx] = tempBpField;
        tempWP[idx] = tempWpField;
        tempPP[idx] = tempPpField;

        return { wp: tempWP, bp: tempBP, pp: tempPP };
      }

      if (field === "pa") {
        let tempBP = [...prevState.bp];
        let tempWP = [...prevState.wp];
        let tempPP = [...prevState.pp];
        let tempPA = [...prevState.pa];

        let tempBpField = { ...tempBP[idx] };
        let tempWpField = { ...tempWP[idx] };
        let tempPpField = { ...tempPP[idx] };
        let tempPaField = { ...tempPA[idx] };

        if (tempWpField.checked) tempWpField.checked = false;
        if (tempBpField.checked) tempBpField.checked = false;

        tempPaField.checked = !tempPaField.checked;

        tempBP[idx] = tempBpField;
        tempWP[idx] = tempWpField;
        tempPP[idx] = tempPpField;
        tempPA[idx] = tempPaField;

        return { wp: tempWP, bp: tempBP, pp: tempPP, pa: tempPA };
      }
    });
  };


  saveECS = () => {

    this.setState({ disabled: true });
    let filterdWP = this.state.wp
      .filter((wp) => wp.checked === true)
      .map((el) => el.id);

    let filterdBP = this.state.bp
      .filter((bp) => bp.checked === true)
      .map((el) => el.id);
    let filterdPP = this.state.pp
      .filter((pp) => pp.checked === true)
      .map((el) => el.id);
    let filterdPA = this.state.pa
      .filter((pa) => pa.checked === true)
      .map((el) => el.id);

    this.props.setWageParityECS({
      wp: filterdWP,
      bp: filterdBP,
      pp: filterdPP,
      pa: filterdPA,
      companyId: this.state.id,
    });
  };

  render() {
    return (
      <>
        {!this.state.loading ? (
          <div className="over_scroll">
            <div className="ec_setup_cntnt">
              <div className="list_wrpr">
                <div className="df hdr_line">
                  <h5 className="ec_sec">Earnings code</h5>
                  <h5 className="swp_sec">
                    Wage Parity
                    {this.state.wp.length > 0 && (
                      <span>
                        ({this.state.wp.filter((wp) => wp.checked).length})
                      </span>
                    )}
                  </h5>
                  <h5 className="bp_sec">
                    Benefit Pay{" "}
                    {this.state.bp.length > 0 && (
                      <span>
                        ({this.state.bp.filter((bp) => bp.checked).length})
                      </span>
                    )}
                  </h5>

                  <h5 className="bp_sec">
                    Premium Pay{" "}
                    {this.state.pp.length > 0 && (
                      <span>
                        ({this.state.pp.filter((pp) => pp.checked).length})
                      </span>
                    )}
                  </h5>

                  <h5 className="bp_sec">
                    Paid Accruals{" "}
                    {this.state.pa.length > 0 && (
                      <span>
                        ({this.state.pa.filter((pa) => pa.checked).length})
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
                              key={`wp_${i}`}
                              checked={this.state.wp[i].checked}
                              id={`wp_${i}`}
                              clickAction={this.clickAction}
                              value={i}
                              field="wp"
                            ></Checkbox>
                          </div>

                          <div className="bp_sec">
                            <Checkbox
                              key={`bp_${i}`}
                              checked={this.state.bp[i].checked}
                              id={`bp_${i}`}
                              clickAction={this.clickAction}
                              value={i}
                              field="bp"
                            ></Checkbox>
                          </div>
                          <div className="bp_sec">
                            <Checkbox
                              key={`pp_${i}`}
                              checked={this.state.pp[i].checked}
                              id={`pp_${i}`}
                              clickAction={this.clickAction}
                              value={i}
                              field="pp"
                            ></Checkbox>
                          </div>

                          <div className="bp_sec">
                            <Checkbox
                              key={`pa_${i}`}
                              checked={this.state.pa[i].checked}
                              id={`pa_${i}`}
                              clickAction={this.clickAction}
                              value={i}
                              field="pa"
                            ></Checkbox>
                          </div>
                        </div>
                      ))
                    )
                  }

                </div>
              </div>

              <div className="df acsa jcfe ftr">
                <button
                  disabled={!Object.keys(this.props.earningsCodes).length}
                  className="btn reportBtn"
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
}) => ({
  earningsCodes,
  client,
  clients,
  savedEarningsCodes,
});
export default connect(mapStateToProps, {
  getEarningsCodes,
  setWageParityECS,
  getSavedEarningsCodes,
})(EarningsCodes);
