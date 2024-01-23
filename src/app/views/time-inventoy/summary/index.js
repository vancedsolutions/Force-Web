import React, { Component } from 'react'
import { connect } from "react-redux";
import _ from 'lodash';
import Grid from "../../../components/grid";
import { getPurchaseOrder } from "../../../store/actions/Admin/purchaseOrder";
import { getSummeryReport, editClientData } from "../../../store/actions";
import EditUser from "./edit";
import moment from "moment";
import { apiEndPoint } from "../../../utils/constants";
class SummaryView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    columnDefs: [

      {
        headerName: "Item Id",
        field: "orderID",
        filter: false,
        width: 110
      },
      {
        headerName: "Image",
        field: "itemImage",
        resizable: true,
        filter: false,
        cellRenderer: params => params.value != null ? `<image style="width: 30px;margin-top: -4px;" src=${apiEndPoint + params.value} onerror="this.onerror=null;this.src='';"></image>` : "",
        flex: 1
      },
      {
        headerName: "Item Name",
        field: "itemName",
        resizable: true,
        filter: false,
        flex: 1

      },
      {
        headerName: "Currently in stock",
        field: "currentStock",
        resizable: true,
        filter: false,
        width: 100,
        flex: 1
      },

      {
        headerName: "Outbound Qty",
        field: "outBoundQty",
        resizable: true,
        width: 150,
        filter: false,
        flex: 1

      },
      {
        headerName: "Billed qty",
        field: "isBilledQty",
        resizable: true,
        filter: false,
        width: 100

      },
      {
        headerName: "Last purchase date",
        field: "purchaseDate",
        width: 150,
        filter: false,
        valueFormatter: params => params.value ? moment(params.value).format('MMM DD yyyy') : "",
        flex: 1
      },
      {
        headerName: "Last outbound order date",
        field: "outBoundOrderDate",
        resizable: true,
        width: 150,
        filter: false,
        valueFormatter: params => params.value ? moment(params.value).format('MMM DD yyyy') : "",
        flex: 1
      },

    ],
    rowData: [],
    searchText: '',
  };
  usersPayload = {};


  onGridReady = params => {
    params.api.addGlobalListener((type, e) => {
      if (type === "rowClicked") {
        this.EditUserF(e.data);
      }
    })
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    let dataSource = {
      getRows: async (params) => {
        this.usersPayload.startRow = params.startRow;
        this.usersPayload.endRow = params.endRow;
        this.usersPayload.searchText = this.state.searchText;
        // use redux..
        this.gridApi.showLoadingOverlay();
        getSummeryReport().then(summeryReport => {
          this.gridApi.hideOverlay();
          if (!summeryReport.length) {
            this.gridApi.showNoRowsOverlay();
          } else {

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
        {isShow && (<EditUser isShow={this.state.isShow} closeSidebar={this.closeSidebar} purchaseData={this.state.isSelectedRowData} />)}
      </>
    )
  }
}

const mapStateToProps = ({ USER, PurchasedOrder, EDIT_CLIENT_DATA }) => ({ USER, PurchasedOrder, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { getPurchaseOrder, editClientData })(SummaryView);