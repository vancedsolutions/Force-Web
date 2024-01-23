import React, { Component } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {

  constructor(props) {
    super(props);
    this.state={
      dataD:'',
      PropsID:'',
    }
    this.onChangeValue = this.onChangeValue.bind(this);
  }
  componentDidMount() {
    if (this.props.data) {
      let PropsData = this.props.data.billingFrequency
      let PropsID =  this.props.data.systemId
      this.setState({dataD:PropsData, PropsID:PropsID,data:this.props.data})
    }
  }

  onChangeValue(event) {
    let data = this.props.data;
    data.billingFrequency = event.target.value;
    data.systemId = event.target.name;
    this.props.onChanged(data);
    this.setState({dataD:event.target.value})
  }

  render() {
    return (
      <>
        <div onChange={this.onChangeValue.bind(this)}>
         <span style={{'marginRight': '10px'}}><input type="radio" value="Recurring" name={this.state.PropsID} checked={this.state.dataD === "Recurring"} /> Recurring </span>
         <span style={{'marginRight': '10px'}}><input type="radio" value="Once" name={this.state.PropsID} checked={this.state.dataD === "Once"}/> Once </span>
         <span style={{'marginRight': '10px'}}><input type="radio" value="Annual" name={this.state.PropsID} checked={this.state.dataD === "Annual"}/> Annual </span> 
        </div>
      </>
    );
  }
}
