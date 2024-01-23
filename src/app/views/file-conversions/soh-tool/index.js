import React, {
  Component
} from "react";
import uploadIcon from '../../../assets/images/Icon feather-upload-cloud.png'
// import scss
import "./style.scss";
import * as XLSX from 'xlsx';
import _ from 'lodash';
import moment from 'moment';
import Loader from "../../../components/loader/Loader";
import {
  connect
} from "react-redux";
import {
  MinWageAction,
  EarningCodeAction,
  getDefaultCostCenterByCompany,
  getCostCenterByCompanyCode
} from "../../../store/actions";
import {
  HeaderFormat
} from "../../../utils/excelHeader";
import {
  ToastContainer,
  toast
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

class ConversationTools extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  state = {
    src: null,
    file: null,
    fileConvertError: false,
    fileName: null,
    dragging: false,
    exportEarningCode: '',
    header: [],
    currentIndex: 0,
    currentIndexCompany: 0,
    currentIndexEmployeeId: 0,
    currentIndexEmployeeName: 0,
    currentIndexCC2: 0,
    currentIndexCC2ID: 0,
    currentIndexexternalID: 0,
    currentIndexHours: 0,
    currentIndexBaseRate: 0,
    currentIndexStartDate: 0,
    currentIndexShift: 0,
    currentIndexStartTime: 0,
    currentIndexEndTime: 0,
    currentIndexPayStatementType: 0,
    currentIndexCC2Plan: 0,
    currentIndexCC3: 0,
    DefaultCostCenter: [{
      value: 0,
      text: "CC1"
    },
    {
      value: 1,
      text: "CC2"
    },
    {
      value: 2,
      text: "CC3"
    },
    {
      value: 3,
      text: "CC4"
    },
    {
      value: 4,
      text: "CC5"
    },
    {
      value: 5,
      text: "CC6"
    },
    {
      value: 6,
      text: "CC7"
    },
    {
      value: 7,
      text: "CC8"
    },
    {
      value: 8,
      text: "CC9"
    },
    ]
  };

  componentDidMount() {

    // this.props.setNavInfo("Conversation Tool");
    this.fetchMinWage();

  }


  onSelectFile = (e, drop) => {

    let file = drop ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    this.setState({
      file: file,
      fileConvertError: null,
      fileName: file.name,

    });
    // reader.readAsText(file);
    reader.readAsDataURL(file);
    reader.onload = (res) => this.setState({
      src: res.target.result
    });
  };
  uploadFile = () => {

    const fileName = this.state.fileName;
    const currentDate = new Date();
    const currentFileName = 'SOH' + '_' + (currentDate.getMonth() + 1) + '_' + currentDate.getDate() + '_' + currentDate.getFullYear() + '_' + currentDate.getHours() + '_' + currentDate.getMinutes() + '_' + currentDate.getSeconds() + '_' + fileName;
    const i = this.state.src.indexOf("base64,");
    const buffer = Buffer.from(this.state.src.slice(i + 7), "base64");
    const file = new File([buffer], fileName, {
      type: "application/vnd.ms-excel",
    });

    const reader = new FileReader();
    reader.onload = async (evt) => {

      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, {
        type: 'binary'
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      let data = XLSX.utils.sheet_to_json(ws, {
        raw: false,
        header: 1
      });

      let jsonDatadata = this.xlsxToJson(data);
      let sortData = _.sortBy(jsonDatadata,
        [HeaderFormat.EmployeeId, HeaderFormat.StartDate]);

      data = this.toCSV(sortData)
      /**replace the header */
      for (let i = 0; i < data.length; i++) {
        if (data[i].length > 0) {
          if (data[i][0].toLowerCase() === "Company".toLowerCase()) {
            this.setState({
              header: data[i]
            });
            data.splice(i, 1);

            break;
          }
        }

      }



      let curRowEmployeeID = 0;
      let curHour = 0;
      let curRowDate = '';

      let minHour = 10;
      let newData = [];
      let tempData = [];
      let curExternal = "";
      let prevEmployedid = "";
      let prevStartDate = "";
      let finalBaseRate = 0;
      let checkWage = false;
      let baseRate = 0;
      let indexInfo = 0;
      this.setState({ loading: true });
      let colHeader = ["Company", "Employee ID", "Employee Name", "CC2", "CC2 ID", "E/D/T External ID", "Hours", "Base Rate", "Start Date", "Pay Statement Type"];
      tempData.push(colHeader);
      newData.push(colHeader);
      data = data.filter(element => {
        return element[0] !== undefined
      })
      const getCompany = _.uniqBy(data.map(res => res[0]?.toUpperCase()));



      this.setState({
        Company: getCompany[0]
      });
      await this.fetchDefaultIndex();

      if (!this.state.defaultIndex) {
        return;
      }

      await this.fetchEarningCode();
      if (!this.state.earningCodeList.length) {
        return;
      }
      this.setState({
        currentIndexCompany: this.excelHeaderIndex(HeaderFormat.Company),
        currentIndexEmployeeId: this.excelHeaderIndex(HeaderFormat.EmployeeId),
        currentIndexEmployeeName: this.excelHeaderIndex(HeaderFormat.EmployeeName),
        currentIndexCC2: this.excelHeaderIndex(HeaderFormat.CC2),
        currentIndexCC2ID: this.excelHeaderIndex(HeaderFormat.CC2ID),
        currentIndexexternalID: this.excelHeaderIndex(HeaderFormat.externalID),
        currentIndexHours: this.excelHeaderIndex(HeaderFormat.Hours),
        currentIndexBaseRate: this.excelHeaderIndex(HeaderFormat.BaseRate),
        currentIndexStartDate: this.excelHeaderIndex(HeaderFormat.StartDate),
        currentIndexShift: this.excelHeaderIndex(HeaderFormat.Shift),
        currentIndexStartTime: this.excelHeaderIndex(HeaderFormat.StartTime),
        currentIndexEndTime: this.excelHeaderIndex(HeaderFormat.EndTime),
        currentIndexPayStatementType: this.excelHeaderIndex(HeaderFormat.PayStatementType),
        currentIndexCC2Plan: this.excelHeaderIndex(HeaderFormat.CC2Plan),
        currentIndexCC3: this.excelHeaderIndex(HeaderFormat.CC3)
      })


      for (var i = 0; i < data.length; i++) {

        indexInfo = data[i];
        if (data[i][this.state.currentIndex] !== undefined && data[i][this.state.currentIndex] !== null) {
          let wageSearchData = data[i][this.state.currentIndex].toString().toLowerCase();
          // eslint-disable-next-line no-loop-func
          let wageTemp = data[i][this.state.currentIndex] !== undefined ?
            _.filter(this.state.costCenterMinWage, res => (res.abbreviation?.toString().toLowerCase() === wageSearchData)
              || (res.name?.toString().toLowerCase() === wageSearchData)
              || (res.location?.toString().toLowerCase() === wageSearchData)
              || (res.externalId?.toString().toLowerCase() === wageSearchData)
              || (res.treeIndex?.toString().toLowerCase() === wageSearchData))
            : [];

          // eslint-disable-next-line no-loop-func
          let externalCode = data[i][this.state.currentIndex] !== undefined
            ? _.filter(this.state.earningCodeList, res => res['companyShortCode'].toString().toLowerCase() === data[i][this.state.currentIndexCompany].toString().toLowerCase()) : [];
          if (wageTemp.length && externalCode.length) {
            checkWage = true;
            tempData.push([
              data[i][this.state.currentIndexCompany],
              data[i][this.state.currentIndexEmployeeId],
              data[i][this.state.currentIndexEmployeeName],
              data[i][this.state.currentIndexCC2],
              data[i][this.state.currentIndexCC2ID],
              data[i][this.state.currentIndexexternalID],
              data[i][this.state.currentIndexHours],
              data[i][this.state.currentIndexBaseRate],
              data[i][this.state.currentIndexStartDate],
              data[i][this.state.currentIndexPayStatementType]
            ])
          } else {
            checkWage = false;
            break;
          }
        }
      }
      if (!checkWage) {
        console.error(indexInfo)
        toast.error(`Please contact is administrator `, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.clear();
        return;
      }

      let jsonData = this.xlsxToJson(tempData);

      for (let i = 0; i < data.length; i++) {
        curRowDate = data[i][this.state.currentIndexStartDate];
        curRowEmployeeID = data[i][this.state.currentIndexEmployeeId];
        curHour = data[i][this.state.currentIndexHours];
        curExternal = data[i][this.state.currentIndexexternalID];
        baseRate = data[i][this.state.currentIndexBaseRate];
        // this.setState({external:data[i][this.state.currentIndex]?.toString()})

        if (curRowDate !== undefined && curRowEmployeeID !== undefined && curHour !== undefined && curExternal !== undefined && baseRate !== undefined) {

          // eslint-disable-next-line no-loop-func
          let result = _.filter(jsonData, res => res['Employee ID'] === curRowEmployeeID && res['Start Date'] === curRowDate);

          let searchWageData = data[i][this.state.currentIndex] !== undefined ? data[i][this.state.currentIndex].toString().toLowerCase() : this.state.blankLocation;
          let wage = _.filter(this.state.costCenterMinWage, res => (res.abbreviation?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.name?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.location?.toString().toLowerCase() === searchWageData) || (res.externalId?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.treeIndex?.toString().toLowerCase() === searchWageData.toLowerCase())); /**get Min wage */

          let wageData = this.getFatchDateWage(wage, curRowDate); /**check the min wage by date  */
          let wageLocation = _.filter(wageData, res => (res.abbreviation?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.name?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.location?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.externalId?.toString().toLowerCase() === searchWageData.toLowerCase()) || (res.treeIndex?.toString().toLowerCase() === searchWageData.toLowerCase()));


          /**get the external code by companyShortcode */
          // eslint-disable-next-line no-loop-func
          let externalCode = _.filter(this.state.earningCodeList, res => res['companyShortCode'].toLowerCase() === data[i][this.state.currentIndexCompany].toLowerCase() && (res['earningCode']?.toString().toLowerCase().trim() === curExternal?.toString().toLowerCase().trim() || res['externalId']?.toString().toLowerCase().trim() === curExternal?.toString().toLowerCase().trim() || res['abbreviation']?.toString().toLowerCase().trim() === curExternal?.toString().toLowerCase().trim()))[0];
          this.setState({ exportEarningCode: externalCode.exportEarningCode })
          if (wageLocation.length > 0 && externalCode !== undefined) {
            if (result.length > 1) {
              if (prevEmployedid !== curRowEmployeeID || prevStartDate !== curRowDate) {

                if (externalCode.regular || externalCode.overTime) {
                  let calcFinalData = this.calcFinalBaseRate(result, wageLocation[0].minWage);
                  if (calcFinalData.hours > minHour) {
                    newData.push([
                      data[i][this.state.currentIndexCompany],
                      data[i][this.state.currentIndexEmployeeId],
                      data[i][this.state.currentIndexEmployeeName],
                      data[i][this.state.currentIndexCC2],
                      data[i][this.state.currentIndexCC2ID],
                      this.state.exportEarningCode, 1,
                      calcFinalData.baserate,
                      data[i][this.state.currentIndexStartDate],
                      data[i][this.state.currentIndexPayStatementType]
                    ])
                    prevEmployedid = curRowEmployeeID;
                    prevStartDate = curRowDate;
                  }
                }

              }

            } else {
              if (curHour > minHour) {

                if (externalCode.regular && !externalCode.exclude) {
                  finalBaseRate = this.calcHhaHours(parseFloat(curHour), wageLocation[0].minWage, parseFloat(baseRate))
                  newData.push([
                    data[i][this.state.currentIndexCompany],
                    data[i][this.state.currentIndexEmployeeId],
                    data[i][this.state.currentIndexEmployeeName],
                    data[i][this.state.currentIndexCC2],
                    data[i][this.state.currentIndexCC2ID],
                    this.state.exportEarningCode,
                    1,
                    finalBaseRate,
                    data[i][this.state.currentIndexStartDate],
                    data[i][this.state.currentIndexPayStatementType]
                  ])

                } else if (externalCode.overTime && !externalCode.exclude) {
                  finalBaseRate = this.calcHhaOT(parseFloat(curHour), wageLocation[0].minWage, parseFloat(baseRate))
                  newData.push([
                    data[i][this.state.currentIndexCompany],
                    data[i][this.state.currentIndexEmployeeId],
                    data[i][this.state.currentIndexEmployeeName],
                    data[i][this.state.currentIndexCC2],
                    data[i][this.state.currentIndexCC2ID],
                    this.state.exportEarningCode,
                    1,
                    finalBaseRate,
                    data[i][this.state.currentIndexStartDate],
                    data[i][this.state.currentIndexPayStatementType]
                  ])

                }
              }
            }
          }

          checkWage = true;
        } else {
          checkWage = false;

          break;
        }
      }
      if (!checkWage) {

        toast.error('Wrong Format CSV File, please try again', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.clear();
        return;

      }


      const ws1 = XLSX.utils.aoa_to_sheet(newData);
      const wb1 = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb1, ws1, "SheetJS");
      /* generate XLSX file and send to client */
      XLSX.writeFile(wb1, currentFileName);
      this.clear();

    };

    reader.readAsBinaryString(file);
    this.fileInput.current.value = null;


  };

  excelHeaderIndex(val) {
    let getIndex = this.state.header.findIndex(res => res.toLowerCase() === val.toLowerCase());
    return getIndex;
  }
  clear() {
    this.setState({ loading: false });
    this.setState({
      src: null,
      fileName: "",

    });
  }



  getFatchDateWage = (data, startDate) => {

    _.forEach(data, (res) => {
      if (res.endDate === undefined || res.endDate === "" || res.endDate === null) {
        res.endDate = new Date();
      }
      let d1 = moment(new Date(startDate), 'MM/DD/YYYY');
      let d2 = moment(new Date(res.endDate), 'MM/DD/YYYY');
      let diff = d2.diff(d1, 'days');
      res['days'] = diff;

    })

    return data.filter(a => a.days > 0).sort(s => s.days);
  }

  fetchMinWage = async () => {
    await this.props.MinWageAction();
    let wageList = this.props.CONVERSION_TOOL;
    if (wageList !== undefined && wageList.length > 0) {
      wageList.forEach(res => {
        res.location = res.country.name
      });
      this.setState({
        wage: wageList
      });
    }


  }
  fetchDefaultIndex = async () => {
    let payload = this.state.Company;
    await this.props.getDefaultCostCenterByCompany(payload);
    let defaultValue = this.props.COST_CENTERS['DEFAULT_COST_CENTER_BY_COMPANY'];
    if (defaultValue !== undefined && defaultValue !== null) {
      let costcenterIndex = defaultValue.value;
      let index = this.state.DefaultCostCenter.filter(res => res.value === costcenterIndex)[0].text;

      if (this.excelHeaderIndex(index) !== -1) {
        this.setState({
          currentIndex: this.excelHeaderIndex(index),
          defaultIndex: costcenterIndex,
          blankLocation: defaultValue.blankTitle
        })
      } else {
        toast.error('Wrong Format CSV File please try again', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.clear();
        return;
      }

    } else {
      toast.error('Cost Center not mapped, please try again', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.clear();
      return;
    }



  }
  toCSV = (json) => {
    var data = [];
    var keys = (json[0] && Object.keys(json[0])) || [];
    data.push(keys)
    for (var line of json) {
      data.push(keys.map(key => line[key]))
    }
    return data;
  }

  fetchEarningCode = async () => {

    let payload = this.state.Company;
    await this.props.EarningCodeAction({
      companyShortName: payload
    });
    let earningCode = this.props.CONVERSION_TOOL;
    earningCode.forEach(element => {
      element.companyShortCode = element['company'].companyShortName;
    });
    this.setState({
      earningCodeList: earningCode
    });
    await this.props.getCostCenterByCompanyCode(payload);

    let costCenterList = this.props.COST_CENTERS['COST_CENTER_BY_COMPANY_CODE'];
    let defaultCostCenterList = costCenterList.filter(res => res.treeIndex === Number(this.state.defaultIndex) + 1); //get the default index
    let minwage = [];
    defaultCostCenterList.forEach(cc => {
      this.state.wage.forEach(mw => {
        if (cc.country === mw.country?._id) {
          let wage = {
            ...cc,
            ...mw
          }
          minwage.push(wage);
        }
      })
    })

    this.setState({
      costCenterMinWage: minwage
    });
  }

  xlsxToJson = (data) => {
    let first = data[0].join();
    let headers = first.split(',');
    let jsonData = [];
    for (let i = 1, length = data.length; i < length; i++) {
      let obj = {};
      for (let x = 0; x < data[i].length; x++) {
        obj[headers[x]] = data[i][x];
      }
      jsonData.push(obj);

    }
    return jsonData;

  }
  calcFinalBaseRate(data, minwage) {
    let creditItem = [];
    let finalMinWage = 0;
    let countBaseRate = 0;
    let TotalHour = 0;
    let finalBaseRate = {};
    data.forEach(element => {
      let externalCode = _.filter(this.state.earningCodeList, (res) => res.earningCode?.toLowerCase() === element['E/D/T External ID']?.toString().toLowerCase().trim() || res.externalId?.toString().toLowerCase().trim() === element['E/D/T External ID']?.toString().toLowerCase().trim())[0];
      if (externalCode.regular) {

        creditItem.push({
          hours: parseFloat(element['Hours']),
          credit: (parseFloat(element['Base Rate']) - minwage) * parseFloat(element['Hours'])
        });
      } else if (externalCode.overTime) {
        finalMinWage = 1.5 * minwage;
        creditItem.push({
          hours: parseFloat(element['Hours']),
          credit: (parseFloat(element['Base Rate']) - finalMinWage) * parseFloat(element['Hours'])
        });
      }

    });

    for (let j = 0; j < creditItem.length; j++) {
      if (j === 0) {
        if (creditItem[j].credit > 0) {
          countBaseRate = minwage - creditItem[j].credit;
          TotalHour = creditItem[j].hours;
        } else {
          countBaseRate = minwage;
          TotalHour = TotalHour + creditItem[j].hours;
        }
      } else {
        if (creditItem[j].credit > 0) {
          countBaseRate = countBaseRate - creditItem[j].credit;
          TotalHour = TotalHour + creditItem[j].hours;
        } else {
          countBaseRate = minwage;
          TotalHour = TotalHour + creditItem[j].hours;
        }
      }
    }
    if (countBaseRate > 0) {
      finalBaseRate.baserate = countBaseRate;
    } else
      finalBaseRate.baserate = minwage;

    finalBaseRate.hours = TotalHour;
    return finalBaseRate;
  }



  calcHhaHours = (hours, minwage, baserate) => {
    let finalBaseRate = 0;
    let credit = 0;
    if (baserate > minwage) {
      if (minwage === baserate) {
        return minwage;
      } else {
        credit = (baserate - minwage) * hours;
        finalBaseRate = minwage - credit > 0 ? (minwage - credit) : minwage;
        if (finalBaseRate > 0) {
          return finalBaseRate;
        } else {
          return minwage;
        }

      }
    } else {
      return minwage;
    }
  }
  calcHhaOT = (hours, minwage, baserate) => {
    let finalBaseRate = 0;
    let finalMinWage = 0;
    let credit = 0;
    if (baserate > minwage) {
      if (minwage === baserate) {
        return minwage;
      } else {
        finalMinWage = 1.5 * minwage;
        credit = (baserate - finalMinWage) * hours;
        if (credit > 0) {
          finalBaseRate = minwage - credit > 0 ? (minwage - credit) : minwage;
          return finalBaseRate;
        } else {
          return minwage;
        }
      }
    } else {
      return minwage;
    }
  }
  render() {
    const { loading } = this.state;
    return (

      <div className="ConversationTools">
        <p className="title-field">SPREAD OF HOURS</p>
        <div
          className={loading ? 'route_page conversation_tools_page disabled' : 'route_page conversation_tools_page'}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <label
            onDrop={(e) => {
              this.setState({ dragging: false });
              e.preventDefault();
              this.onSelectFile(e, true);
            }}
            onDragOver={(e) => {
              this.setState({ dragging: true });
              e.preventDefault();
            }}
            onDragEnd={() => this.setState({ dragging: false })}
            onDragLeave={() => this.setState({ dragging: false })}
            htmlFor="upld_file_conversion_tool"
            className={`df acc upld_lbl ${this.state.fileName
              ? "selected " +
              this.state.fileName
                .substring(
                  this.state.fileName.lastIndexOf(".") + 1,
                  this.state.fileName.length
                )
                .toLowerCase()
              : ""
              } ${this.state.dragging ? "dragging" : ""}`}
          >
            {!this.state.fileName && (
              <label htmlFor="upld_file_conversion_tool">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16">Drag & Drop Files here </span>
                <span className="format-type fs14">File format: .csv</span>
                <span className="fs16 primary custom_btn">Browse</span>
                <p className="format-type fs14">Maximum size: 5MB</p>

              </label>
            )}

            {this.state.fileName && (
              <div className="upld_lblb">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16 ">Your uploaded file </span>
                <p className="file_name" title={this.state.fileName}>
                  {this.state.fileName}
                </p>
              </div>

            )}
            <ToastContainer />
            <input
              accept=".csv"
              className="dn"
              type="file"
              id="upld_file_conversion_tool"
              onChange={this.onSelectFile}
              ref={this.fileInput}
            ></input>

            {this.state.fileName && (

              <button
                disabled={(!this.state.src) || loading}
                onClick={this.uploadFile}
                className="fs16 primary custom_btn"
              >
                {loading && (<Loader></Loader>)}
                {loading ? <span>Loading... </span> : <span>Convert file</span>}
              </button>)}
          </label>

          {this.state.fileConvertError && (
            <p className="toast">
              {this.state.fileConvertError} please try again
            </p>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({
  USER,
  CONVERSION_TOOL,
  COST_CENTERS,
  DEFAULT_COST_CENTER_BY_COMPANY,
  getPermissionReport
}) => ({
  USER,
  CONVERSION_TOOL,
  COST_CENTERS,
  DEFAULT_COST_CENTER_BY_COMPANY,
  getPermissionReport
});

export default connect(mapStateToProps, {
  MinWageAction,
  EarningCodeAction,
  getDefaultCostCenterByCompany,
  getCostCenterByCompanyCode
})(ConversationTools);