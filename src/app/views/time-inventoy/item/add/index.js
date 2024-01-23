import React, { Component } from 'react';
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { AddItemOrder, fileImageUpload } from "../../../../store/actions";
import DatePicker from "react-datepicker";
import uploadIcon from '../../../../assets/images/Icon feather-upload-cloud.png';
import "react-datepicker/dist/react-datepicker.css";

class AddPurchaseOrders extends Component {
  constructor(props) {
    super(props);


  }
  state = {
    purchaseDate: "",
    deliveryDate: "",
    status: "",
    isChecked: false,
    isAddOrderShow: this.props.isAddOrderShow,
    dragging: false,
    src: null,
    file: null,
    imageFileError: false,
    itemFileName: "",
    statusList: []
  }
  componentDidMount() {
    this.setState({ status: this.props.ItemStatusList[0]._id })

  }
  purchaseDate = (e) => {
    this.setState({ purchaseDate: e });
  };
  deliveryDate = (e) => {
    this.setState({ deliveryDate: e });
  };

  onSelectFile = (e, drop) => {
    let file = drop ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;
    ;
    const fd = new FormData();
    fd.append("itemImage", file);
    fileImageUpload(fd).then(result => {
      let reader = new FileReader();
      this.setState({
        file: file,
        imageFileError: null,
        itemFileName: file.name,
      });
      reader.readAsDataURL(file);
      reader.onload = (res) =>
        this.setState({
          src: res.target.result,
          imageUrl: result.url

        });
    })




  };

  AddOrder = async ($e) => {
    $e.preventDefault();
    let payload = {
      orderID: this.state.orderID,
      itemImage: this.state.imageUrl,
      itemName: this.state.itemName,
      itemDescription: this.state.description,
    }
    await this.props.AddItemOrder(payload);
    this.props.closeSidebar()
  }

  render() {
    return (

      <>
        <div className={`AddPurchaseOrders`} >
          <div className="overlay-pop" onClick={this.props.closeSidebar}></div>
          <form onSubmit={this.AddOrder} >
            <div className="userHeader d-flex align-items-center justify-content-between">
              <div className="UserName">
                <h2>Add Item</h2>
              </div>
              <div className="iconRight" onClick={this.props.closeSidebar}>
                <img src={iconRight} alt=""></img>
              </div>
            </div>
            <div className="itembody">


              <div className="itemList">
                <div className="itemLabel">
                  <span>Image</span>
                </div>
                <div
                  className="itemOutput_full file-area"
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
                    htmlFor="upld_image"
                    className={`df acc upld_lbl ${this.state.itemFileName
                      ? "selected " +
                      this.state.itemFileName
                        .substring(
                          this.state.itemFileName.lastIndexOf(".") + 1,
                          this.state.itemFileName.length
                        )
                        .toLowerCase()
                      : ""
                      } ${this.state.dragging ? "dragging" : ""}`}
                  >
                    {!this.state.itemFileName && (
                      <label htmlFor="upld_image">
                        <img className="uploadIcon" src={uploadIcon} alt="" />
                        <span className="ffqs fwsb5 fs16">Upload Product Image</span>


                      </label>
                    )}

                    {this.state.itemFileName && (

                      <div className="upld_lbld">
                        <img className="thambsImage" src={this.state.src} alt={this.state.itemFileName} />
                      </div>
                    )}
                    <input
                      accept=".PNG,.png,.jpg,JPEG"
                      className="dn"
                      type="file"
                      id="upld_image"
                      onChange={this.onSelectFile}
                      ref={this.fileInput}
                    ></input>

                  </label>

                  {this.state.imageFileError && (
                    <p className="toast">
                      {this.state.imageFileError} please try again
                    </p>
                  )}
                </div>
              </div>


              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item ID</span>
                </div>
                <div className="itemOutput">
                  <input
                    type="number"
                    value={this.state.orderID}
                    onChange={(e) => this.setState({ orderID: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Serial number</span>
              </div>
              <div className="itemOutput">
                <input type="number"
                  value={this.state.serialNumber}
                  onChange={(e) => this.setState({ serialNumber: e.target.value })} 
                  required
                  />
              </div>
            </div> */}

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item name</span>
                </div>
                <div className="itemOutput">
                  <input type="text" value={this.state.itemName}
                    onChange={(e) => this.setState({ itemName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Description</span>
                </div>
                <div className="itemOutput">
                  <input type="text" value={this.state.description}
                    onChange={(e) => this.setState({ description: e.target.value })}
                    required
                  />
                </div>
              </div>
              {/* <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Status</span>
              </div>
              <div className="itemOutput">
                <select className="roleSelect" value={this.state.status} onChange={(e) => this.setState({ status: e.target.value })} >
                    {this.props.ItemStatusList.map(el => (
                      <option  value={el._id}>{el.statusName }</option>
                    ))}
                  
                </select>
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Purchase Date</span>
              </div>
              <div className="itemOutput">
                <DatePicker
                  selected={this.state.purchaseDate}
                  onChange={this.purchaseDate}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
            </div> */}

            </div>
            <div className="itemfooter text-end">
              <button className="pop_wth_btn" onClick={this.props.closeSidebar}>Cancel</button>
              <button className="save-btn" type="submit">Save</button>

            </div>
          </form>
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS, ItemStatusList }) => ({ USER, GET_USERS, ItemStatusList });
export default connect(mapStateToProps, { AddItemOrder })(AddPurchaseOrders);