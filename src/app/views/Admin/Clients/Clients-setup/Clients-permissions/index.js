import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import "../style.scss";
import { connect } from "react-redux";
import { savePermissions, getPermissions } from "../../../../../store/actions";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { clientPermissionsList } from "../../../../../utils/constants";

import iconSetting from "../../../../../assets/images/Icon-feather-settings.png";
import { flatMap, groupBy } from "lodash";


class IconSettingClass extends React.Component {
  render() {
    return <img src={iconSetting} alt="" />;
  }
}



class ClientsPermissionsView extends Component {

  state = {
    loading: false,
    clientsPermissions: [],
    permissionsView: {},
    changes: []
  }

  handleChange = async (event, group, idx) => {

    let list = this.state.permissionsView;
    let elem = list[group][idx];
    elem.isActive = event.target.checked;

    this.monitorChanges(elem.key);

    this.setState({ permissionsView: list });
  };

  monitorChanges = key => {
    let changes = this.state.changes;
    if (changes.includes(key)) {
      changes.splice(changes.indexOf(key), 1);
    }
    else changes.push(key);
    this.setState({ changes });
  };

  savePermissions = async () => {
    let companyId = this.props.EDIT_CLIENT_DATA?._id;
    let perms = this.state.clientsPermissions.map(p => {
      p.company = companyId;
      p.isActive = !!p.isActive;
      return p;
    });
    await this.props.savePermissions(perms).then(() => this.setState({ changes: [] }));

  };
  async componentDidMount() {
    let companyId = this.props.EDIT_CLIENT_DATA?._id || this.props.USER.companyDetails._id;
    await this.props.getPermissions(companyId);
    const permissions = this.props.GET_PERMISSIONS || [];

    let clientsPermissions = clientPermissionsList.map(el => {
      el.isActive = !!permissions.find(p => p.key === el.key && p.isActive);
      return el;
    });
    let permissionsView = groupBy(clientsPermissions, "group");
    this.setState({
      clientsPermissions: clientsPermissions,
      permissionsView: permissionsView
    });
    /* if (list?.length) {
      list.forEach((res) => {
        if (res.key === 'WAGE_PARITY') {
          this.setState({
            wageParityChecked: res.isActive
          })

        } else if (res.key === 'PATIENT_HOURS') {
          this.setState({
            patientHourChecked: res.isActive
          })

        } else if (res.key === 'CERTIFIED_PAYROLL') {
          this.setState({
            certifiedPayrollChecked: res.isActive
          })

        }
        else if (res.key === 'SPREAD_OF_HOURS_TOOL') {
          this.setState({
            spreadOfHoursChecked: res.isActive
          })

        } else if (res.key === 'EMPLOYEES_ACCRUALS') {
          this.setState({
            accrualsReportChecked: res.isActive
          })

        }

      })
    }
 */

  }
  render() {
    const { permissionsView } = this.state;
    let groups = Object.keys(permissionsView);
    const IOSSwitch = withStyles((theme) => ({
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        padding: 1,
        "&$checked": {
          transform: "translateX(16px)",
          color: theme.palette.common.white,
          "& + $track": {
            backgroundColor: "#52d869",
            opacity: 1,
            border: "none",
          },
        },
        "&$focusVisible $thumb": {
          color: "#52d869",
          border: "6px solid #fff",
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(["background-color", "border"]),
      },
      checked: {},
      focusVisible: {},
    }))(({ classes, ...props }) => {
      return (
        <Switch
          focusVisibleClassName={classes.focusVisible}
          disableRipple
          classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
          }}
          {...props}
        />
      );
    });
    return <>
      <div className="df align-items-end justify-content-between flex-row-reverse mt-4 mb-3">
        <button className="btn reportBtn" onClick={this.savePermissions} disabled={!this.state.changes.length} >Save</button>
      </div>
      <div className="reportList">

        {
          groups.map(group => {
            return <Accordion>
              <AccordionSummary
                expandIcon={<IconSettingClass />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                key={`${group}`}
              >
                <Typography className="reportTitle">{group}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="tabPanel df align-items-center justify-content-between">
                  {
                    permissionsView[group].map((el, ix) => {
                      return <>
                        <div className="tabList df align-items-center justify-content-between">
                          <div className="tabListTitle">
                            {el.label}
                          </div>
                          <div className="tabSwitch">
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <IOSSwitch
                                    checked={el.isActive}
                                    onChange={(e) => this.handleChange(e, group, ix)}
                                    name={`${el.key}-${ix}`}
                                    key={ix}
                                  />
                                }
                              />
                            </FormGroup>
                          </div>
                        </div>
                        {ix % 2 === 1 && <div className="break"></div>}
                      </>
                    })
                  } </div>
              </AccordionDetails>
            </Accordion>
          })}
      </div>
    </>
  }
}
const mapStateToProps = ({ USER, PERMISSIONS, EDIT_CLIENT_DATA }) => {
  const { GET_PERMISSIONS } = PERMISSIONS;
  return { USER, GET_PERMISSIONS, EDIT_CLIENT_DATA };
};

export default connect(mapStateToProps, {
  savePermissions, getPermissions
})(ClientsPermissionsView);
