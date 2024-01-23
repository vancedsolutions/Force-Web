import React, { Component } from "react";
import uploadIcon from '../../../assets/images/Icon feather-upload-cloud.png'
import './style.scss';
import moment from "moment"
import { connect } from "react-redux";
import { directDepositAction } from "../../../store/actions";

class DirectDepositView extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  state = {
    src: null,
    file: null,
    fileConvertError: false,
    directDepositFileName: ""
  };

  onSelectFile = (e, drop) => {
    let file = drop ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    this.setState({
      file: file,
      fileConvertError: null,
      directDepositFileName: file.name,
    });
    reader.readAsDataURL(file);
    reader.onload = (res) =>
      this.setState({
        src: res.target.result,
      });
  };

  uploadFile = async () => {
    const i = this.state.src.indexOf("base64,");
    const buffer = Buffer.from(this.state.src.slice(i + 7), "base64");
    const file = new File([buffer], "name", {
      type: "text/plain",
    });

    let { company, companyId } = this.props.USER;
    const fd = new FormData();
    fd.append("companyShortName", company);
    fd.append("companyId", companyId)
    fd.append("file", file);
    fd.append("filename", file.name);
    console.log(Object.fromEntries(fd));
    await this.props.directDepositAction(fd);
    let directDeposit = this.props.DirectDeposit;

    if (!directDeposit)
      return this.setState({ fileConvertError: "Error converting file" });
    const url = window.URL.createObjectURL(
      new Blob([directDeposit], { type: "application/*" })
    );

    if (this.fileInput.current) this.fileInput.current.value = null;
    this.setState({
      src: null,
      directDepositFileName: "",
    });
  };

  render() {
    return (
      <div className="DirectDepositUploadView">
        <p className="title-field">DIRECT DEPOSIT UPLOAD</p>

        <div
          className="route_page conversation_tools_page"
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
            htmlFor="direct_deposit_file"
            className={`df acc upld_lbl ${this.state.directDepositFileName
              ? "selected " +
              this.state.directDepositFileName
                .substring(
                  this.state.directDepositFileName.lastIndexOf(".") + 1,
                  this.state.directDepositFileName.length
                )
                .toLowerCase()
              : ""
              } ${this.state.dragging ? "dragging" : ""}`}
          >
            {!this.state.directDepositFileName && (
              <label htmlFor="direct_deposit_file">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16">Drag & Drop Files here </span>
                <span className="format-type fs14">File format: csv | txt | xls/xlsx</span>
                <span className="fs16 primary custom_btn">Browse</span>
                <p className="format-type fs14">Maximum size: 5MB</p>

              </label>
            )}

            {this.state.directDepositFileName && (
              <div className="upld_lblb">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16 ">Your uploaded file </span>
                <p className="file_name" title={this.state.directDepositFileName}>
                  {this.state.directDepositFileName}
                </p>
              </div>
            )}
            <input
              accept=".csv,.txt,.xls,.xlsx"
              className="dn"
              type="file"
              id="direct_deposit_file"
              onChange={this.onSelectFile}
              ref={this.fileInput}
            ></input>
            {this.state.directDepositFileName && (
              <button
                disabled={!this.state.src}
                onClick={this.uploadFile}
                className="fs16 primary custom_btn"
              >
                Upload
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
const mapStateToProps = ({ USER, DirectDeposit }) => ({ USER, DirectDeposit });

export default connect(mapStateToProps, { directDepositAction })(DirectDepositView);;
