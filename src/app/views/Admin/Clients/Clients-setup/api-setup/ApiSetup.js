import React, { Component } from "react";
import { connect } from "react-redux";
import { updateClient, getClient } from "../../../../../store/actions";
import './style.scss';
class ApiSetup extends Component {
  state = {
    editApiKey: false
  };

  async componentDidMount() {
    if (this.props.GET_COMPANIES['records'].length) {
      let companyInfo = this.props.GET_COMPANIES['records'].filter(
        el => Number(el["companyId"]) === Number(this.props.reportSettingsTab.settingsTab.isSelectedRowData.companyId)
      )[0];
      await this.setState({
        client: companyInfo
      });
      await this.props.getClient(this.state.client["companyShortName"]);
      if (this.props.client) {
        this.setState({ apiKey: this.props.client.apiKey });
      } else {
        this.setState({ apiKey: "" });
      }
    }
  }

  async componentDidUpdate(prevProps) {

    if (!prevProps.GET_COMPANIES['records'].length && this.props.GET_COMPANIES['records'].length) {
      await this.setState({
        client: this.props.GET_COMPANIES['records'].filter(
          el => Number(el["companyId"]) === Number(this.props.reportSettingsTab.settingsTab.isSelectedRowData.companyId)
        )[0]
      });

      await this.props.getClient(this.state.client["companyShortName"]);
      if (this.props.client) {
        this.setState({ apiKey: this.props.client.apiKey });
      } else {
        this.setState({ apiKey: "" });
      }
    }
  }

  updateApiInput = e => this.setState({ apiKey: e.target.value });

  render() {
    return (
      <div className="api_sec inner_wrpr">
        <div className="reportTitle">

          {!this.state.editApiKey ? (
            <div className="df align-items-center justify-content-between">
              <p className="api_val">
                API Key :  {this.props.client && this.props.client.apiKey}{" "}
              </p>

              <button className="btn reportBtn" onClick={() => this.setState({ editApiKey: true })}>Edit</button>
            </div>
          ) : (
            <div className="df align-items-center justify-content-between">
              <div className="api_val">
                <input
                  type="text"
                  value={this.state.apiKey}
                  onChange={this.updateApiInput}
                />
              </div>
              <button className="btn reportBtn" onClick={async () => {
                await this.props.updateClient({
                  apiKey: this.state.apiKey,
                  shortName: this.state.client.companyShortName
                });
                this.setState({ editApiKey: false });
              }}>Save</button>


            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ client, GET_COMPANIES }) => ({ client, GET_COMPANIES });
export default connect(mapStateToProps, { updateClient, getClient })(ApiSetup);
