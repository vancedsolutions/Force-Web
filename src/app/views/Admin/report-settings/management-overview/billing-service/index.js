import React, { Component } from 'react'
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../../../components/grid";
import { getBillingServices, editClientData, UpdateBillingServices } from "../../../../../store/actions";
import RadioboxRenderer from '../../../../../components/grid/RedioboxRenderer'
import { differenceWith, filter, flatMap, groupBy, isEqual, } from "lodash";

class ManagementOverviewView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    billingServices: [],
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
        headerName: "Billing Frequency",
        field: "billingFrequency",
        resizable: true,
        width: 150,
        flex: 1,
        cellRenderer: "radioboxRenderer",
        cellRendererParams: {
          onChanged: (params)=>this.onClickBillingFrequency(params)
        },
      }

    ],
    rowData: [],
    searchText: '',
  };
  usersPayload = {};
  billingServices = [];
  frameworkComponents = {
    radioboxRenderer: RadioboxRenderer
  }
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
  }
  refreshGrid = () => {
    this.gridApi.purgeServerSideCache();
  }
  saveServices = async () => {
    let payload = {
      billingServices: this.state.billingServices
    }
    await this.props.UpdateBillingServices(payload);
  };

  onClickBillingFrequency=(data)=> {
   
    let findIndex = this.billingServices.findIndex(res => res.systemId===data.systemId);
    if (findIndex === -1) {
      this.billingServices.push(data)
    } else {
      this.billingServices[findIndex] = data;
    }
    this.setState({ billingServices: this.billingServices });
  }


  render() {
    const { billingServices } = this.state;
   return (
      <>
        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
              <input type="text" placeholder="Search" autoComplete="off" onChange={(e) => this.searchInput(e)} />
            </div>

            <div className="filter-field d-flex">
              <button className="mla fs12 primary mini" onClick={this.saveServices} disabled={!billingServices.length}>Save</button>
            </div>
          </div>
          <div className="clients_grid">
            <Grid
              frameworkComponent={this.frameworkComponents}
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


const mapStateToProps = ({ BillingServices }) => ({ BillingServices });
export default connect(mapStateToProps, { getBillingServices, editClientData, UpdateBillingServices })(ManagementOverviewView);
