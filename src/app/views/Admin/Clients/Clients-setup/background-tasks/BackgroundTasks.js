import React, { Component } from "react";
import find from "lodash/find";
import { connect } from "react-redux";
import {
  getBackgroundTasks,
  updateClientBGTask,
} from "../../../../../store/actions";

//import scss
import "./BackgroundTasks.scss";
import Switch from "../../../../../components/ui/switch/Switch";

class BackgroundTasksList extends Component {
  state = {
    tasks: [],
    originalTasks: [], isAction: false

  };

  async componentDidMount() {

    const company = this.props.reportSettingsTab.settingsTab.isSelectedRowData;
    await this.props.getBackgroundTasks();
    this.populateList(company.companyId);

  }

  updateTask = async (index) => {

    const company = this.props.reportSettingsTab.settingsTab.isSelectedRowData;

    await this.props.updateClientBGTask({
      ...this.state.tasks[index],
      clientId: company.companyId,
    });
    this.setState({ tasks: [], originalTasks: [] });
    this.populateList(company.companyId);
    this.setState({ isAction: false })
  };

  populateList = async (id) => {

    await this.props.backgroundTasks.map((task) => {
      let exists = find(task.clients, (cl) => {
        return Number(cl.client) === Number(id) && cl.value === true;
      });

      if (exists) {
        return this.setState((prevState) => ({
          tasks: [
            ...prevState.tasks,
            { name: task.name, label: task.label, value: true },
          ],
          originalTasks: [
            ...prevState.tasks,
            { name: task.name, label: task.label, value: true },
          ],
        }));
      }

      this.setState((prevState) => ({
        tasks: [
          { name: task.name, label: task.label, value: false },
        ],
        originalTasks: [
          { name: task.name, label: task.label, value: false },
        ],
      }));
    });
  };

  toggleClient = (taskIdx, val) => {
    this.setState({ isAction: true })
    this.setState((prevState) => {
      let newTasks = [...prevState.tasks];
      let task = { ...newTasks[taskIdx] };
      task.value = val;
      newTasks[taskIdx] = task;
      return { tasks: newTasks };
    });

  };
  render() {
    return (

      <div className="reportTitle  background-tasks">
        {this.state.tasks.map((task, index) => (

          <div key={index} className="bg_task_wrpr">

            <div className="d-flex align-items-center justify-content-between">
              <span> {task.label}</span>
              <Switch
                switchAction={this.toggleClient}
                id={index}
                value={task.value}
              ></Switch>
            </div>
          </div>

        ))}
        <div className="df align-items-end jcfe mt-3">
          <button className="btn reportBtn" onClick={() => this.updateTask(0)} disabled={!this.state.isAction}>Save {/* task.value === false */}</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ backgroundTasks }) => ({ backgroundTasks });

export default connect(mapStateToProps, {
  getBackgroundTasks,
  updateClientBGTask,
})(BackgroundTasksList);
