import React, { Component } from "react";
import uploadIcon from '../../../assets/images/Icon feather-upload-cloud.png'
import './style.scss';
import moment from "moment"
import { connect } from "react-redux";
import { taxCollectionAction } from "../../../store/actions/file-conversion/tax-collection";

class TaxCollectionView extends Component {
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
      txtCollectionFileName: file.name,
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
      type: "application/vnd.ms-excel",
    });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("filename", file.name);
    await this.props.taxCollectionAction(fd);
    let taxCollection = this.props.TAX_COLLECTIONS;

    if (taxCollection === undefined && taxCollection.msg === "Error converting file")
      return this.setState({ fileConvertError: taxCollection.msg });
    const url = window.URL.createObjectURL(
      new Blob([taxCollection], { type: "application/*" })
    );

    this.fileInput.current.value = null;
    this.setState({
      src: null,
      txtCollectionFileName: "",
    });
    let date = new Date();
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Tax-collection-${moment(date).format("MM-DD-YY-mmss")}.iif`
    );
    document.body.appendChild(link);
    link.click();

  };

  render() {
    return (
      <div className="TaxCollectionView mr-40">
        <p className="title-field">TAX COLLECTION</p>

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
            htmlFor="upld_tax_collection_file"
            className={`df acc upld_lbl ${this.state.txtCollectionFileName
              ? "selected " +
              this.state.txtCollectionFileName
                .substring(
                  this.state.txtCollectionFileName.lastIndexOf(".") + 1,
                  this.state.txtCollectionFileName.length
                )
                .toLowerCase()
              : ""
              } ${this.state.dragging ? "dragging" : ""}`}
          >
            {!this.state.txtCollectionFileName && (
              <label htmlFor="upld_tax_collection_file">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16">Drag & Drop Files here </span>
                <span className="format-type fs14">File format: .csv / .txt</span>
                <span className="fs16 primary custom_btn">Browse</span>
                <p className="format-type fs14">Maximum size: 5MB</p>

              </label>
            )}

            {this.state.txtCollectionFileName && (
              <div className="upld_lblb">
                <img className="uploadIcon" src={uploadIcon} alt="" />
                <span className="ffqs fwsb5 fs16 ">Your uploaded file </span>
                <p className="file_name" title={this.state.txtCollectionFileName}>
                  {this.state.txtCollectionFileName}
                </p>
              </div>
            )}
            <input
              accept=".csv,.txt"
              className="dn"
              type="file"
              id="upld_tax_collection_file"
              onChange={this.onSelectFile}
              ref={this.fileInput}
            ></input>
            {this.state.txtCollectionFileName && (
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
const mapStateToProps = ({ USER, TAX_COLLECTIONS }) => ({ USER, TAX_COLLECTIONS });

export default connect(mapStateToProps, { taxCollectionAction })(TaxCollectionView);;
