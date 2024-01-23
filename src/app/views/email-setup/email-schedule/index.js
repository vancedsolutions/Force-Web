import React, { Component } from 'react'
import { connect } from "react-redux";
import { getReport, getEmail, getCompanyByPermission, emailDelete, getAllClient } from "../../../store/actions";
import { RangeDatePicker, DatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment, { weekdays } from "moment";

import AddIcon from '../../../assets/images/ionic-ios-add-circle-outline.png';
import Modal from 'react-bootstrap/Modal';
import { saveEmail, updateEmail } from '../../../store/actions'


import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { weekDays, weekZone, fileFormat, weekDaysNew } from '../../../utils/constants'

import _ from 'lodash';

import { IoIosCloseCircleOutline } from "react-icons/io";

class EmailScheduleView extends Component {

  state = {
    show: false,
    clientName: "",
    reportList: [],
    mailList: [],
    dayList: [],
    newMail: "",
    weekZone: weekZone,
    days: weekDaysNew,
    timeZone: [],
    fileFormatData: fileFormat,
    deliveryDate: moment(new Date()).format('MM/DD/YYYY'),
    mailScheduleList: [],
    clientList: [],
    isExpanded: false,
    isAddEdit: false,
    isActivity: false,
    isActiveZone: false,
    isWeek: false,
    activeDays: [],
    companyShort: null,
    isToggle: false,
    notAccessReport: "",
    isAdminLogin: false,
    clientType: false,
    listCount: [],
    allCompany: [],
    loading: true,
    formValues: [{ clientId: "", emailValues: "", emailMal: [] }],
  }


  reportPayload = {
    endDate: moment(new Date()).format("YYYY-MM-DD"),
    startDate: moment(new Date()).subtract(90, "days").format("YYYY-MM-DD"),

  }
  async componentDidMount() {



    let data = await getReport('Report');
    let payload = {
      filterPermission: "",
      searchText: "",
      sortColumn: "companyShortName",
      sortType: "asc",
      startRow: 0
    }
    this.populateTime();
    let isTrue = new RegExp('^' + this.props.USER.company + '$', 'i').test('PCPAYADMIN')
    this.setState({
      mailScheduleList: await getEmail({
        companyShortName: this.props.USER.company
      }),
      allCompany: await getAllClient(payload),
      reportList: data,
      companyShort: this.props.USER.company,
      isAdminLogin: isTrue,
      loading: false
    });
    var qtrDate = (function () {
      var d = new Date(),
        m = d.getMonth() - d.getMonth() % 3;
      return moment(new Date(d.getFullYear(), m, 1)).format('MM-DD-YYYY');
    }());
    console.log(this.state.mailScheduleList, "this.state.mailScheduleList")
  }

  async componentDidUpdate() {
    if (this.state.isAddEdit) {
      this.setState({
        mailScheduleList: await getEmail({
          companyShortName: this.props.USER.company
        }),
        isAddEdit: false,
      })
    }
  }
  handleAccordionChange = (panel) => (event, isExpanded) => {
    // setExpandedPanel(isExpanded ? panel : false);
  };
  onSelectedDatePicker = () => (...args) => {
    if (args[0] !== undefined && args[1] !== undefined) {
      this.reportPayload.startDate = moment(args[0]).format('MM/DD/YYYY');
      this.reportPayload.endDate = moment(args[1]).format('MM/DD/YYYY');

    }
  };
  onSelectedDelivery = () => (...args) => {
    if (args[0] !== undefined && args[1] !== undefined) {
      let date = moment(args[1]).format('MM/DD/YYYY');
      this.setState({ deliveryDate: date })
    }
  }

  handleShow = () => {

    this.setState({ show: true, isActivity: false });
    this.setState({
      clientName: "",
      mailList: [],
      subject: "",
      message: "",
      id: null,
      reportName: "",
      clientList: [],
      isWeek: false,
      dayTime: this.state.timeZone[0],
      zone: this.state.weekZone[0],
      fileFormat: this.state.fileFormatData[0],
      clientType: true,
    })
  }

  populateTime = () => {
    let hours, minutes, ampm;
    let time = [];
    for (var i = 420; i <= 1320; i += 15) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      if (minutes < 10) {
        minutes = '0' + minutes; // adding leading zero
      }
      ampm = hours % 24 < 12 ? 'AM' : 'PM';
      hours = hours % 12;
      if (hours === 0) {
        hours = 12;
      }
      time.push(`${hours}:${minutes} ${ampm}`)

    }
    this.setState({
      timeZone: time
    })

  }

  onHide = () => {
    this.setState({ show: false, formValues: [{ clientId: "", emailValues: "", emailMal: [] }] });
  }

  filterCompany = async (e) => {
    e.preventDefault()
    let selectedReport = e.target.value;
    let companyList = await getCompanyByPermission({ key: e.target.value });
    let getReportLabel = this.state.reportList.filter(r => r.Key === selectedReport)[0]?.Value;

    if (this.state.isAdminLogin) {
      this.setState({
        reportSelect: getReportLabel,
        reportName: selectedReport,
        clientList: companyList?.data || []
      });
    } else {
      let getClientLabel = companyList.data.filter(r => r.companyShortName === this.state.companyShort)[0]?.companyName;
      if (getClientLabel !== undefined) {
        this.setState({
          clientName: getClientLabel, selectedClient: getClientLabel, reportSelect: getReportLabel,
          reportName: selectedReport,
        });
      } else {
        this.setState({ notAccessReport: "This report not access for client." });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.newMail.length) {
      const newMail = [...this.state.mailList, this.state.newMail];
      this.setState({ mailList: newMail, emailList: newMail, newMail: "" })
    }
  }
  handleClientChange = (e) => {
    e.preventDefault()
    let getClientLabel = this.state.clientList.filter(r => r._id === e.target.value)[0]?.companyName;
    this.setState({ clientName: getClientLabel, selectedClient: e.target.value });
  }
  handleChange = (e) => {
    const item = e.target.value
    this.setState({ newMail: item });
  }

  removeItem = (_item) => {
    const updatedState = this.state.mailList.filter((item) => item !== _item)
    this.setState({ mailList: updatedState })
  }
  btnEdit = async (item) => {


    if (this.state.isAdminLogin && item.companyType === 'Admin') {
      let reportKey = this.state.reportList.filter(res => res.Value === item.reportName)[0];
      let companyList = await getCompanyByPermission({ key: reportKey?.Key });
      this.setState({
        clientType: true,
        clientName: item.sendToEmail['client'],
        mailList: item.sendToEmail['sendTo'],
        formValues: item.sendToEmail,
        subject: item.subject,
        message: item.message,
        id: item._id,
        reportName: reportKey?.Key,
        clientList: companyList['data'],
        selectedClient: item.companyId,
        show: true,
        isActivity: true,
        reportSelect: reportKey.Value,
        fileFormat: item.fileFormat,
        zone: item.deliveryPeriod,
        dayTime: item.deliveryTime,
        deliveryDate: moment(item.deliveryDate).format('MM/DD/YYYY'),
      })
    } else {
      let reportKey = this.state.reportList.filter(res => res.Value === item.reportName)[0];
      let singleCompany = this.state.allCompany.records.filter(res => res._id === item.companyId);
      let shortName = singleCompany[0].companyShortName
      let companyList = await getCompanyByPermission({ key: reportKey?.Key });
      this.setState({
        clientType: false,
        clientName: item.sendToEmail['client'],
        mailList: item.sendToEmail['sendTo'],
        subject: item.subject,
        message: item.message,
        id: item._id,
        reportName: reportKey?.Key,
        clientList: companyList['data'],
        selectedClient: item.companyId,
        show: true,
        isActivity: true,
        reportSelect: reportKey.Value,
        fileFormat: item.fileFormat,
        zone: item.deliveryPeriod,
        dayTime: item.deliveryTime,
        companyShort: shortName,
        deliveryDate: moment(item.deliveryDate).format('MM/DD/YYYY'),
      })
    }




    if (item.deliveryPeriod === 'Daily') {
      this.setState({
        isWeek: "Daily",
        isActiveZone: false
      })
    }
    else if (item.deliveryPeriod === 'Weekly') {
      this.setState({
        isWeek: true,
        dayList: item.deliveryDayZone,
        days: item.deliveryDayZone,
        isActiveZone: true,
        isWeek: "Weekly",
      })
    }
    else if (item.deliveryPeriod === 'Monthly') {
      this.setState({
        isWeek: "Monthly",
        isActiveZone: true
      })
    }
    else {
      this.setState({
        isWeek: "Quartly",
        isActiveZone: false
      })
    }

  }
  btnDelete = async (id) => {
    let result = await emailDelete(id);
    if (result !== undefined) {
      this.setState({
        isAddEdit: true
      })
    }
  }

  changeWeekZone = (e) => {
    let weekDays = e.target.value;

    if (weekDays === 'Daily') {
      this.setState({
        isWeek: "Daily",
        zone: weekDays,
        isActiveZone: false
      })
    }
    else if (weekDays === 'Weekly') {
      this.setState({
        isWeek: "Weekly",
        zone: weekDays,
        dayZone: this.state.days[0],
        isActiveZone: true
      })
    }
    else if (weekDays === 'Monthly') {
      this.setState({
        isWeek: "Monthly",
        zone: weekDays,
        isActiveZone: true
      })
    }
    else {
      this.setState({
        isWeek: "Quartly",
        zone: weekDays,
        isActiveZone: false
      })
    }

  }

  saveEmail = async ($e) => {

    $e.preventDefault();
    if (this.state.isAdminLogin && this.state.clientType) {
      let payload = {
        reportName: this.state.reportSelect,
        reportStartDate: this.reportPayload.startDate,
        reportEndDate: this.reportPayload.endDate,
        deliveryDate: this.state.deliveryDate,
        deliveryDayZone: this.state.dayZone,
        deliveryTime: this.state.dayTime,
        deliveryPeriod: this.state.zone,
        sendToEmail: this.state.formValues,
        subject: this.state.subject,
        message: this.state.message,
        fileName: `${this.state.reportSelect}.${this.state.fileFormat}`,
        fileFormat: this.state.fileFormat,
        companyId: this.state.companyShort,
        companyType: null,
      }
      if (this.state.isActivity) {
        payload.id = this.state.id;
        let response = await updateEmail(payload);
        if (response.data != null) {
          this.setState({ isAddEdit: true, formValues: [{ clientId: "", emailValues: "", emailMal: [] }] })
          this.onHide();
        }
      } else {
        let response = await saveEmail(payload);
        if (response.data != null) {
          this.setState({ isAddEdit: true, formValues: [{ clientId: "", emailValues: "", emailMal: [] }] })
          this.onHide();
        }
      }



    } else {
      let payload = {
        reportName: this.state.reportSelect,
        reportStartDate: this.reportPayload.startDate,
        reportEndDate: this.reportPayload.endDate,
        deliveryDate: this.state.deliveryDate,
        deliveryDayZone: this.state.dayZone,
        deliveryTime: this.state.dayTime,
        deliveryPeriod: this.state.zone,
        sendToEmail: {
          client: this.state.clientName,
          sendTo: this.state.mailList
        },
        subject: this.state.subject,
        message: this.state.message,
        fileName: `${this.state.reportSelect}.${this.state.fileFormat}`,
        fileFormat: this.state.fileFormat,
        companyId: this.state.companyShort,
        companyType: null,
      }

      if (this.state.isActivity) {
        payload.id = this.state.id;
        let response = await updateEmail(payload);
        if (response.data != null) {
          this.setState({ isAddEdit: true })
          this.onHide();
        }
      } else {
        let response = await saveEmail(payload);
        if (response.data != null) {
          this.setState({ isAddEdit: true })
          this.onHide();
        }
      }

    }


  }


  handleDays = (e) => {
    const selectValue = e.target.value
    this.state.days.forEach((res) => {
      if (res.day == selectValue) {
        if (res.isActive === true) {
          res.isActive = false
        } else (
          res.isActive = true
        )
      }
    });
    this.setState({ dayZone: this.state.days })
  }

  ToggleMenu = () => {
    this.setState({
      isToggle: !this.state.isToggle
    })
    console.log(this.state.isActive)
  }



  handleChangeAdmin = (i, e) => {
    let formValues = this.state.formValues;
    formValues[i][e.target.name] = e.target.value;
    this.setState({ formValues, newMail: e.target.value });
  }

  removeItemAdmin = (pi, ci) => {
    let formValues = this.state.formValues;
    formValues[pi].emailMal.splice(ci, 1)
    this.setState({ formValues, newMail: "" })
  }

  handleSubmitMultiple = (i) => {

    let formValues = this.state.formValues;
    if (this.state.newMail.length) {
      const newMail = [this.state.newMail];
      // const allNewMail = [...this.state.mailList, this.state.newMail];
      formValues[i].emailValues = ""
      formValues[i].emailMal.push(newMail)
      this.setState({ formValues })
    }
  }

  handleChangeNew = (i, e) => {
    let formValues = this.state.formValues;
    formValues[i][e.target.name] = e.target.value;
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState(({
      formValues: [...this.state.formValues, { clientId: "", emailMal: [] }]
    }))
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }


  render() {

    return (
      <>
        <div className="table-header d-flex align-items-center justify-content-between">
          <button className="add_order" onClick={this.handleShow}><img src={AddIcon} alt="" /> Add </button>
        </div>
        <div className="shadow_white_box full-box mt-0">
          <div className="row">
            {this.state.loading ? <div>Loading...</div> : <>
              {this.state.mailScheduleList.map((item, i) => (
                <div className="col-4" key={i}>
                  <div className="emailColumn">
                    <div className="email-box">
                      <div className="row align-items-center justify-content-between">
                        <div className="col-6">
                          <div className="email-filed">
                            <div className="emailLabel ">Creator {item.companyType === 'Admin' ? <span className="CrRole timeBg">{item.companyType}</span> : <span className="CrRole client_color timeBg"> {item.companyType}</span>}</div>
                            <div className="clientName">
                              {item.companyType}
                              {/* {Array.isArray(item.sendToEmail) ?
                              <>
                                {item.sendToEmail.map((el, i) => (
                                  <span key={i} >{el.clientId}, </span>
                                ))}
                              </> :
                              item.companyType.client
                            } */}

                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="email-filed text-end">
                            <div className="emailLabel">Created Date & Time</div>
                            <div className="emailTime timeBg">{item.deliveryDate} {item.deliveryTime} </div>
                          </div>
                        </div>
                      </div>
                      <div className="row align-items-center justify-content-between mt-3">
                        <div className="col-6">
                          <div className="email-filed">
                            <div className="emailLabel">Report</div>
                            <div className="reportName">{item.fileName}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="email-filed text-end">
                            <div className="emailLabel">Clients</div>
                            <div className="clientCount">
                              {Array.isArray(item.sendToEmail) ?

                                item.sendToEmail?.length
                                :
                                item.sendToEmail.sendTo?.length
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="action">
                      <button className="btn btn-primary" onClick={() => this.btnEdit(item)} ><EditIcon /></button>{" "}
                      <button className="btn btn-primary" onClick={() => this.btnDelete(item._id)}><DeleteIcon /></button>
                    </div>
                  </div>

                </div>
              ))}
            </>}
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.onHide} centered >
          <Modal.Header>
            <Modal.Title>{this.state.isActivity ? 'Edit' : 'Add'} Schedule</Modal.Title>
            <button className="btn close-btn" onClick={this.onHide}> x </button>
          </Modal.Header>
          <Modal.Body>
            <div className="row align-items-center justify-content-between mt-3">
              <div className="col-5">
                <div className="email-filed">
                  <div className="emailLabel">Select The Report</div>
                </div>
              </div>
              <div className="col-7">
                <div className="select-option text-end">
                  <select value={this.state.reportName} onChange={(e) => this.filterCompany(e)}>)
                    <option value="" key="report1">--Select Report--</option>
                    {this.state.reportList.map(item => (
                      <option
                        key={item.Key}
                        value={item.Key}
                      >
                        {item.Value}
                      </option>
                    ))}
                  </select>
                  <span className="text-danger"><small>{this.state.notAccessReport}</small></span>
                </div>
              </div>
            </div>

            <div className="row align-items-center justify-content-between mt-3">
              <div className="col-5">
                <div className="email-filed">
                  <div className="emailLabel">Report Calendar Range</div>
                </div>
              </div>
              <div className="col-7">
                <div className="select-option text-end">
                  <RangeDatePicker
                    initialStartDate={this.reportPayload.startDate}
                    initialEndDate={this.reportPayload.endDate}
                    startPlaceholder="Start Date"
                    endPlaceholder="End Date"
                    className="RangeDatePicker" dateFormat="MM/DD/YYYY" onChange={this.onSelectedDatePicker()} />
                </div>
              </div>
            </div>

            <div className="row align-items-center justify-content-between mt-3">
              <div className="col-5">
                <div className="email-filed">
                  <div className="emailLabel">Select Delivery Date & Time</div>
                </div>
              </div>
              <div className="col-7">
                <div className="row align-items-center  mt-3">
                  <div className="col-4">
                    <div className="select-option text-end">
                      <select className="roleSelect" value={this.state.zone} onChange={(e) => this.changeWeekZone(e)}>

                        {this.state.weekZone.map(el => (
                          <option key={el} value={el}>{el}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {this.state.isActiveZone ?
                    <div className="col-4">
                      {this.state.isWeek === "Weekly" ? (<div className="select-option text-end">
                        <div id="list1" className="dropdown-check-list" tabindex="100">
                          <span className="anchor" onClick={() => this.ToggleMenu()}>Select Day</span>
                          {this.state.isToggle ? <ul className="items">
                            {this.state.days.map(el => (
                              <li key={el.day}><input type="checkbox" defaultChecked={el.isActive} value={el.day} onChange={this.handleDays} /> {el.day}</li>
                            ))}
                          </ul> : null}
                        </div>
                      </div>) : null}

                      {this.state.isWeek === "Monthly" ? (<div className="select-option text-end">
                        <DatePicker
                          initialDate={this.state.deliveryDate}
                          className="DatePicker" dateFormat="MM/DD/YYYY" onChange={this.onSelectedDelivery()} />
                      </div>) : null}
                    </div>
                    : null}

                  <div className="col-4">
                    <div className="select-option text-end">
                      <select className="roleSelect" value={this.state.dayTime} onChange={(e) => this.setState({ dayTime: e.target.value })}>
                        {this.state.timeZone.map(el => (
                          <option key={el} value={el}>{el}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {this.state.isWeek === "Quartly" ? (
                    <div className="col-4">
                      <div className="select-option text-end">
                        <small>Quarter starts from start date</small>
                      </div>
                    </div>) : null}
                </div>
              </div>
            </div>


            <div className="email_outer_full">
              {this.state.isAdminLogin && this.state.clientType ?
                <>
                  {this.state.formValues.map((element, index) => (
                    <Accordion key={index} className="Accordion_panel">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className="Accordion_header">
                        <Typography className="titleAccording">
                          Client :  {element.clientId}
                        </Typography>

                        {index ? <button type="button" className="button remove" onClick={() => this.removeFormFields(index)}><IoIosCloseCircleOutline></IoIosCloseCircleOutline></button> : null}

                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="add_email_field">
                          <div className="row align-items-center justify-content-between mt-3">
                            <div className="col-6">
                              <div className="select-option text-end add_email_content">
                                <select className="roleSelect" value={element.clientId || ""} onChange={e => this.handleChangeNew(index, e)} name="clientId">
                                  <option value="" key="client">Select Client</option>
                                  {this.state.clientList.map((el, i) => (
                                    <option key={i} value={el.companyName}>{el.companyName}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="add_email_content">
                                <div className="add_accor_outer">

                                  <input className="email_with_btn" placeholder="Send To " type="email" name="emailValues" value={element.emailValues || ""} onChange={e => this.handleChangeAdmin(index, e)} />
                                  <button className="btn btn-default custom_add_btn" onClick={() => this.handleSubmitMultiple(index)}>Add</button>
                                </div>
                              </div>
                            </div>
                            <div className="email_List_field">
                              {element.emailMal.map((el, i) => {
                                return (
                                  <span className="list_email_span" key={i} >{el} <span onClick={() => this.removeItemAdmin(index, i)} className="delete_item" >X</span></span>
                                );
                              })}
                            </div>

                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  <div className="add_accor_outer">
                    <button className="btn btn-default custom_add_btn" onClick={() => this.addFormFields()} >Add</button>
                  </div>
                </>
                :
                <Accordion >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography className="titleAccording">
                      Client :  {this.state.clientName}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="add_email_field">
                      <div className="client_accordion">
                        <div className="row align-items-center justify-content-between">
                          <div className="col-12">
                            <div className="add_email_content">
                              <form onSubmit={this.handleSubmit}>
                                <div className="add_accor_outer">  <input className="email_with_btn" placeholder="Send To " type="email" value={this.state.newMail} onChange={this.handleChange} />
                                  <button className="btn btn-default custom_add_btn" disabled={!this.state.newMail.length}>Add</button></div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="email_List_field">
                          {this.state.mailList.map((el, i) => (
                            <span className="list_email_span" key={i} >{el} <span onClick={() => this.removeItem(el)} className="delete_item" >X</span></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              }
            </div>

            <div className="outer-border">
              <div className="row align-items-center justify-content-between">
                <div className="col-12">
                  <div className="output-content">
                    <div className="subject-fields">
                      <label className="mail-label">Subject</label>
                      <input type="text" value={this.state.subject} onChange={(e) => this.setState({ subject: e.target.value })} />
                    </div>
                    <div className="message-fields">
                      <label className="mail-label">Message</label>
                      <textarea value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-center justify-content-between mt-3">
              <div className="col-12">
                <div className="select-format ">
                  <label className="mail-label">Set The Report File Format</label>
                  <select className="roleSelect" value={this.state.fileFormat} onChange={(e) => this.setState({ fileFormat: e.target.value })}>
                    {this.state.fileFormatData.map(el => (
                      <option key={el} value={el}>{el}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>



          </Modal.Body>
          <Modal.Footer>
            <button className="btn close-btn" onClick={this.onHide}>
              Close
            </button>
            <button className="btn save-btn" onClick={this.saveEmail} >
              {this.state.isActivity ? "Update" : 'Save'}
            </button>
          </Modal.Footer>
        </Modal>

      </>
    )
  }
}

const mapStateToProps = ({ USER, ItemsOrderR, EDIT_CLIENT_DATA }) => ({ USER, ItemsOrderR, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, {})(EmailScheduleView);
