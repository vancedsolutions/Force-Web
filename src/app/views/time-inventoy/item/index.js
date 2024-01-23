import React, { Component } from 'react'
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../components/grid";
import { getItemsOrder } from "../../../store/actions/Admin/itemsOrder";
import { editClientData } from "../../../store/actions";
import EditUser from "./edit"
import AddOrder from "./add"
import AddIcon from '../../../assets/images/ionic-ios-add-circle-outline.png';
import { apiEndPoint } from "../../../utils/constants";
import moment from "moment";
class ItemView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    isAddOrderShow: false,
    columnDefs: [

      {
        headerName: "Item ID",
        field: "orderID",
        filter: false,
        width: 120,
      }, {
        headerName: "Purchase Order",
        field: "purchaseOrdersId",
        filter: false,
        width: 160,
      },  {
        headerName: "Serial Number",
        field: "serialNumber",
        filter: false,
        width: 160,
      },{
        headerName: "Outbound Order",
        field: "outboundId",
        filter: false,
        width: 160,
      },
      {
        headerName: "Image",
        field: "itemImage",
        resizable: true,
        filter: false,
        width: 160,
        cellRenderer: params => params.value !== null ? `<image style="width: 30px;margin-top: -4px;" src=${apiEndPoint + params.value}></image>` : "",
      },
      {
        headerName: "Name",
        field: "itemName",
        resizable: true,
        filter: false,
        flex: 1,
        width: 160,
      },
      {
        headerName: "Description",
        field: "itemDescription",
        resizable: true,
        width: 200,
        filter: false,
      },
      {
        headerName: "Status",
        field: "status",
        resizable: true,
        width: 200,
        filter: false,
      },
      {
        headerName: "Warranty Expiraon Date",
        field: "warrantyExpiraon",
        resizable: true,
        flex: 1,
        filter: false,
        valueFormatter: params => params.value ? moment(params.value).format('MMM DD yyyy') : "No Warranty"
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
        await this.props.getItemsOrder(this.usersPayload);
        ;
        const getUsersList = this.props.ItemsOrderR;
        // getUsersList['records'].forEach(element => {
        //   element.status = element.itemStatus['statusName']
        // });
        this.gridApi.hideOverlay();
        if (!getUsersList.records?.length) {
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
          <button className="add_order" onClick={this.AddOrder}><img src={AddIcon} alt="" /> Add </button>
        </div>
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
        {isAddOrderShow && (<AddOrder isAddOrderShow={this.state.isAddOrderShow} closeSidebar={this.closeSidebar} />)}

      </>
    )
  }
}

const mapStateToProps = ({ USER, ItemsOrderR, EDIT_CLIENT_DATA }) => ({ USER, ItemsOrderR, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { getItemsOrder, editClientData })(ItemView);
