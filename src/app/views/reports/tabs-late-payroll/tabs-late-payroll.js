import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { Component } from 'react'
import 'react-tabs/style/react-tabs.css';
import LatePayrollView from '../late-payroll';
import LatePayrollDetailsView from '../late-payroll-details'
 class TabsLatePayrolls extends Component {

  render() {
    return (<>

<Tabs>
    <TabList>
      <Tab>Late Payroll</Tab>
      <Tab>Late Payroll Details</Tab>
    </TabList>

    <TabPanel>
      <LatePayrollView></LatePayrollView>
    </TabPanel>
    <TabPanel>
     <LatePayrollDetailsView></LatePayrollDetailsView>
    </TabPanel>
  </Tabs>


    </>);
  }
}
export default TabsLatePayrolls;
