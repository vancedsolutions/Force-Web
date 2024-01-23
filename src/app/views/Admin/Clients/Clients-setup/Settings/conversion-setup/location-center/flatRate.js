import React, { Component } from 'react';
import Select from "react-select";
import { connect } from "react-redux";
import "./locationCenter.scss";
import { getFlateRateId, setDefaultCostCenter, getDefaultCostCenterByCompany } from "../../../../../../../store/actions";
import moment from "moment";
class FlatRate extends Component {
    state = {
        selectedLocation: null,
        flatRateList: [],
        isActive: false
    }
    async componentDidMount() {
        await this.props.getDefaultCostCenterByCompany(this.props.EDIT_CLIENT_DATA?.companyShortName);
        let costCenterList = this.props.DEFAULT_COST_CENTER_BY_COMPANY;

        let locationId = costCenterList?.defaultLocationId;
        if (locationId) {
            let selected = this.props.WAGE_LOCATION.find(res => res._id === locationId);
            let selectedData = {
                value: selected._id,
                label: selected.name
            }
            this.handleChange(selectedData);
        }

    }


    handleChange = (e) => {
        this.setState({ isActive: true })
        this.setState({ selectedLocation: e });
        this.fatchFlatRateLocation(e.value);
    }

    async fatchFlatRateLocation(id) {
        await this.props.getFlateRateId(id);

        this.setState({
            flatRateList: this.props.flatRateLocation
        });

    }
    defaultFlatRate = async () => {

        if (this.props.DEFAULT_COST_CENTER_BY_COMPANY) {
            const payload = {
                companyId: this.props.params.settingsTab.isSelectedRowData?._id,
                default: true,
                name: this.props.DEFAULT_COST_CENTER_BY_COMPANY.name,
                defaultLocationId: this.state.selectedLocation.value,
                value: this.props.DEFAULT_COST_CENTER_BY_COMPANY.treeIndex,
                type: "FLAT_RATE"
            }
            this.setState({ isActive: false });
            await this.props.setDefaultCostCenter(payload);
            this.setState({ isActive: true })

        }

    }

    render() {
        const locationId = [];
        this.props.WAGE_LOCATION.forEach(el => {
            locationId.push({
                value: el._id, label: `${el.name}`
            })
        })

        return (<>
            <div className="cost_center_select">
                <div className="cost_center_outer d-flex align-items-center justify-content-between">
                    <div className="cost_flex_box">
                        <span> Select the Location </span>
                        <Select
                            placeholder="Select Location"
                            options={locationId}
                            onChange={this.handleChange}
                            value={this.state.selectedLocation}
                            hideSelectedOptions={false}
                        />
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <p className="fs14"><button className="btn reportBtn" disabled={!this.state.flatRateList.length || !this.state.isActive} onClick={() => this.defaultFlatRate()} >Save</button></p>
                    </div>

                </div>
            </div>
            <div className="route_page rate_setup_page location-wage popup-lacation">
                <div className="rates_list">
                    <div className="list">
                        <div className="df acsa rate_line">

                            <div className="fs12 sec w-30 flex-shrink">  <p className="fs12 lbl">Start Date</p></div>
                            <div className="fs12 sec w-30 flex-shrink">  <p className="fs12 lbl">End Date</p></div>
                            <div className="fs12 sec w-30 flex-shrink">  <p className="fs12 lbl">Min Wage</p></div>
                        </div>
                        {this.state.flatRateList.map((el, i) => (
                            <div key={el._id} className="df acsa rate_line">
                                <div className="fs12 sec w-30 flex-shrink">

                                    <p className="fs14">{moment(el.startDate).format("MM/DD/YYYY")}</p>
                                </div>
                                <div className="fs12 sec w-30 flex-shrink">
                                    {el.endDate !== "" ? moment(el.endDate).format("MM/DD/YYYY") : ""}

                                </div>
                                <div className="fs12 sec w-30 flex-shrink">
                                    {el.minWage}
                                </div>



                            </div>
                        ))}


                    </div>
                </div>


            </div>
        </>
        );
    }
}
const mapStateToProps = ({ USER, WAGE_LOCATION, flatRateLocation, COST_CENTERS, EDIT_CLIENT_DATA }) => {
    const { DEFAULT_COST_CENTER_BY_COMPANY } = COST_CENTERS
    return { USER, WAGE_LOCATION, flatRateLocation, DEFAULT_COST_CENTER_BY_COMPANY, EDIT_CLIENT_DATA }
};
export default connect(mapStateToProps, {
    getFlateRateId,
    setDefaultCostCenter,
    getDefaultCostCenterByCompany
})(FlatRate);
