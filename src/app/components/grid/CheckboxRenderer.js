import React, { Component } from "react";

export default class extends Component {

  constructor(props) {
    super(props);
    this.checkedHandler = this.checkedHandler.bind(this);
  }
  checkedHandler(event) {
   
    let checked = event.target.checked;
    let colId = this.props.column.colId;
    let data = this.props.data;
    data.isBillable = checked;
    this.props.onChanged(data);
    this.props.node.setDataValue(colId, checked);
  }

  render() {
    return (
      <input
        type="checkbox" 
        onChange={this.checkedHandler}
        defaultChecked={this.props.value}
      />
    );
  }
}
