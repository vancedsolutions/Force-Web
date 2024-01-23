import React, { Component } from 'react'
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../components/grid";
import { getEmailHistory } from "../../../store/actions";
import moment from "moment";

class HistoryView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    companyShortName: null,
    columnDefs: [
      {
        headerName: "Client Name ",
        field: "clientName",
        filter: false,
        width: 160,
        flex: 1,
      },
      {
        headerName: "Created",
        field: "createdAt",
        resizable: true,
        flex: 1,
        filter: false,
        valueFormatter: params => params.value ? moment(params.value).format('L LT') : ""
      },
      {
        headerName: "Report",
        field: "reportName",
        filter: false,
        flex: 1,
      },
      {
        headerName: "Email Addresses",
        field: "clientLength",
        filter: false,
        flex: 1,
      },

    ],
    rowData: [],
    searchText: '',
  };
  emailPayload = {};


  onGridReady = params => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    let dataSource = {
      getRows: async (params) => {
        this.emailPayload.startRow = params.startRow;
        this.emailPayload.endRow = params.endRow;
        this.emailPayload.searchText = this.state.searchText;
        this.emailPayload.sortColumn = params.sortModel.length ? params.sortModel[0]['colId'] : "reportName";
        this.emailPayload.sortType = params.sortModel.length ? params.sortModel[0]['sort'] : "asc";
        this.emailPayload.companyShortName = this.state.companyShortName;
        // use redux..
        this.gridApi.showLoadingOverlay();

        getEmailHistory(this.emailPayload).then(summeryReport => {
          this.gridApi.hideOverlay();
          if (!summeryReport.length) {
            this.gridApi.showNoRowsOverlay();
          } else {
            summeryReport.forEach(element => {
              if (element.sendToEmail?.hasOwnProperty('client')) {
                element.clientName = element.sendToEmail['client']
                element.clientLength = element.sendToEmail?.sendTo
              }
            });
            return params.successCallback(summeryReport, summeryReport.length);
          }
        });


      }
    }
    params.api.setDatasource(dataSource)
  }
  searchInput = (e) => {
    this.setState({ searchText: e.target.value });
    this.gridApi.purgeInfiniteCache();
    // this.gridApi.refreshInfiniteCache();
  }
  refreshGrid = () => {
    this.gridApi.refreshInfiniteCache();
  }
  componentDidMount() {
    this.setState({ companyShortName: this.props.USER.company })
  }
  render() {

    return (
      <>
        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
              <input type="text" placeholder="Search" autoComplete="off" onChange={(e) => this.searchInput(e)} />
            </div>
          </div>
          <div className="clients_grid">

            <Grid
              columnDefs={this.state.columnDefs}
              rowModelType='infinite'
              onGridReady={this.onGridReady}
              height='600px'
            >
            </Grid>
          </div>
        </div>

      </>
    )
  }
}

const mapStateToProps = ({ USER }) => ({ USER });
export default connect(mapStateToProps, {})(HistoryView);
