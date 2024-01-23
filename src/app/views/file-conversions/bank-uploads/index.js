import React, { Component } from 'react';
import uploadIcon from '../../../assets/images/Icon feather-upload-cloud.png';
import { connect } from "react-redux";
import { bankAction } from "../../../store/actions/file-conversion/bank";
import './style.scss';
class BankUploadsView extends Component {
  constructor(props) {
    super(props);
    this.bankFileInput = React.createRef();
  }

  componentDidMount() {

  }

  state = {
    src: null,
    file: null,
    fileConvertError: false,
    bankFileName: null,
    dragging: false,
  };

  onSelectFileBankUpload = (e, drop) => {

    e.preventDefault();
    let file = drop ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    this.setState({
      file: file,
      fileConvertError: null,
      bankFileName: file.name,
    });
    // reader.readAsText(file);
    reader.readAsDataURL(file);
    reader.onload = (res) => this.setState({ src: res.target.result });
  };

  uploadFile = async () => {
    const i = this.state.src.indexOf("base64,");
    const buffer = Buffer.from(this.state.src.slice(i + 7), "base64");
    const file = new File([buffer], "name", {
      type: "application/vnd.ms-excel",
    });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("filename", file.name);

    await this.props.bankAction(fd);
    let result = this.props.BANK_CONVERSION;
    if (result === undefined && result.msg === "Error converting file") {
      return this.setState({ fileConvertError: result.msg });
    }
    const url = window.URL.createObjectURL(
      new Blob([result], { type: "application/*" })
    );

    this.bankFileInput.current.value = null;

    this.setState({
      src: null,
      bankFileName: "",
    });

    var link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bank-upload.csv`);
    document.body.appendChild(link);
    link.click();

  };

  render() {
    return (

      <div className="BankUploadsView">
        <p className="title-field">BANK UPLOAD</p>
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
              this.onSelectFileBankUpload(e, true);
            }}
            onDragOver={(e) => {
              this.setState({ dragging: true });
              e.preventDefault();
            }}
            onDragEnd={() => this.setState({ dragging: false })}
            onDragLeave={() => this.setState({ dragging: false })}
            htmlFor="upld_file"
            className={`df acc upld_lbl ${this.state.bankFileName
                ? "selected " +
                this.state.bankFileName
                  .substring(
                    this.state.bankFileName.lastIndexOf(".") + 1,
                    this.state.bankFileName.length
                  )
                  .toLowerCase()
                : ""
              } ${this.state.dragging ? "dragging" : ""}`}
          >
            {!this.state.bankFileName && (
              <label htmlFor="upld_file">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16 ">Drag & Drop Files here </span>
                <span className="format-type fs14">File format: .csv / .txt</span>
                <span className="fs16 primary custom_btn">Browse</span>
                <p className="format-type max-size-title fs14">Maximum size: 5MB</p>

              </label>
            )}

            {this.state.bankFileName && (
              <div className="upld_lbld">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16 ">Your uploaded file </span>
                <div className="icon"></div>
                <p className="file_name" title={this.state.bankFileName}>
                  {this.state.bankFileName}
                </p>
              </div>
            )}

            <input
              accept=".csv,.txt"
              className="dn"
              type="file"
              id="upld_file"
              onChange={this.onSelectFileBankUpload}
              ref={this.bankFileInput}
            ></input>
            {this.state.bankFileName && (
              <button
                disabled={!this.state.src}
                onClick={this.uploadFile}
                className="fs16 primary custom_btn"
              >
                Convert file
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
const mapStateToProps = ({ USER, BANK_CONVERSION }) => ({ USER, BANK_CONVERSION });

export default connect(mapStateToProps, { bankAction })(BankUploadsView);


