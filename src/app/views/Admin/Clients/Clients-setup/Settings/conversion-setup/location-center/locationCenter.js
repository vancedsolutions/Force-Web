import React, { Component } from 'react'
import { connect } from "react-redux";
import find from 'lodash';
// import scss
import "./locationCenter.scss";
import Select from "react-select";
// redux
import { GetLocationWage } from "../../../../../../../store/actions/wagelocation";
import Switch from '../../../../../../../components/ui/switch/Switch';
import { getCostCenter, getCostCenterMapping, updateLocationCenter, setDefaultCostCenter, getLocationBlank, AddLocationBlank } from "../../../../../../../store/actions";
import FlatRate from "./flatRate";
import Loader from "../../../../../../../components/loader/Loader";

class LocationCenter extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        locations: [],
        wageRate: [],
        costCenter: [],
        isFlatRate: false,
        selectedCostCenter: null,
        locationCenterList: [],
        selectedLocationId: null,
        clientId: this.props.reportSettingsTab.settingsTab.isSelectedRowData._id,
        costCenterParent: {},
        costCenterChildren: [],
        defaultCostCenterParent: {},
        loading: true,
        blankValue: ""
    };
    flatRateAction = (taskIdx, val) => {

        this.setState({ isFlatRate: val })
    };

    async componentDidMount() {
        await this.props.GetLocationWage();
        await this.fetchCostCenterParents();
        await this.costCenterMapping();
        let getData = await getLocationBlank(this.props.EDIT_CLIENT_DATA?._id);

        if (this.props.WAGE_LOCATION.length) {
            this.setState({ locationCenterBlank: this.props.WAGE_LOCATION[0]._id, blankValue: this.props.WAGE_LOCATION[0].name })
        }
        if (getData.data.length) {
            this.setState({ blankValue: getData.data[0].blankTitle, locationCenterBlank: getData.data[0].locationId })
        }


    }

    costCenterMapping = async (treeIndex = 0, selected = false) => {
        this.setState({
            loading: false
        })
        const { companyShortName } = this.props.reportSettingsTab.settingsTab.isSelectedRowData;
        await this.props.getCostCenterMapping(this.state.clientId, treeIndex, selected, companyShortName);
        let costCenterMappingList = this.props.COST_CENTER_MAPPING || {};

        let list = costCenterMappingList?.list?.map(el => {
            if (el.country) {
                el.selectedLocation = {
                    label: find(this.props.WAGE_LOCATION, { _id: el.country }).name,
                    value: el.country
                }
            };
            return el;
        }) || [];
        let { defaultCostCenter } = costCenterMappingList;
        let defaultCostCenterParent = defaultCostCenter ?
            { ...defaultCostCenter, value: defaultCostCenter._id, label: `${defaultCostCenter.treeIndex + 1} ~ ${defaultCostCenter.name}` } :
            this.state.costCenter[0];

        let locationCenterList = list.filter(res => res.level !== 0);
        let selectedCostCenter = this.state.selectedCostCenter || defaultCostCenterParent;
        let locationList = this.props.WAGE_LOCATION.length && this.props.WAGE_LOCATION.map(wl => {
            return {
                value: wl._id, label: wl.name
            }
        });
        this.setState({
            //costCenterParent,
            defaultCostCenterParent,
            locationCenterList,
            selectedCostCenter,
            locationList
        });
        if (costCenterMappingList['defaultCostCenter'] && !selected) {
            if (costCenterMappingList['defaultCostCenter'].type === 'FLAT_RATE') {
                this.setState({ isFlatRate: true });
            }
        }
        this.setState({
            loading: true
        });
    };

    /* updateDropDown(selectedInfo) {
        this.setState({ selectedCostCenter: selectedInfo })
    } */

    fetchCostCenterParents = async () => {
        await this.props.getCostCenter({ company: this.props.EDIT_CLIENT_DATA?._id });
        let costCenterData = this.props.COST_CENTER || []
        this.setState({
            costCenter: costCenterData.map(cc => {
                return {
                    ...cc,
                    value: cc._id, label: `${cc.treeIndex + 1} ~ ${cc.name}`
                }
            })
        });
    }

    updateCostCenter = (selectedCostCenter) => {

        //let getSelected = this.props.COST_CENTER.find(cc => cc._id === selectedCostCenter.value);

        this.setState({ selectedCostCenter });
        this.costCenterMapping(parseInt(selectedCostCenter.treeIndex), true)

    }
    updateLocationID = (selectedLocation, index) => {
        this.state.locationCenterList[index].selectedLocation = selectedLocation;
        this.setState({});
    }

    defaultCostCenter = async () => {

        if (this.state.selectedCostCenter !== null) {
            const payload = {
                companyId: this.props.reportSettingsTab.settingsTab.isSelectedRowData._id,
                name: this.state.selectedCostCenter.name,
                value: Number(this.state.selectedCostCenter.treeIndex),
                default: true,
                type: "COST_CENTER"
            }
            await this.props.setDefaultCostCenter(payload);
            this.setState({ defaultCostCenterParent: this.state.selectedCostCenter })
        }
    }

    updateLocationCenter = async () => {
        let costCenterList = [];
        this.state.locationCenterList.forEach(element => {
            if (element.selectedLocation !== undefined) {
                costCenterList.push({
                    costCenter: element._id,
                    country: element.selectedLocation.value
                })
            }

        });
        await this.props.updateLocationCenter(costCenterList)
        await this.updateLocationBlank()
    }
    updateLocationBlank = async () => {
        let payload = {
            companyId: this.props.EDIT_CLIENT_DATA?._id,
            blankTitle: this.state.blankValue,
            locationId: this.state.locationCenterBlank,
        }
        await AddLocationBlank(payload);
    }

    findSelectedLocation = (locationId) => {
        let selectedLocation = this.state.locationList.find(l => l.value === locationId);
        return selectedLocation;
    };

    render() {
        let { costCenter, defaultCostCenterParent, selectedCostCenter, isFlatRate, locationList, locationCenterList } = this.state;

        return (

            <div className="costcenter-list-height">
                <div className="d-flex align-items-center justify-content-end">
                    <span style={{ marginRight: '10px' }}>Flat Rate:</span>
                    <Switch
                        switchAction={this.flatRateAction}
                        id="flatRate"
                        value={isFlatRate}
                    ></Switch>
                </div>
                {this.state.isFlatRate ? (<div><FlatRate params={this.props.reportSettingsTab}></FlatRate></div>) : (
                    <>
                        <div className="cost_center_select">
                            <div className="cost_center_outer d-flex align-items-center justify-content-between">
                                <div className="cost_flex_box">
                                    <span> Select the Cost Center</span>
                                    <Select
                                        placeholder="Cost Center"
                                        options={costCenter}
                                        value={selectedCostCenter}
                                        onChange={this.updateCostCenter}
                                        hideSelectedOptions={false}
                                    // styles={customStyles}
                                    />
                                </div>

                            </div>

                            <span className="pull-left" >Cost center: {defaultCostCenterParent.label}</span>
                            <span className="pull-left"><button className="button-default" onClick={() => this.defaultCostCenter()} disabled={!this.state.locationCenterList.length}>Set as default</button></span>
                            <span className="pull-left" >

                            </span>
                            <div className="reportListAccording mar-0">
                                <div className="reportId blank_location">

                                    <div class="row mt-3">
                                        <div class="col-md-6">
                                            <div class="listDiv">
                                                {/* <input type="text" id="blankValue" value={this.state.blankValue} onChange={(event) => this.setState({ blankValue: event.target.value })} /> */}
                                                <span>For Blank Fields</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="listDiv">
                                                {(this.props.WAGE_LOCATION.length) && (
                                                    <select
                                                        className="roleSelect"
                                                        value={this.state.locationCenterBlank}
                                                        onChange={(event) => this.setState({ locationCenterBlank: event.target.value })} required>
                                                        {this.props.WAGE_LOCATION.map(el => (
                                                            <option key={el._id} value={el._id}>{el.name}</option>
                                                        ))}

                                                    </select>
                                                )}

                                            </div>
                                        </div>

                                    </div>


                                </div>
                            </div>



                        </div>
                        <div className="table_list">
                            {this.state.loading ? (
                                <div className="over_scroll">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Cost Center</th>
                                                <th scope="col">External ID</th>
                                                <th scope="col">Abbreviation</th>
                                                <th scope="col">Location Center</th>
                                                <th scope="col" style={{ 'width': '130px' }}>Location ID</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {locationCenterList.map((el, i) => (
                                                <tr key={el._id}>
                                                    <th scope="row">{el.treeIndex + 1}</th>
                                                    <td>{el.externalId}</td>
                                                    <td>{el.abbreviation}</td>
                                                    <td>{el.name}</td>
                                                    <td><Select
                                                        placeholder="Location Id"
                                                        options={locationList}
                                                        value={this.findSelectedLocation(el.selectedLocation?.value)}
                                                        onChange={(val) => this.updateLocationID(val, i)}
                                                        hideSelectedOptions={false}

                                                    /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (<div className="ec_setup_cntnt df acc loading">
                                <Loader></Loader>
                            </div>)}
                            <div className="d-flex align-items-center justify-content-end">
                                <p className="fs14"><button className="btn reportBtn" onClick={() => this.updateLocationCenter()} disabled={!this.state.locationCenterList.length}>Save</button></p>
                            </div>
                        </div>


                    </>
                )
                }

            </div>
        )
    }
}
const mapStateToProps = ({ USER, WAGE_LOCATION, COST_CENTERS, EDIT_CLIENT_DATA, selectedCostCenter }) => {
    const { COST_CENTER, COST_CENTER_MAPPING } = COST_CENTERS
    return { USER, WAGE_LOCATION, COST_CENTER, COST_CENTER_MAPPING, EDIT_CLIENT_DATA, selectedCostCenter }
}

export default connect(mapStateToProps, {
    GetLocationWage,
    getCostCenter,
    getCostCenterMapping,
    updateLocationCenter,
    setDefaultCostCenter,
})(LocationCenter);
