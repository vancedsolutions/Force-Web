import React, { Component } from 'react'
import { connect } from "react-redux";
import { getBillingServices } from "../../../store/actions/Admin/billing-services";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnualBillingView from '../report-settings/annual-billing'
import BillingDiscrepancyView from '../report-settings/billing-discrepancy'
import ManagementOverviewView from '../report-settings/management-overview'
import './temp.scss';
class BillingServices extends Component {
    render() {
        return (
            <>
                <h2 className="page_title">Billing Services</h2>
                <Tabs>
                    <div className="tabNav d-flex align-items-center justify-content-between">
                        <TabList>
                            <Tab>Annual Billing by client</Tab>
                            <Tab>Management Overview Setup</Tab>
                            <Tab>Billing Discrepancy</Tab>
                        </TabList>
                    </div>
                    <div className="tabContent">
                        <TabPanel>
                            <AnnualBillingView />
                        </TabPanel>
                        <TabPanel>
                            <ManagementOverviewView />
                        </TabPanel>
                        <TabPanel>
                            <BillingDiscrepancyView />
                        </TabPanel>
                    </div>
                </Tabs>
            </>
        )
    }
}


const mapStateToProps = ({ BillingServices }) => ({ BillingServices });
export default connect(mapStateToProps, { getBillingServices })(BillingServices);
