import React, { Component } from 'react'
import { connect } from "react-redux";
import { getAnnualBillingSettings, saveAnnualBillingSettings } from '../../../../../store/actions';

class SettingsView extends Component {

  state = { reportSettings: {} };

  componentDidMount = async () => {
    await this.props.getAnnualBillingSettings();
    this.setState({ reportSettings: this.props.GET_ANNUAL_BILLING_SETTINGS });
    console.log(this.state);
  };

  saveSettings = async (data) => {
    return this.props.saveAnnualBillingSettings(data)
  }

  render() {

    let { reportSettings } = this.state;
    return (
      <>
        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
            </div>


          </div>
          <div className="clients_grid">
            <input type="number" value={reportSettings.einCharge} placeholder="EIN Charge"></input>
            <button onClick={async () => this.saveSettings(reportSettings)}>Save</button>
          </div>

        </div>

      </>
    )
  }
}


const mapStateToProps = ({ REPORT_SETTINGS }) => {
  const { GET_ANNUAL_BILLING_SETTINGS, UPDATE_ANNUAL_BILLING_SETTINGS } = REPORT_SETTINGS;
  return { GET_ANNUAL_BILLING_SETTINGS, UPDATE_ANNUAL_BILLING_SETTINGS };
};
export default connect(mapStateToProps, { getAnnualBillingSettings, saveAnnualBillingSettings })(SettingsView);
