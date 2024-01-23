import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";

class BtnCellRenderer extends Component {
  constructor(props) {

    super(props);
    this.btnClickedHandler = this.btnClickedHandler.bind(this);
  }
  btnClickedHandler(props) {
  }
  render() {
    return (
      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <button onClick={this.btnClickedHandler}>Click Me!</button>
      </div>

    )
  }
}
export default BtnCellRenderer;
