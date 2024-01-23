import React, { Component } from 'react'
import { connect } from "react-redux";
import { getUsers, getStatus } from "../../store/actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import HistoryView from './history';
import EmailScheduleView from './email-schedule';
import './style.scss';

class TimeInventoryView extends Component {
  async componentDidMount() {
    await this.props.getStatus();
  }

  render() {
    return (
      <>
        <h2 className="page_title">Email Setup</h2>
        <Tabs>
          <div className="tabNav d-flex align-items-center justify-content-between">
            <TabList>
              <Tab>Email Schedule</Tab>
              <Tab>History</Tab>
            </TabList>
          </div>
          <div className="tabContent">
            <TabPanel>
              <EmailScheduleView />
            </TabPanel>
            <TabPanel>
              <HistoryView/>
            </TabPanel>
          </div>
        </Tabs>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS }) => ({ USER, GET_USERS });
export default connect(mapStateToProps, { getUsers, getStatus })(TimeInventoryView);