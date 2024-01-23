import React, { Component } from 'react'

import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../components/grid";
import { getOutboundOrder,getItemPurchasOrder } from "../../../store/actions";
import { editClientData } from "../../../store/actions";

import EditUser from "./edit";
import AddOrder from "./add";
import AddIcon from '../../../assets/images/ionic-ios-add-circle-outline.png';
import CheckboxRenderer from '../../../components/grid/CheckboxRenderer';
import moment from "moment";
class OutboundOrdersView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    columnDefs: [

      {
        headerName: "Order ID",
        field: "orderID",
        width: 110,
        filter: false,
        flex: 1,
      },
      {
        headerName: "Date",
        field: "date",
        resizable: true,
        width: 150,
        flex: 1,
        filter: false,
        valueFormatter: params => params.value?moment(params.value).format('MMM DD yyyy'):""
      },
      {
        headerName: "Delivery Date",
        field: "deliveryDate",
        resizable: true,
        width: 150,
        filter: false,
        valueFormatter: params => params.value?moment(params.value).format('MMM DD yyyy'):""

      },
      {
        headerName: "Total Price",
        field: "totalPrice",
        resizable: true,
        width: 100,
        flex: 1,
        filter: false,
      },

      {
        headerName: "Client Information",
        field: "clientInformation",
        resizable: true,
        width: 150,
        flex: 1,
        filter: false,
      },
      {
        headerName: "Item Name",
        field: "itemName",
        resizable: true,
        width: 100,
        flex: 1,
        filter: false,
      },
      {
        headerName: "Qty",
        field: "qty",
        width: 150,
        flex: 1,
        filter: false,
      },
      {
        headerName: "Billed",
        field: "isBilled",
        resizable: true,
        flex: 1,
        width: 150,
        filter: false,
        cellRenderer: function (params) {
          if(params.value!==undefined){
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
  frameworkComponents = {
    CheckboxRenderer: CheckboxRenderer
  }
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
        await this.props.getOutboundOrder(this.usersPayload);
        const getUsersList = this.props.OutboundOrderR;
        getUsersList['records'].forEach(element => {
          if(element.itemId?.hasOwnProperty('itemName')){
            element.itemName=element.itemId['itemName']
          }
        });
        this.gridApi.hideOverlay();
        if (!getUsersList.records.length) {
          this.gridApi.showNoRowsOverlay();
        } else {
          this.setState({ rowData: getUsersList.records })
          return params.successCallback(getUsersList.records, getUsersList.count);
        }
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
    // this.props.EDIT_CLIENT_DATA;
  }
  closeSidebar = () => {
    this.setState({ isShow: false, isAddOrderShow: false });
    this.refreshGrid()
  }
  AddOrder = () => {
    this.setState({ isAddOrderShow: true });
  }
  render() {

    const { loading } = this.state;
    const { isShow } = this.state;
    const { isAddOrderShow } = this.state


    return (

      <>
        <div className="table-header d-flex align-items-center justify-content-between">
          <button className="add_order" onClick={this.AddOrder}><img src={AddIcon} /> Add </button>
        </div>
        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
              <input type="text" placeholder="Search" autoComplete="off" onChange={(e) => this.searchInput(e)} />
            </div>


          </div>
          <div className="clients_grid">
            <Grid
              frameworkComponent={this.frameworkComponents}
              columnDefs={this.state.columnDefs}
              rowModelType='infinite'
              onGridReady={this.onGridReady}
              height='600px'
            >

            </Grid>
          </div>

        </div>
        {isShow && (<EditUser isShow={this.state.isShow} closeSidebar={this.closeSidebar} purchaseData={this.state.isSelectedRowData} />)}
        {isAddOrderShow && (<AddOrder isAddOrderShow={this.state.isAddOrderShow} closeSidebar={this.closeSidebar} />)}

      </>
    )
  }
}

const mapStateToProps = ({ USER, OutboundOrderR, EDIT_CLIENT_DATA }) => ({ USER, OutboundOrderR, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { getOutboundOrder, editClientData })(OutboundOrdersView);