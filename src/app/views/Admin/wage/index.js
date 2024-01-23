import React, { Component } from 'react'
import Axios from "axios";

//import components
import Grid from "../../../components/grid";
import Portal from "../../../components/portal/Portal";
import { AddWageAll } from "./add-wage/AddWageAll";
import { AlertDialog } from "./alert-dialog/alert-dialog";
import { connect } from "react-redux";
import * as _ from 'lodash';
import { DeleteWageAction, GetWageAction, AddWageAction, UpdateWageAction, UpdatePerviousDateEmptyAction } from "../../../store/actions/Admin/wage";
import { GetLocationWage } from "../../../store/actions/wagelocation";
import Plus_icon from '../../../assets/images/plus_icon.png'
import Edit_icon from '../../../assets/images/edit_icon.png'
import Delete_icon from '../../../assets/images/delete_icon.png'

import './style.scss';
// redux
// import { getCountries } from "../../../store/actions";



class WageView extends Component {

    state = {
        showWagePopup: false,
        confirmationBox: false,
        alert: false,
        wageRate: [],
        nycList: [],
        counties3List: [],
        stateList: [],
        wageListNYC: [],
        wageList3Country: [],
        wageListState: [],
        editData: {}
    };

    state = {
        columnDefs: [
            { headerName: "Start Date", field: "startDate", sortable: true, filter: true, flex: 1, resizable: true },
            { headerName: "End Date", field: "endDate", sortable: true, filter: true, flex: 1, resizable: true },
            { headerName: "Min Wage", field: "minWage", sortable: true, filter: true, flex: 1, resizable: true },
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

    }
    btnEdit = (params) => {
        if (params.locationId.toLowerCase() === 'NYC'.toLowerCase())
            this.setState({ showWagePopup: true, type: params.locationId, editData: params, wageList: this.state.nycList })
        else if (params.locationId.toLowerCase() === '3 Counties'.toLowerCase())
            this.setState({ showWagePopup: true, type: params.locationId, editData: params, wageList: this.state.counties3List, })
        else if (params.locationId.toLowerCase() === 'State'.toLowerCase())
            this.setState({ showWagePopup: true, type: params.locationId, editData: params, wageList: this.state.stateList })

    }
    btnDelete = async (params) => {
        if (this.state.alert) {
            await this.props.DeleteWageAction(params)
            this.fetchWage().then(r => null);

            this.setState({ confirmationBox: false, alert: false });
        }
        else {
            this.setState({ confirmationBox: true, id: params, alert: true });
        }
    }

    toggleWagePopup = (date) => {
        if (date) {
            this.fetchWage().then(r => null)
        }
        this.setState({ showWagePopup: false })
    }
    toggleConfirmationPopup = () => {
        this.setState({ confirmationBox: false })
    }


    getLocalTime = (time) => {
        return new Date(time).toLocaleDateString();
    }
    async componentDidMount() {
        await this.props.GetLocationWage();
        this.fetchWage();
    }
    getCountryName = (id) => {

        const obj = _.find(this.props.wage, { _id: id });
        if (obj) {
            return obj.name;
        }
        return '';
    }

    fetchWage = async () => {
        this.state.wageListNYC = [];
        this.state.wageList3Country = [];
        this.state.wageListState = [];

        await this.props.GetWageAction();
        const wageList = this.props.WAGE;
        _.forEach(wageList, (res) => {
            res.locationId = res.country['name'];
        });
        _.forEach(wageList, (res) => {
            res.startDate = res.startDate === '' ? '' : this.getLocalTime(res.startDate);
            res.endDate = res.endDate === '' ? '' : this.getLocalTime(res.endDate);
            if (res.locationId === 'NYC') {
                this.state.wageListNYC.push(res);
            } else if (res.locationId === '3 Counties') {
                this.state.wageList3Country.push(res);
            } else if (res.locationId === 'State') {
                this.state.wageListState.push(res);
            }
        });

        this.setState({ nycList: this.state.wageListNYC, counties3List: this.state.wageList3Country, stateList: this.state.wageListState })
    }

    render() {
        return (
            <div>
                <div className="route_page rate_setup_page location-wage">
                    <div className="rates_list">
                        <h4 className="heading_h4">NYC</h4>
                        <div className="list">
                            <Grid

                                rowData={this.state.nycList}
                                columnDefs={this.state.columnDefs}
                                height="350px">
                            </Grid>
                            <div onClick={() => this.setState({ showWagePopup: true, type: 'NYC', wageList: this.state.nycList, editData: {} })} className="df acsa add_rate">
                                <img src={Plus_icon} />
                                <p>Add rate</p>
                            </div>
                        </div>
                    </div>
                    <div className="rates_list">
                        <h4 className="heading_h4">Nassau, Suffolk, Westchester</h4>
                        <div className="list">
                            <Grid
                                //   frameworkComponent={this.frameworkComponents}
                                rowData={this.state.counties3List}
                                columnDefs={this.state.columnDefs}
                                height="350px">
                            </Grid>

                            <div onClick={() => this.setState({ showWagePopup: true, type: '3 Counties', wageList: this.state.counties3List, editData: {} })} className="df acsa add_rate">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    version="1.1"
                                    id="Capa_1"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 512 512"
                                    // style={{enable:"new 0 0 512 512"}}
                                    xmlSpace="preserve"
                                    width="14px"
                                    height="14px"
                                >
                                    <g>
                                        <g>
                                            <g>
                                                <path
                                                    d="M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216    v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"
                                                    data-original="#000000"
                                                    className="active-path"
                                                    data-old_color="#000000"
                                                    fill="rgba(0,0,0,0.5)"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <p>Add rate</p>
                            </div>
                        </div>
                    </div>


                    <div className="rates_list">
                        <h4 className="heading_h4">State</h4>

                        <div className="list">
                            <Grid
                                //   frameworkComponent={this.frameworkComponents}
                                rowData={this.state.stateList}
                                columnDefs={this.state.columnDefs}
                                height="350px">
                            </Grid>

                            <div onClick={() => this.setState({ showWagePopup: true, type: 'State', wageList: this.state.stateList, editData: {} })} className="df acsa add_rate">
                                <img src={Plus_icon} alt="" />
                                <p>Add rate</p>
                            </div>
                        </div>
                    </div>


                    {this.state.showWagePopup && (
                        <Portal
                            zIndex="101"
                            height="400px"
                            width="320px"
                            close={this.toggleWagePopup}
                            title={!Object.keys(this.state.editData).length ? 'Add Wage' : 'Edit Wage'} >
                            <AddWageAll
                                id={this.state.locationId}
                                addRate={this.addRate}
                                locations={this.state.locations}
                                isSelected={this.state.type}
                                wageList={this.state.wageList}
                                countries={this.props.WAGE_LOCATION}
                                user={this.props.user}
                                isEditRow={this.state.editData}
                                close={this.toggleWagePopup}
                                action={this.props}
                            ></AddWageAll>
                        </Portal>
                    )}

                    {this.state.confirmationBox && (
                        <Portal
                            zIndex="101"
                            height="164px"
                            width="424px"
                            close={this.toggleConfirmationPopup}
                            title="Confirmation">
                            <AlertDialog
                                message="Are you sure you want to delete this?"
                                id={this.state.id}
                                alert={this.state.alert}
                                close={this.toggleConfirmationPopup}
                                confirmation={this.btnDelete}
                            >

                            </AlertDialog>
                        </Portal>
                    )}

                </div>
            </div>
        )
    }
}
const mapStateToProps = ({ USER, WAGE, WAGE_LOCATION }) => ({ USER, WAGE, WAGE_LOCATION });
export default connect(mapStateToProps, { DeleteWageAction, GetWageAction, GetLocationWage, AddWageAction, UpdateWageAction, UpdatePerviousDateEmptyAction })(WageView);
