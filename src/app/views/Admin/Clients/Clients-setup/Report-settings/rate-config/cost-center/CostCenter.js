import React, { Component } from "react";
import moment from "moment";
import Select from "react-select";
import Axios from "axios";

class CostCenter extends Component {
  async componentDidMount() {
    this.getLinkedLocation();
  }

  state = {};

  getLinkedLocation = async () => {
    let rrr = await Axios.post(`api/wage-parity/wp-ll/${this.props.elem.id}`);

    this.setState({
      selected: rrr.data.data,
      // useDefault: rrr.data.data.useDefault
    });

    if (rrr.data.data) {
      let obj = await this.props.locationsList.filter((itm) => {
        return itm.value === rrr.data.data.locationId;
      });

      //   if (rrr.data.data.useDefault)
      this.props.handleLinkChange(
        { ...obj[0]||[] },
        this.props.i,
        this.props.elem.id
      );
    }
  };

  render() {
    return (
      <div
        className="location_line"
        key={this.props.i}
        style={{
          zIndex: this.props.selectOpen === this.props.i ? 1001 : "",
        }}
      >
        <div className="df acsa sec loc_sec">
          <p>{this.props.elem.name}</p>
          <span className="link_icon"></span>
          <div className="inpt_wrpr">
            <Select
              onMenuOpen={() => this.setState({ selectOpen: this.props.i })}
              onMenuClose={() => this.setState({ selectOpen: null })}
              value={
                this.props.lines[this.props.i] &&
                this.props.lines[this.props.i].selectedLocation
              }
              name={`i_${this.props.i}`}
              placeholder="Wage parity location"
              options={this.props.locationsList}
              onChange={(e) =>
                this.props.handleLinkChange(
                  e,
                  this.props.i,
                   this.props.elem.id
                  //   true
                )
              }
              isDisabled={
                this.props.elem.periods.filter((el) => el.date != null).length >
                  0
                  ? true
                  : false
              }
            />
          </div>
        </div>
        {/* {this.state.useDefault ? ( */}
        <div className="rates_table">
          <div className="df acsa rt_header line">
            <div className="sec ed ffmr fs10">Effective date</div>
            <div className="sec mw ffmr fs10">Minimum wage</div>
            <div className="sec wp ffmr fs10">Wage parity</div>
            <div className="sec wp ffmr fs10">WP Dis.</div>
          </div>
          {this.props.elem.periods.length > 0 &&
            this.props.elem.periods.map((period, idx) => {
              return (
                <div className="df acsa line" key={`${idx}_${this.props.i}`}>
                  <div className="sec ed ffmr fs10">
                    {moment(period.effectiveDate).format("MMM./DD/YYYY")}
                  </div>
                  <div className="sec mw ffmr fs10">
                    <>
                      $
                      {(period.amount &&
                        Number(period.amount.$numberDecimal).toFixed(2)) ||
                        ""}
                    </>
                  </div>
                  <div className="sec wp ffmr fs10">
                    $
                    {(period.wageParity &&
                      Number(period.wageParity.$numberDecimal).toFixed(2)) ||
                      ""}
                  </div>
                  <div className="sec wpd ffmr fs10">
                    {period.overrideWPDis === true ? (
                      <input
                        className="fs11"
                        type="text"
                        value={
                          (period.disbursementAmount &&
                            period.disbursementAmount.$numberDecimal) ||
                          ""
                        }
                        onChange={(e) =>
                          this.props.updateWPDis(
                            this.props.i,
                            idx,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>
                        $
                        {Number(
                        period.disbursementAmount.$numberDecimal
                      ).toFixed(2)}
                      </>
                    )}

                    <div className="df acc btn">
                      <input
                        className="edt_chckbx"
                        checked={period.overrideWPDis === true}
                        type="checkbox"
                        onChange={(e) =>
                          this.props.updateWPDis(
                            this.props.i,
                            idx,
                            e.target.checked
                          )
                        }
                      ></input>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <button className="btn reportBtn" onClick={() => this.props.submitLocation(this.props.i)}>
          Save
        </button>
      </div>
    );
  }
}

export default CostCenter;
