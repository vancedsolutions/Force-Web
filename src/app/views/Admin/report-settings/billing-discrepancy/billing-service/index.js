import React, { Component } from 'react'
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../../../components/grid";
import { getBillingServices, UpdateBillingServices, editClientData } from "../../../../../store/actions";
import DropDownRender from '../../../../../components/grid/dropDown'
import { groupBy } from "lodash";
import { BILLING_CATEGORIES } from '../../../../../utils/constants';

class BillingDiscrepancyView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    billingServices: [],
    columnDefs: [

      {
        headerName: "Billing Category",
        field: "billingCategory",
        resizable: true,
        width: 150,
        flex: 1,
        rowGroup: true,
        hide: true,

      },

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

        valueFormatter: params => params.value ? new Date(params.value).toLocaleString() : ""
      },
      {
        headerName: "Billing Category",
        field: "billingCategory",
        resizable: true,
        width: 150,
        flex: 1,
        cellRenderer: "dropDownRender",
        cellRendererParams: {
          onChange: (params) => this.onClickBillingFrequency(params),
          optionsList: BILLING_CATEGORIES
        },
      }

    ],
    rowData: [],
    searchText: '',
  };
  usersPayload = {};
  billingServices = [];
  frameworkComponents = {
    dropDownRender: DropDownRender
  }

  onGridReady = async (params) => {
    this.setState({ apiParmas: params })
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    const updateData = (data) => {
      this.setState({ rowData: data });
    }
    this.gridApi.showLoadingOverlay();
    await this.props.getBillingServices(this.usersPayload);
    const getUsersList = this.props.BillingServices;
    if (getUsersList.length) {
      let list = [];
      let data = groupBy(getUsersList, "billingCategory");
      Object.keys(data).forEach(element => {
        data[element].forEach(res => {
          list.push({
            ...res,
            billingCategory: element
          })
        })
      });
      updateData(list)
    }
  }
  searchInput = (e) => {
    this.setState({ searchText: e.target.value });
    this.gridApi.purgeInfiniteCache();
  }
  refreshGrid = () => {
    this.gridApi.showLoadingOverlay();
    this.onGridReady(this.state.apiParmas)
  }

  saveServices = async () => {
    let payload = {
      billingServices: this.state.billingServices
    }
    await this.props.UpdateBillingServices(payload);
    this.refreshGrid()
  };

  onClickBillingFrequency = (data) => {
    let findIndex = this.billingServices.findIndex(res => res.systemId === data.systemId);
    if (findIndex === -1) {
      this.billingServices.push(data)
    } else {
      this.billingServices[findIndex] = data;
    }
    this.setState({ billingServices: this.billingServices });
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
              frameworkComponent={this.frameworkComponents}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              groupDefaultExpanded={1}
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
export default connect(mapStateToProps, { getBillingServices, editClientData, UpdateBillingServices })(BillingDiscrepancyView);
