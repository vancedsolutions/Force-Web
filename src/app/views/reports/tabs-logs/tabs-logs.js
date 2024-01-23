import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { Component } from 'react'
import 'react-tabs/style/react-tabs.css';
import HistoryLogs from '../logs-history'
import LoginHistory from '../login-history';
import BgTaskLogsView from '../bg-task-logs';
import CronLogsView from '../cron-logs';
class TabsLogs extends Component {

  render() {
    return (<>
      <div className="table-header d-flex align-items-center justify-content-between">
        <h4 className="heading_h4"> Logs </h4>
      </div>
      <Tabs>
        <TabList>
          <Tab>Login History</Tab>
          <Tab>Data Changes</Tab>
          <Tab>Bg Tasks History</Tab>
          <Tab>Cron Jobs History</Tab>
        </TabList>

        <TabPanel>
          <LoginHistory></LoginHistory>
        </TabPanel>
        <TabPanel>
          <HistoryLogs></HistoryLogs>
        </TabPanel>
        <TabPanel>
          <BgTaskLogsView></BgTaskLogsView>
        </TabPanel>
        <TabPanel>
          <CronLogsView></CronLogsView>
        </TabPanel>
      </Tabs>


    </>);
  }
}
export default TabsLogs;
