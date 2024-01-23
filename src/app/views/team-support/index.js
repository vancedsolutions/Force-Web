import React, { Component } from 'react'
import { Route, Switch, Link } from "react-router-dom";
import { connect } from "react-redux";
import * as _ from 'lodash';
import Grid from "../../components/grid";
import { teamSupportRegesterAction } from "../../store/actions";
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
class TeamSupportRegisterView extends Component {
    state = {

        columnDefs: [

            {
                headerName: "Team Name",
                field: "Name",
                sortable: true,
                flex: 1,
                filter:false,
            },
            {
                headerName: "Comany short Code",
                field: "Description",
                sortable: true,
                filter: false,
                resizable: true,
            },
            {
                headerName: "Date Time",
                field: "DateCreated",
                sortable: false,
                filter: false,
                resizable: true,
            },
            {
                headerName: "Team Support",
                field: "IsActive",
                sortable: false,
                filter: false,
                resizable: true,
            },

        ],
        rowData: [],
        searchText: '',
    };
    teamSupportPayload = {};

    onGridReady = params => {

        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.teamSupportPayload.startRow = params.startRow;
                this.teamSupportPayload.endRow = params.endRow;
                this.teamSupportPayload.searchText = this.state.searchText;
                this.teamSupportPayload.sortColumn =params.sortModel.length? params.sortModel[0]['colId']:"Name";
                this.teamSupportPayload.sortType = params.sortModel.length ? params.sortModel[0]['sort'] : "asc";
                // use redux..
                this.gridApi.showLoadingOverlay();
                await this.props.teamSupportRegesterAction(this.teamSupportPayload);

                const getTeamSupportList = this.props.TEAM_SUPPORT_REGISTER;
                this.gridApi.hideOverlay();
                if (!getTeamSupportList.records.length) {

                    this.gridApi.showNoRowsOverlay();
                    // this.gridApi.purgeInfiniteCache();
                }
                this.setState({ rowData: getTeamSupportList.records })
                return params.successCallback(getTeamSupportList.records, getTeamSupportList.count);

            }
        }
        params.api.setDatasource(dataSource)
    }
    searchInput = (e) => {
        this.setState({ searchText: e.target.value });
        this.gridApi.refreshInfiniteCache();
    }
    refreshGrid = () => {
        this.gridApi.refreshInfiniteCache();
    }


    render() {
        return (
            <>
                <div className="table-header d-flex align-items-center justify-content-between">
                    <h4 className="heading_h4"> Team Support History </h4>
                    {/* <button className="mla fs12 primary mini">Sync Now</button> */}
                </div>
                <div className="shadow_white_box full-box mt-0">
                    <div className="filter-list d-flex align-items-center justify-content-between">
                        <div className="filter-field d-flex">
                            <input type="text" placeholder="Search" onChange={(e) => this.searchInput(e)} />
                        </div>
                    </div>
                    <div className="clients_grid">
                        <Grid
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            rowModelType={'infinite'}
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

const mapStateToProps = ({ USER, TEAM_SUPPORT_REGISTER }) => ({ USER, TEAM_SUPPORT_REGISTER });
export default connect(mapStateToProps, { teamSupportRegesterAction })(TeamSupportRegisterView);
