import React, { Component } from "react";

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataD: '',
      PropsID: ''
    }
  }
  componentDidMount() {
    if (this.props.data) {
      let PropsData = this.props.data.billingFrequency
      let PropsID = this.props.data._id
      this.setState({ dataD: PropsData, PropsID: PropsID })
    }
  }

  setGender(event) {
  }

  render() {
    return (
      <>
        <div onChange={this.setGender.bind(this)}>
          <span style={{ 'marginRight': '10px' }}><input type="radio" value={this.state.dataD} name={this.state.PropsID} checked={this.state.dataD === "Recurring"} /> Recurring </span>
          <span style={{ 'marginRight': '10px' }}><input type="radio" value={this.state.dataD} name={this.state.PropsID} checked={this.state.dataD === "Once"} /> Once </span>
          <span style={{ 'marginRight': '10px' }}><input type="radio" value={this.state.dataD} name={this.state.PropsID} checked={this.state.dataD === "Annual"} /> Annual </span>
        </div>
      </>
    );
  }
}
