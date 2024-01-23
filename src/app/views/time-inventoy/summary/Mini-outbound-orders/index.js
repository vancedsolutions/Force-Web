import React, { Component } from 'react'
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../../components/grid";
import { getPurchaseOrder, getSummeryReport, editClientData } from "../../../../store/actions";
import moment from "moment";
import { apiEndPoint } from "../../../../utils/constants";
class MiniOutboundView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    dataListUP: [],
    columnDefs: [

      {
        headerName: "Order Id",
        field: "orderID",
        width: 90,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Serial Number",
        field: "serialNumber",
        resizable: true,
        filter: false,
        sortable: false,
        width: 120,
      },
      {
        headerName: "Date",
        field: "date",
        resizable: true,
        width: 120,
        sortable: false,
        filter: false,
        valueFormatter: params => params.value ? moment(params.value).format('MMM DD yyyy') : ""
      },
      {
        headerName: "Total Price",
        field: "totalPrice",
        resizable: true,
        filter: false,
        sortable: false,
        width: 100

      },
      {
        headerName: "Qty",
        field: "qty",
        width: 90,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Billed",
        field: "isBilled",
        resizable: true,
        width: 100,
        cellRenderer: function (params) {
          if (params.value !== undefined) {
            if (params.value) {
              return `<div className="ag-grid-checkbox">
        <input className="styled-checkbox" readonly  type="checkbox" checked>
        <label></label>
      </div>`;
            } else {
              return `<div className="ag-grid-checkbox">
        <input className="styled-checkbox" readonly  type="checkbox" >
        <label ></label>
      </div>`;
            }
          }

        },
      },

    ],
    rowData: [],
    searchText: '',
  };
  usersPayload = {};


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

        await getSummeryReport().then(summeryReport => {
          this.gridApi.hideOverlay();
          if (!summeryReport.length) {
            this.gridApi.showNoRowsOverlay();
          } else {
            let preId = this.props.EDIT_CLIENT_DATA?._id
            let filterData = summeryReport.filter(res => res._id === preId)[0]
            let showData = filterData.outboundOrder
            return params.successCallback(showData, showData.length);
          }
        });

      }
    }
    params.api.setDatasource(dataSource)
  }

  refreshGrid = () => {
    this.gridApi.refreshInfiniteCache();
  }

  async EditUserF(event) {
    await this.props.editClientData(event);
    this.setState({ isShow: true });
    this.setState({ isSelectedRowData: event })
  }

  closeSidebar = () => {
    this.setState({ isShow: false, isAddOrderShow: false });
    this.refreshGrid()
  }

  render() {

    const { loading } = this.state;
    const { isShow } = this.state;
    const { isAddOrderShow } = this.state

    return (
      <>
        <div className="shadow_white_box full-box mt-0">
          <div className="clients_grid">
            <Grid
              columnDefs={this.state.columnDefs}
              rowModelType='infinite'
              onGridReady={this.onGridReady}
              height='300px'
            >
            </Grid>
          </div>

        </div>
      </>
    )
  }
}

const mapStateToProps = ({ USER, PurchasedOrder, EDIT_CLIENT_DATA }) => ({ USER, PurchasedOrder, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { getPurchaseOrder })(MiniOutboundView);