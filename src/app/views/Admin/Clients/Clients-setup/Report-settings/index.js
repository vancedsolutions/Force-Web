import React, { Component } from 'react'
import iconSetting from "../../../../../assets/images/Icon-feather-settings.png";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DefaultEins from './patient-hours/DefaultEins';
import ReportIdView from './patient-hours/ReportId';
import EarningsCodes from './earnings-codes/EarningsCodes';
import DeductionsView from './deductions/Deductions';
import WPSavedReports from './saved-reports/SavedReports';
import RateConfig from './rate-config/RateConfig';
import ComparisonColumns from './patient-hours/ComparisonColumns';
import CPEC from './regular-codes/Reg';
import HolidayEC from './holiday/holiday';
import PTOEC from './pto/pto';
import RateTableId from './rate-table/rateTable';


class IconSettingClass extends React.Component {
  render() {
    return <img src={iconSetting} alt="" />;
  }
}

class ReportSettingsView extends Component {

  isPermission(key) {
    return this.props.reportSettingsTab.GET_PERMISSIONS.find(p => p.key === key && p.isActive);
  }

  render() {
    return (

      <>

        <div className="reportList">

          {this.isPermission('PATIENT_HOURS') && (<Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">PATIENT HOURS REPORT</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className="reportListAccording mar-0">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="titleAccording">Report id</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ReportIdView reportParams={this.props}></ReportIdView>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="titleAccording">Default EIN</Typography>
                  </AccordionSummary>
                  <AccordionDetails>

                    <DefaultEins ></DefaultEins>


                  </AccordionDetails>
                </Accordion>


                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="titleAccording">Comparison columns</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ComparisonColumns reportParams={this.props}></ComparisonColumns>
                  </AccordionDetails>
                </Accordion>
              </div>


            </AccordionDetails>
          </Accordion>)}


          {this.isPermission('WAGE_PARITY') && (<Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">Wage parity report</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className="reportListAccording mar-0">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="titleAccording">Earning codes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <EarningsCodes reportParams={this.props}></EarningsCodes>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="titleAccording">Deductions</Typography>
                  </AccordionSummary>
                  <AccordionDetails>

                    <DeductionsView reportParams={this.props}></DeductionsView>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="titleAccording">Saved reports</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WPSavedReports reportParams={this.props}></WPSavedReports>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header">
                    <Typography className="titleAccording">Rate config</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RateConfig reportParams={this.props}></RateConfig>
                  </AccordionDetails>
                </Accordion>



              </div>


            </AccordionDetails>
          </Accordion>)}



          {this.isPermission('CERTIFIED_PAYROLL') && (<Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">Certified payroll report</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className="reportListAccording mar-0">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="titleAccording">Regular Codes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CPEC reportParams={this.props}></CPEC>
                  </AccordionDetails>
                </Accordion>


                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="titleAccording">PTO Codes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <PTOEC reportParams={this.props}></PTOEC>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="titleAccording">Holiday Codes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <HolidayEC reportParams={this.props}></HolidayEC>
                  </AccordionDetails>
                </Accordion>


                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="titleAccording">Rate Table ID</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RateTableId reportParams={this.props}></RateTableId>
                  </AccordionDetails>
                </Accordion>
              </div>
            </AccordionDetails>
          </Accordion>)}
        </div>
      </>
    );
  }
};

export default ReportSettingsView;




