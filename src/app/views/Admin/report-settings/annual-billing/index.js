import React, { Component } from 'react'
import { connect } from "react-redux";
import { getBillingServices } from "../../../../store/actions";
import { getAnnualBillingSettings, saveAnnualBillingSettings } from "../../../../store/actions"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BillingServiceView from './billing-service'
import SettingsView from './w2-settings'
class BillingServices extends Component {
    render() {
        return (
            <>
                <h2 className="page_title">Annual billing by client</h2>
                <Tabs>
                    <div className="tabNav d-flex align-items-center justify-content-between">
                        <TabList>
                            <Tab>Billing Services</Tab>
                            <Tab>W2 Settings</Tab>
                        </TabList>
                    </div>
                    <div className="tabContent">
                        <TabPanel>
                            <BillingServiceView />
                        </TabPanel>
                        <TabPanel>
                            <SettingsView />
                        </TabPanel>
                    </div>
                </Tabs>
            </>
        )
    }
}


const mapStateToProps = ({ BillingServices, REPORT_SETTINGS }) => ({ BillingServices, REPORT_SETTINGS });
export default connect(mapStateToProps, { getBillingServices, getAnnualBillingSettings, saveAnnualBillingSettings })(BillingServices);
