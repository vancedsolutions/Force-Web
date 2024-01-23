import React, { Component } from 'react'
import { connect } from "react-redux";
import { getUsers,getStatus} from "../../store/actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ItemView from './item';
import PurchaseOrders from './purchase-orders';
import OutboundOrders from './outbound-orders';
import SummaryView from './summary';
import './style.scss';
class TimeInventoryView extends Component {


  async componentDidMount() {
    await this.props.getStatus();
     }

  render() {
    return (
      <>

      <h2 className="page_title">Time Clock Inventory</h2>
        <Tabs>
          <div className="tabNav d-flex align-items-center justify-content-between">
            <TabList>
             <Tab>Summary</Tab>
              <Tab>Items</Tab>
              <Tab>Purchase Orders</Tab>
              <Tab>Outbound Orders</Tab>
            </TabList>
          </div>
          <div className="tabContent">
          <TabPanel>
              <SummaryView></SummaryView>
            </TabPanel>
            <TabPanel>
              <ItemView></ItemView>
            </TabPanel>
            <TabPanel>
              <PurchaseOrders></PurchaseOrders>
            </TabPanel>
            <TabPanel>
              <OutboundOrders></OutboundOrders>
            </TabPanel>
          </div>
        </Tabs>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS }) => ({ USER, GET_USERS });
export default connect(mapStateToProps, { getUsers,getStatus})(TimeInventoryView);