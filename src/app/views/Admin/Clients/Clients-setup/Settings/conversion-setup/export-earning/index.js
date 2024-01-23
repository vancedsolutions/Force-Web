
import React, { Component } from "react";
import { connect } from "react-redux";
import { getExportEarningCodeByCompanyId, exportEarningCode } from "../../../../../../../store/actions";

class ExportEarning extends Component {
  state = {
    editExportEarningKey: false
  };

  async componentDidMount() {
    await this.props.getExportEarningCodeByCompanyId(this.props.reportSettingsTab.settingsTab.isSelectedRowData._id);
    if (this.props.ExportEarningCode.length) {
      this.setState({ exportEarningCode: this.props.ExportEarningCode[0].exportEarningCode });
    } else {
      this.setState({ exportEarningCode: "" });
    }
  }


  async componentDidUpdate(prevProps) {
    if (!prevProps.ExportEarningCode.length && this.props.ExportEarningCode.length) {

      await this.props.getExportEarningCodeByCompanyId(this.props.reportSettingsTab.settingsTab.isSelectedRowData._id);
      if (this.props.ExportEarningCode.length) {
        this.setState({ exportEarningCode: this.props.ExportEarningCode[0].exportEarningCode });
      } else {
        this.setState({ exportEarningCode: "" });
      }
    }
  }

  updateExportEarningCode = e => this.setState({ exportEarningCode: e.target.value });

  render() {
    return (
      <div className="reportId ">

        {!this.state.editExportEarningKey ? (
          <div className="df align-items-center justify-content-between">
            <div className="reportIdField ExportEarning">

              Export Earning Code: {this.state.exportEarningCode}{" "}

            </div>
            <div className="reportIdField">
              <button className="btn reportBtn" onClick={() => this.setState({ editExportEarningKey: true })}>Edit</button>
            </div>
          </div>
        ) : (
          <div className="df align-items-center justify-content-between">
            <div className="reportIdField ExportEarning">
              <input type="text"
                value={this.state.exportEarningCode}
                onChange={this.updateExportEarningCode}
              />

            </div>
            <div className="reportIdField">
              <button className="btn reportBtn" onClick={async () => {
                await this.props.exportEarningCode({
                  companyId: this.props.reportSettingsTab.settingsTab.isSelectedRowData._id,
                  exportEarningCode: this.state.exportEarningCode,
                });

                this.setState({ editExportEarningKey: false });
              }}>Save</button>
            </div>

          </div>
        )

        }

      </div>
    );
  }
}

const mapStateToProps = ({ client, ExportEarningCode }) => ({ client, ExportEarningCode });
export default connect(mapStateToProps, { getExportEarningCodeByCompanyId, exportEarningCode })(ExportEarning);
