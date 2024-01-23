import React, { Component } from 'react'

//import components
import Grid from "../../../../components/grid";
import Portal from "../../../../components/portal/Portal";
import { AddLevel } from "./add-level/AddLevel";
import { connect } from "react-redux";
import * as _ from 'lodash';
import { getCsrAssignments, updateCsrAssignments, DeleteCsrAssignments, addCsrAssignments } from "../../../../store/actions";
import './style.scss';
import Edit_icon from '../../../../assets/images/edit_icon.png'
import Delete_icon from '../../../../assets/images/delete_icon.png'
class CSRAssignmentsReport extends Component {

    state = {
        showLevelPopup: false,
        editData: {},
        enterpriseEmployees: "",
        isEditData: false,
        columnDefs: [
            {
                headerName: "Level",
                field: "level",
                resizable: true,
                width: 150,
                flex: 1,

            },

            {
                headerName: "Max Employees",
                field: "maxAccounts",
                width: 110,
                flex: 1,


            },
            {
                headerName: "Max Accounts",
                field: "maxEmployees",
                resizable: true,
                width: 150,
                flex: 1,
            },
            {
                headerName: "Max Enterprise",
                field: "maxEnterprise",
                resizable: true,
                width: 150,
                flex: 1,
            },
            {
                headerName: "Action", field: "", sortable: false, filter: false, flex: 1,

                cellRendererFramework: (params) => (
                    <>
                        <div className="action">
                            <button className="btn btn-primary" onClick={() => this.btnEdit(params.data)} ><img src={Edit_icon} /></button>{" "}
                            <button className="btn btn-primary" onClick={() => this.btnDelete(params.data._id)}><img src={Delete_icon} /></button>
                        </div>

                    </>)
            }

        ],
        rowData: [],
    };

    usersPayload = {};

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        let dataSource = {
            getRows: async (params) => {
                this.gridApi.showLoadingOverlay();
                await this.props.getCsrAssignments();
                const getUsersList = this.props.CSR.capacityLevel;
                this.setState({ enterpriseEmployees: this.props.CSR.enterpriseAcctEmployees })
                this.gridApi.hideOverlay();
                if (!getUsersList?.length) {
                    this.gridApi.showNoRowsOverlay();
                } else {
                    return params.successCallback(getUsersList);
                }
            }
        }
        params.api.setServerSideDatasource(dataSource);
    }


    btnEdit = (params) => {
        this.setState({ showLevelPopup: true, editData: params, isEditData: true })
    }

    btnDelete = async (params) => {
        await this.props.DeleteCsrAssignments(params)
        this.refreshGrid()
    }


    toggleWagePopup = (date) => {
        this.setState({ showLevelPopup: false })
    }


    saveServices = async ($e) => {
        $e.preventDefault();
        let payload = {
            enterpriseAcctEmployees: this.state.enterpriseEmployees,
        }
        await this.props.addCsrAssignments(payload);
        this.toggleWagePopup()
        this.refreshGrid()
    }

    refreshGrid = () => {
        this.gridApi.purgeServerSideCache();
    }

    render() {
        return (
            <>

                <div className="table-header d-flex align-items-center justify-content-between">
                    <h2 className="page_title"> CSR Assignments </h2>
                </div>




                <div className="shadow_white_box full-box mt-0">

                    <div className="filter-list d-flex align-items-center justify-content-between">
                        <div className="filter-field d-flex">

                        </div>
                        <div className="filter-field d-flex">
                            <button className="mla fs12 primary mini" onClick={() => this.setState({ showLevelPopup: true, isEditData: false })}>Add Level</button>
                        </div>

                    </div>
                    <div className="clients_grid">

                        <Grid
                            columnDefs={this.state.columnDefs}
                            rowModelType='serverSide'
                            onGridReady={this.onGridReady}
                            height='350px'
                        >
                        </Grid>

                        <div className="filter-field d-flex justify-content-between">

                            <div></div>
                            <div className="df acsa add_rate">
                                <p>Enterprise Acct Employees</p>
                                <input type="number" value={this.state.enterpriseEmployees}
                                    onChange={(e) => this.setState({ enterpriseEmployees: e.target.value })}
                                    style={{ marginLeft: '15px' }}
                                />
                                <button className="mla fs12 primary mini" onClick={this.saveServices} style={{ marginLeft: '15px' }}>Save</button>
                            </div>
                        </div>

                        {this.state.showLevelPopup && (
                            <Portal
                                zIndex="101"
                                height="440px"
                                width="320px"
                                close={this.toggleWagePopup}
                                title={'Add Capacity Level'} >
                                <AddLevel
                                    close={this.toggleWagePopup}
                                    level={this.props.CSR.capacityLevel}
                                    isEditRow={this.state.editData}
                                    action={this.props}
                                    isEditData={this.state.isEditData}
                                    refreshGrid={this.refreshGrid}
                                ></AddLevel>
                            </Portal>
                        )}
                    </div>

                </div>

            </>
        )
    }
}
const mapStateToProps = ({ USER, WAGE, CSR }) => ({ USER, WAGE, CSR });
export default connect(mapStateToProps, { getCsrAssignments, updateCsrAssignments, addCsrAssignments, DeleteCsrAssignments })(CSRAssignmentsReport);
