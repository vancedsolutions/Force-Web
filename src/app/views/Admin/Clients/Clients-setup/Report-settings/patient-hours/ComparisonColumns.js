import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { savePermissions, getPermissions, saveCompressionColumns } from "../../../../../../store/actions";
import { clientPermissionsList } from '../../../../../../utils/constants';
class ComparisonColumns extends Component {

  state = {
    comparisons: [],
    changes: []
  }

  handleChange = async (event, idx) => {
    let compList = this.state.comparisons
    compList[idx].isActive = event.target.checked;
    this.monitorChanges(compList[idx].key);
    this.setState({ comparisons: compList });
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
    let comparisonPermissions = this.state.comparisons.map(cm => {
      let companyId = this.props.EDIT_CLIENT_DATA._id;
      cm.company = companyId;
      return cm;
    });
    await this.props.savePermissions(comparisonPermissions).then(() => this.setState({ changes: [] }));
  }

  componentDidUpdate(prev, prevState) {
  }
  async componentDidMount() {
    const list = await this.props.GET_PERMISSIONS;

    let comparisons = clientPermissionsList.filter(p => p.group === "COMPARISON_COLUMNS").map(c => {
      c.isActive = !!list.find(p => p.key === c.key);
      return c;
    });

    this.setState({ comparisons });
  }

  render() {
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

      <div className="reportList">

        <div className="tabPanel df align-items-center justify-content-between">
          {
            this.state.comparisons.map((cm, i) => {
              return <div className="tabList df align-items-center justify-content-between">
                <div className="tabListTitle">
                  {cm.label}
                </div>
                <div className="tabSwitch">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          checked={cm.isActive}
                          onChange={(e) => this.handleChange(e, i)}
                          name="straightComparison"
                        />
                      }
                    />
                  </FormGroup>
                </div>
              </div>
            })
          }
        </div>

        <div className="df align-items-end justify-content-between flex-row-reverse mt-4 mb-3">
          <button className="btn reportBtn" onClick={this.savePermissions} disabled={!this.state.changes.length}>Save</button>
        </div>

      </div>
    </>
  }
}
const mapStateToProps = ({ USER, EDIT_CLIENT_DATA, PERMISSIONS, permissionReport }) => {
  const { GET_PERMISSIONS, SAVE_PERMISSIONS } = PERMISSIONS;
  return { USER, EDIT_CLIENT_DATA, GET_PERMISSIONS, SAVE_PERMISSIONS, permissionReport }
};

export default connect(mapStateToProps, {
  savePermissions, getPermissions
})(ComparisonColumns);
