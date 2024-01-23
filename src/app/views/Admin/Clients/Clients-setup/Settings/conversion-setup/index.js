import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import EarningCode from "./earningcode/earningcode";
import LocationCenter from "./location-center/locationCenter";
import ExportEarning from "./export-earning";
import iconSetting from "../../../../../../assets/images/Icon-feather-settings.png";
import { connect } from "react-redux";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ApiSetup from '../../api-setup/ApiSetup'
import BackgroundTasksList from '../../background-tasks/BackgroundTasks'



class IconSettingClass extends React.Component {

  render() {
    return <img src={iconSetting} alt="" />;
  }
}

class SettingSetupView extends Component {
  state = {
    isPermission: false
  }


  render() {

    let permissions = this.props.settingsTab.GET_PERMISSIONS;

    return (
      <>
        <div className="reportList">



          {permissions.find(p => p.key === "SPREAD_OF_HOURS_TOOL" && p.isActive) &&
            <Accordion>
              <AccordionSummary
                expandIcon={<IconSettingClass />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="reportTitle">Spread of hours tool</Typography>

              </AccordionSummary>

              <AccordionDetails>
                <div className="reportListAccording mar-0">

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="titleAccording">

                        EARNINGS CODES

                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="reportId">

                        <EarningCode reportSettingsTab={this.props}></EarningCode>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="titleAccording"> EXPORT EARNING CODE </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <div className="reportListAccording mar-0">
                        <ExportEarning reportSettingsTab={this.props}></ExportEarning>
                      </div>
                    </AccordionDetails>
                  </Accordion>



                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="titleAccording">
                        COST CENTER
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                      <LocationCenter reportSettingsTab={this.props}></LocationCenter>

                    </AccordionDetails>
                  </Accordion>

                </div>
              </AccordionDetails>
            </Accordion>}

          <Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">API Key</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className="reportListAccording mar-0">
                <ApiSetup reportSettingsTab={this.props}></ApiSetup>
              </div>
            </AccordionDetails>
          </Accordion>


          <Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">Background Tasks</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className="reportListAccording mar-0">
                <BackgroundTasksList reportSettingsTab={this.props}></BackgroundTasksList>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

      </>
    );
  }
}
const mapStateToProps = ({ USER, getPermissionReport }) => ({ USER, getPermissionReport });
export default connect(mapStateToProps, {})(SettingSetupView);

