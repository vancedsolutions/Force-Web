import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getConversionTools,
  saveECS,
  setWageParityECS,
  getSavedConversionTools,
} from "../../../../../../../store/actions";
import _ from "lodash";
//import scss
import "./earningcode.scss";
import Checkbox from "../../../../../../../components/ui/inputs/checkbox/Checkbox";
import Loader from "../../../../../../../components/loader/Loader";
class EarningCode extends Component {
  state = {
    loading: true,
    counts: { regular: 0, overTime: 0, exclude: 0 },
    wp: [], bp: [], pp: [], pa: []
  };

  async componentDidMount() {
    await this.props.getConversionTools(this.props.reportSettingsTab.settingsTab.isSelectedRowData._id);
    await this.props.getSavedConversionTools(this.props.reportSettingsTab.settingsTab.isSelectedRowData.companyId);
    let BP, WP, PP, PA;
    if (!this.props.savedEarningsCodes) {
      await this.props.earningsCodes.map((ec) => (ec.checked = false));
    } else {

      WP = await this.props.earningsCodes.map((ec) => {
        return {
          ...ec,
          checked: _.includes(this.props.savedEarningsCodes.wp, ec.id),
        };
      });

      BP = await this.props.earningsCodes.map((ec) => {
        return {
          ...ec,
          checked: _.includes(this.props.savedEarningsCodes.bp, ec.id),
        };
      });

      PP = await this.props.earningsCodes.map((pp) => {
        return {
          ...pp,
          checked: _.includes(this.props.savedEarningsCodes.pp, pp.id),
        };
      });

      PA = await this.props.earningsCodes.map((pa) => {
        return {
          ...pa,
          checked: _.includes(this.props.savedEarningsCodes.pa, pa.id),
        };
      });
    }

    this.setState({
      wp: WP || this.props.earningsCodes,
      bp: BP || this.props.earningsCodes,
      pp: PP || this.props.earningsCodes,
      pa: PA || this.props.earningsCodes,
      loading: false,
      id: this.props.reportSettingsTab.settingsTab.isSelectedRowData._id,
    });

    this.setCounters();
  }
  updations = {};
  setCounters = () => {
    this.setState({
      counts: {
        regular: (_.filter(this.props.earningsCodes, { regular: true })).length,
        overTime: (_.filter(this.props.earningsCodes, { overTime: true })).length,
        exclude: (_.filter(this.props.earningsCodes, { exclude: true })).length,
      }
    })
  }
  clickAction = (field, value, state, index) => {

    this.props.earningsCodes[index].regular = false;
    this.props.earningsCodes[index].overTime = false;
    this.props.earningsCodes[index].exclude = false;


    this.props.earningsCodes[index][field] = state;

    this.updations[this.props.earningsCodes[index]['_id']] = this.props.earningsCodes[index];
    this.setCounters();
    this.setState({});
  };

  saveECS = async () => {

    await this.props.saveECS(this.updations);
  }
  handelChange = async (e, index) => {
    this.props.earningsCodes[index].externalId = e.target.value;
    this.updations[this.props.earningsCodes[index]['_id']] = this.props.earningsCodes[index]
    this.setState({})
  }
  handelAbbreviationChange = async (e, index) => {
    this.props.earningsCodes[index].abbreviation = e.target.value;
    this.updations[this.props.earningsCodes[index]['_id']] = this.props.earningsCodes[index]
    this.setState({})
  }

  render() {
    return (
      <>
        {!this.state.loading ? (
          <>
            <div className="over_scroll">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Earnings code</th>
                    <th>Abbreviation</th>
                    <th>External ID</th>
                    <th> Regular{" "}  <span>
                      ({this.state.counts.regular})
                    </span></th>
                    <th> Over Time{" "}
                      <span>
                        ({this.state.counts.overTime})</span></th>
                    <th>  Excluded{" "}
                      <span>
                        ({this.state.counts.exclude})
                      </span> </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (Object.keys(this.props.earningsCodes).length ? true : false) && (
                      this.props.earningsCodes.map((ec, i) => (

                        <tr key={`ec_${i}`}>
                          <td>{ec.name}</td>
                          <td>
                            <span>{ec.abbreviation}</span>
                            {/* <input type="text"
                        value={ec.abbreviation}
                        onChange={(val) => this.handelAbbreviationChange(val, i)} disabled>
                      </input> */}
                          </td>
                          <td>
                            <span>{ec.externalId}</span>
                            {/* <input type="text"
                        value={ec.externalId}
                        onChange={(val) => this.handelChange(val, i)} disabled>
                      </input> */}
                          </td>
                          <td><Checkbox
                            key={`wp_${i}`}
                            checked={ec.regular}
                            id={`wp_${i}`}
                            clickAction={(f, v, s) => this.clickAction(f, v, s, i)}
                            field="regular"
                          ></Checkbox></td>
                          <td> <Checkbox
                            key={`bp_${i}`}
                            checked={ec.overTime}
                            id={`bp_${i}`}
                            clickAction={(f, v, s) => this.clickAction(f, v, s, i)}
                            field="overTime"
                          ></Checkbox></td>
                          <td><Checkbox
                            key={`pp_${i}`}
                            checked={ec.exclude}
                            id={`pp_${i}`}
                            clickAction={(f, v, s) => this.clickAction(f, v, s, i)}
                            field="exclude"
                          ></Checkbox></td>
                        </tr>
                      )))}
                </tbody>
              </table>

            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button style={{ 'marginTop': '15px' }}
                disabled={!Object.keys(this.props.earningsCodes).length}
                className="btn reportBtn"
                onClick={() => this.saveECS()}
              >
                Save
              </button>
            </div>
          </>
        ) : <div className="ec_setup_cntnt df acc loading">
          <Loader></Loader>
        </div>}
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
  getConversionTools,
  saveECS,
  setWageParityECS,
  getSavedConversionTools,
})(EarningCode);
