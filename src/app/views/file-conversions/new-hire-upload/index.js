import React, { Component } from "react";
import uploadIcon from '../../../assets/images/Icon feather-upload-cloud.png'
import './style.scss';
import moment from "moment"
import { connect } from "react-redux";
import { newHireAction } from "../../../store/actions/file-conversion/newHire";

class NewHireCheckView extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  state = {
    src: null,
    file: null,
    fileConvertError: false,
  };

  onSelectFile = (e, drop) => {
    let file = drop ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    this.setState({
      file: file,
      fileConvertError: null,
      newHireFileName: file.name,
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

    const fd = new FormData();
    fd.append("file", file);
    fd.append("filename", file.name);
    await this.props.newHireAction(fd);
    let newHire = this.props.NewHire;

    if (!newHire)
      return this.setState({ fileConvertError: "Error converting file" });
    const url = window.URL.createObjectURL(
      new Blob([newHire], { type: "application/*" })
    );

    this.fileInput.current.value = null;
    this.setState({
      src: null,
      newHireFileName: "",
    });
    let date = new Date();
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `New-hire-${moment(date).format("MM-DD-YY-mmss")}.txt`
    );
    document.body.appendChild(link);
    link.click();

  };

  render() {
    return (
      <div className="NewHireUploadView">
        <p className="title-field">NEW HIRE VALIDATION</p>

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
            htmlFor="upld_new_hire_file"
            className={`df acc upld_lbl ${this.state.newHireFileName
              ? "selected " +
              this.state.newHireFileName
                .substring(
                  this.state.newHireFileName.lastIndexOf(".") + 1,
                  this.state.newHireFileName.length
                )
                .toLowerCase()
              : ""
              } ${this.state.dragging ? "dragging" : ""}`}
          >
            {!this.state.newHireFileName && (
              <label htmlFor="upld_new_hire_file">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16">Drag & Drop Files here </span>
                <span className="format-type fs14">File format: .csv / .txt</span>
                <span className="fs16 primary custom_btn">Browse</span>
                <p className="format-type fs14">Maximum size: 5MB</p>

              </label>
            )}

            {this.state.newHireFileName && (
              <div className="upld_lblb">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16 ">Your uploaded file </span>
                <p className="file_name" title={this.state.newHireFileName}>
                  {this.state.newHireFileName}
                </p>
              </div>
            )}
            <input
              accept=".csv,.txt"
              className="dn"
              type="file"
              id="upld_new_hire_file"
              onChange={this.onSelectFile}
              ref={this.fileInput}
            ></input>
            {this.state.newHireFileName && (
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
const mapStateToProps = ({ USER, NewHire }) => ({ USER, NewHire });

export default connect(mapStateToProps, { newHireAction })(NewHireCheckView);;
