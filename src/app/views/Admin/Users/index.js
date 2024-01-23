import React, { Component } from 'react'
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../../components/grid";
import { getUsers, getSyncUser } from "../../../store/actions";
import Loader from "../../../components/loader/Loader"
import './style.scss';
import EditUser from "../Users/edit";

class UsersView extends Component {
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    locked: false,
    columnDefs: [

      {
        headerName: "Name",
        field: "fullName",
        sortable: true,
        filter: false,
        filterParams: {
          filterOptions: ['equals', 'lessThan', 'greaterThan'],
        },
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,

        filter: false,
        resizable: true,
        flex: 1,

      },
      {
        headerName: "User Name",
        field: "userName",
        sortable: true,
        filter: false,
        resizable: true,
        flex: 1,

      },
      {
        headerName: "Role",
        field: "portalAccess",
        sortable: true,
        filter: false,
        resizable: false,
        flex: 1,

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
        this.usersPayload.userLocked = this.state.locked;
        this.usersPayload.sortColumn = params.sortModel.length ? params.sortModel[0]['colId'] : "firstName";
        this.usersPayload.sortType = params.sortModel.length ? params.sortModel[0]['sort'] : "asc";

        // use redux..
        this.gridApi.showLoadingOverlay();
        await this.props.getUsers(this.usersPayload);
        const getUsersList = this.props.GET_USERS;
        this.gridApi.hideOverlay();
        getUsersList.records.forEach(element => {
          element.fullName = element.firstName + " " + element.lastName
        });
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

  loadingData = async () => {
    this.setState({ loading: true });
    await this.props.getSyncUser();
    this.gridApi.purgeInfiniteCache();
    this.setState({ loading: false });

  };

  EditUserF = (event) => {

    this.setState({ isShow: true });
    this.setState({ isSelectedRowData: event })
  }

  closeSidebar = () => {
    this.setState({ isShow: false });
  }

  checkedHandler(e) {
    let isEventValue = e.target.checked;
    this.setState({
      locked: isEventValue
    })
    this.gridApi.purgeInfiniteCache();
  }
  render() {

    const { loading } = this.state;
    const { isShow } = this.state;

    return (

      <>

        <Route path="/admin/users/details/:id" component={EditUser} ></Route>
        <div className="table-header d-flex align-items-center justify-content-between">
          <h4 className="heading_h4"> Users </h4>
          <button className="mla fs12 primary mini" onClick={this.loadingData}>
            {loading && (<Loader></Loader>)}
            {loading ? <span>Loading data </span> : <span>Sync Now</span>}
          </button>
        </div>

        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
              <input type="text" placeholder="Search" autoComplete="off" onChange={(e) => this.searchInput(e)} />
            </div>
            <div className="filter-field d-flex align-items-center">
              <input type="checkbox" onChange={(e) => this.checkedHandler(e)} /> <span style={{ 'marginLeft': '5px' }}>Show locked account</span>
            </div>

          </div>
          <div className="clients_grid">
            <Grid
              //  frameworkComponent={this.frameworkComponents}
              columnDefs={this.state.columnDefs}
              // rowData={this.state.rowData}
              rowModelType='infinite'
              onGridReady={this.onGridReady}
              height='600px'


            >

            </Grid>
          </div>

        </div>
        {isShow && (<EditUser isShow={this.state.isShow} closeSidebar={this.closeSidebar} isSelectedRowData={this.state.isSelectedRowData} />)}

      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS }) => ({ USER, GET_USERS });
export default connect(mapStateToProps, { getUsers, getSyncUser })(UsersView);