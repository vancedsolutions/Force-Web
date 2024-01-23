import React, { Component } from 'react'
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../../../components/grid";
import { getBillingServices, UpdateBillingServices, editClientData } from "../../../../../store/actions";
import CheckboxRenderer from '../../../../../components/grid/CheckboxRenderer'

class AnnualBillingView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    checked: false,
    isSelectedRowData: [],
    annualBilling: "",
    columnDefs: [

      {
        headerName: "Service Name",
        field: "serviceName",
        width: 110,
        flex: 1,

      },
      {
        headerName: "Description",
        field: "description",
        resizable: true,
        width: 150,
        flex: 1,

      },
      {
        headerName: "Created At",
        field: "createdAt",
        resizable: true,
        width: 150,
        flex: 1,
        valueFormatter: params => new Date(params.value).toLocaleString()
      },
      {
        headerName: "Billable",
        field: "isBillable",
        resizable: true,
        width: 150,
        flex: 1,
        cellRenderer: "checkboxRenderer",
        cellRendererParams: {
          onChanged: (params) => this.onClickAnnualBilling(params)
        },
      },

    ],
    rowData: [],
    searchText: '',

    frameworkComponents: {
      checkboxRenderer: CheckboxRenderer
    },
  };
  usersPayload = {};
  annualBilling = [];
  onGridReady = params => {

    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    let dataSource = {
      getRows: async (params) => {

        this.usersPayload.startRow = params.startRow;
        this.usersPayload.endRow = params.endRow;
        this.usersPayload.searchText = this.state.searchText;
        // use redux..
        this.gridApi.showLoadingOverlay();
        await this.props.getBillingServices(this.usersPayload);
        const getUsersList = this.props.BillingServices;
        this.gridApi.hideOverlay();
        return params.successCallback(getUsersList, getUsersList.count);

      }
    }
    params.api.setServerSideDatasource(dataSource)
  }
  searchInput = (e) => {
    this.setState({ searchText: e.target.value });
    this.gridApi.purgeServerSideCache();
    // this.gridApi.refreshInfiniteCache();
  }
  refreshGrid = () => {
    this.gridApi.purgeServerSideCache();
  }

  saveServices = async () => {

    let eventData = this.state.annualBilling
    let payload = {
      billingServices: eventData
    }
    await this.props.UpdateBillingServices(payload);
  };

  onClickAnnualBilling(data) {
    let findIndex = this.annualBilling.findIndex(res => res.systemId === data.systemId);
    if (findIndex === -1) {
      this.annualBilling.push(data)
    } else {
      this.annualBilling[findIndex] = data;
    }
    this.setState({ annualBilling: this.annualBilling })
  }



  render() {
    return (

      <>
        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
              <input type="text" placeholder="Search" autoComplete="off" onChange={(e) => this.searchInput(e)} />
            </div>
            <div className="filter-field d-flex">
              <button className="mla fs12 primary mini" onClick={this.saveServices}>Save</button>
            </div>

          </div>
          <div className="clients_grid">
            <Grid
              frameworkComponent={this.state.frameworkComponents}
              columnDefs={this.state.columnDefs}
              modules={this.state.modules}
              rowModelType='serverSide'
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


const mapStateToProps = ({ BillingServices, EDIT_CLIENT_DATA }) => ({ BillingServices, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { getBillingServices, editClientData, UpdateBillingServices })(AnnualBillingView);
