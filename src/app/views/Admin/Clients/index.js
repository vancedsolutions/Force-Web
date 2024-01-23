import React, { Component } from 'react'
import { connect } from "react-redux";
import Grid from "../../../components/grid";
import LinkCell from "../../../components/grid/linkCell";
import { companiesAction, editClientData, getSyncClient } from "../../../store/actions";
import { clientPermissionsList } from '../../../utils/constants';
import Loader from "../../../components/loader/Loader"
import './style.scss';
import RightSidebarView from "./Clients-setup"
import { isEmpty } from 'lodash';


class ClientsView extends Component {
  filterData = [];
  filterData1 = [];
  state = {
    loading: false,
    isSelectedRowData: "",
    isShow: false,
    filterPermission: "",
    reportList: [],

    columnDefs: [
      {
        headerName: "Company Name",
        field: "companyName",
        sortable: true,
        filterParams: {
          values: params => {
            const values = this.filterData;
            params.success(values);
          }
        }, flex: 1,

      },
      {
        headerName: "Company Short Name",
        field: "companyShortName",
        sortable: true,
        resizable: true,
        filterParams: {
          values: params => {
            const values = this.filterData1;
            params.success(values);
          }
        }, flex: 1,

      },
      {
        headerName: "Team Support",
        field: "registeredForTeamSupport",
        sortable: true,
        filter: false,
        resizable: true, flex: 1,

      },
      {
        headerName: "Type", field: "companyType", sortable: false, filter: false, resizable: true, flex: 1,

      },
    ],
    rowData: [],
    searchText: '',
  };
  companyPayload = {};
  frameworkComponents = {
    cellButton: LinkCell
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
        this.companyPayload.startRow = params.startRow;
        this.companyPayload.endRow = params.endRow;
        this.companyPayload.searchText = this.state.searchText;
        this.companyPayload.filterPermission = this.state.filterPermission;
        this.companyPayload.sortColumn = params.sortModel.length ? params.sortModel[0]['colId'] : "companyShortName";
        this.companyPayload.sortType = params.sortModel.length ? params.sortModel[0]['sort'] : "asc";
        // use redux..
        this.gridApi.showLoadingOverlay();
        await this.props.companiesAction(this.companyPayload);
        const getCompaniesList = this.props.GET_COMPANIES;
        this.gridApi.hideOverlay();

        if (!getCompaniesList.records.length) {

          this.gridApi.showNoRowsOverlay();

        } else {
          getCompaniesList.records.forEach(element => {
            element.registeredForTeamSupport = element.registeredForTeamSupport ? "Yes" : "No"
          });
          this.setState({ rowData: getCompaniesList.records })
          return params.successCallback(getCompaniesList.records, getCompaniesList.count);
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


  loadingData = () => {
    this.setState({ loading: true });
    //this is sync api for company
    this.props.getSyncClient();
    this.setState({ loading: false });
    this.gridApi.purgeInfiniteCache();


  };
  async componentDidMount() {
    let data = clientPermissionsList.filter(per => per.group !== 'COMPARISON_COLUMNS');
    this.setState({ reportList: data });
  }
  async EditUserF(event) {
    await this.props.editClientData(event);
    this.setState({ isShow: true });
    this.setState({ isSelectedRowData: event })

  }

  closeSidebar = ($e) => {
    this.setState({ isShow: false });
  }
  permissionFilter = (e) => {
    this.setState({
      filterPermission: e.target.value
    });
    this.gridApi.purgeInfiniteCache();
    // this.gridApi.refreshInfiniteCache();
  }

  componentDidUpdate(prev, prevState, dispatch) {
    if (prev.USER.companyId && !isEmpty(this.props.EDIT_CLIENT_DATA) && !isEmpty(this.props.GET_COMPANIES)) {
      const companyList = this.props.GET_COMPANIES['records'];
      let getCompany = companyList.find(res => res.companyShortName === this.props.EDIT_CLIENT_DATA.companyShortName || res.companyShortName === this.props.USER.company);
      //this.props.editClientData(getCompany);
      this.setState({ isShow: true });
      this.setState({ isSelectedRowData: getCompany });
      let data = JSON.parse(localStorage.getItem("USER"));
      delete data['companyId'];
      delete this.props.USER['companyId']
      localStorage.setItem('USER', JSON.stringify(data));
    }
  }

  render() {

    const { loading, isShow } = this.state;
    return (

      <>
        {/* <Route path="/admin/clients/details/:id/:companyid" component={RightSidebarView} ></Route> */}

        <div className="table-header d-flex align-items-center justify-content-between">
          <h4 className="heading_h4"> Clients </h4>
          <button className="mla fs12 primary mini" onClick={this.loadingData}>
            {loading && (<Loader></Loader>)}
            {loading ? <span>Loading data </span> : <span>Sync Now</span>}
          </button>
        </div>

        <div className="shadow_white_box full-box mt-0">
          <div className="filter-list d-flex align-items-center justify-content-between">
            <div className="filter-field d-flex">
              <input type="text" placeholder="Search" onChange={(e) => this.searchInput(e)} />
            </div>
            <div className="filter-field d-flex">
              <label>Filter by permission</label>
              <select className="filterSelect" value={this.state.filterPermission} onChange={(e) => this.permissionFilter(e)}>
                <option value="">Show All</option>

                {this.state.reportList.map(item => (
                  <option
                    key={item.key}
                    value={item.key}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
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
        {isShow && (<RightSidebarView isShow={this.state.isShow} closeSidebar={this.closeSidebar} isSelectedRowData={this.state.isSelectedRowData} isLocation={this.props.history} />)}
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_COMPANIES, EDIT_CLIENT_DATA }) => ({ USER, GET_COMPANIES, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { companiesAction, editClientData, getSyncClient })(ClientsView);