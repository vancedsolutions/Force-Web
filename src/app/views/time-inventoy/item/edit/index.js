import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getItemsOrder, UpdateItemOrder, fileImageUpload, getWarrantyExpiration, getPurchaseOrder, AddWarrantyExpiration } from "../../../../store/actions";
import { editClientData } from "../../../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import uploadIcon from '../../../../assets/images/Icon feather-upload-cloud.png';
import { apiEndPoint } from '../../../../utils/constants';
import Grid from '../../../../components/grid';
import moment from "moment";
export const EditPurchaseOrders = (props) => {
  const fileInput = React.createRef();
  const [editForm, setEditForm] = useState(true);
  const [orderID, setOrderID] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [itemWarrenty, setItemWarranty] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [src, setSrc] = useState("");
  const [itemFileName, setItemFileName] = useState("");

  const [poid, setPurchaseOrder] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [newItemId, setItemid] = useState("");
  const [newExDate, setNewExDate] = useState("");

  const [newEditExDate, setEditExDate] = useState("");
  const [outboundOrderId, setOutBoundOrderId] = useState("");


  const state = {
    columnDefs: [

      {
        headerName: "Modified",
        field: "orderID",
        width: 110
      },
      {
        headerName: "New Warranty Date",
        field: "orderID",
        width: 110
      }]
  }

  useEffect(() => {

    setOrderID(props.EDIT_CLIENT_DATA?.orderID);
    setItemImage(props.EDIT_CLIENT_DATA?.itemImage)
    setItemName(props.EDIT_CLIENT_DATA?.itemName)
    setDescription(props.EDIT_CLIENT_DATA?.itemDescription)
    setPurchaseOrder(props.EDIT_CLIENT_DATA?.purchaseOrdersId)
    setSerialNumber(props.EDIT_CLIENT_DATA?.serialNumber)
    setOutBoundOrderId(props.EDIT_CLIENT_DATA?.outboundId)
    setItemWarranty(state)
    getExpiration()
  }, [])

  const onSelectFile = (e, drop) => {
    let file = drop ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("itemImage", file);
    fileImageUpload(fd).then(result => {
      let reader = new FileReader();
      setItemFileName(file.name);
      reader.readAsDataURL(file);
      reader.onload = (res) =>
        setSrc(res.target.result);
      setItemImage(result.url);
    })

  };
  const editOrder = () => {
    setEditForm(!editForm)
  };
  const cancelEdit = () => {
    setEditForm(true)
  }
  const DateCurrent = (e) => {

    setEditExDate(e)
    if (typeof props.EDIT_CLIENT_DATA?.warrantyExpiraon === 'object') {
      setItemid(props.EDIT_CLIENT_DATA?._id)
      setNewExDate(props.EDIT_CLIENT_DATA?.warrantyExpiraon.warrantyExpiraon)
    } else {
      setItemid(props.EDIT_CLIENT_DATA?._id)
      setNewExDate(props.EDIT_CLIENT_DATA?.warrantyExpiraon)
    }
  };
  const updateOrder = async ($e) => {

    $e.preventDefault();
    let payload = {
      id: props.EDIT_CLIENT_DATA?._id,
      orderID: orderID,
      itemImage: itemImage,
      itemName: itemName,
      itemDescription: description,
    }
    addExpireDate()
    await props.UpdateItemOrder(payload);
  }
  const getExpiration = async () => {

    await props.getWarrantyExpiration(props.EDIT_CLIENT_DATA?._id);
    if (typeof props.EDIT_CLIENT_DATA?.warrantyExpiraon === 'object' && typeof props.EDIT_CLIENT_DATA?.warrantyExpiraon === 'null') {
      let preEditDate = new Date(props.EDIT_CLIENT_DATA?.warrantyExpiraon?.warrantyExpiraon)
      setEditExDate(preEditDate)
    } else {
      let preEditDate = new Date(props.EDIT_CLIENT_DATA?.warrantyExpiraon)
      setEditExDate(preEditDate)
    }

  }

  const addExpireDate = async ($e) => {
    let payload = {
      itemId: newItemId,
      modifiedDate: newExDate,
      warrantyExpiraon: newEditExDate,
      // serialnumber: serialNumber
    }
    await props.AddWarrantyExpiration(payload);
    props.closeSidebar()
  }


  return (
    <>
      {editForm ? (
        <div className={`AddPurchaseOrders`} >
          <div className="overlay-pop" onClick={props.closeSidebar}></div>
          <div className="userHeader d-flex align-items-center justify-content-between">
            <div className="UserName">
              <h2>Item Detail: {orderID} </h2>
            </div>
            <div className="iconRight" onClick={props.closeSidebar}>
              <img src={iconRight} alt=""></img>
            </div>
          </div>
          <div className="itembody">

            <div className="itemList  d-flex align-items-center justify-content-between">
              <div className="product_feature">
                <img src={apiEndPoint + itemImage} alt="" style={{ width: '80px' }} />
              </div>
              <div className="product_title text-start">
                <h3>{itemName}</h3>
                <p>{description}</p>
              </div>
            </div>


            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Item Id</span>
              </div>
              <div className="itemOutput text-end">
                {orderID}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Item Name</span>
              </div>
              <div className="itemOutput text-end">
                {itemName}
              </div>
            </div>
            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Serial Number</span>
              </div>
              <div className="itemOutput text-end">
                {serialNumber}
              </div>
            </div>
            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Purchase Order Id</span>
              </div>
              <div className="itemOutput text-end">
                {poid}
              </div>
            </div>
            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Outbound Order Id</span>
              </div>
              <div className="itemOutput text-end">
                {outboundOrderId}
              </div>
            </div>
            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Description</span>
              </div>
              <div className="itemOutput text-end">
                {description}
              </div>
            </div>

            <div className="warranty-expiration">
              <div className="add-warranty-table">
                <div className="custom-table">
                  <div className="overflow height">
                    <table>
                      <thead>
                        <tr>
                          <th>Modified </th>
                          <th>New Warranty Date</th>
                        </tr>
                      </thead>


                      <tbody>
                        {props.EXPIRATION_DATE.length ? props.EXPIRATION_DATE.map((el, i) => (
                          <tr key={el.i}>
                            <td>{moment(el.modifiedDate).format('DD MMM yyyy')} </td>
                            <td>{moment(el.warrantyExpiraon).format('DD MMM yyyy')}  </td>
                          </tr>
                        )) :
                          <tr>
                            <td>
                              <div className="no-warranty-dat">
                                <h6>No warranty date</h6>
                              </div>
                            </td>
                          </tr>

                        }


                      </tbody>



                    </table>
                  </div>

                </div>
              </div>
            </div>


          </div>
          <div className="itemfooter d-flex align-items-center justify-content-between">
            <div className="itemfooter-inner">
              <button className="edit_btn" onClick={editOrder}>Edit</button>
            </div>
            {/* <div className="itemfooter-inner pagination-area">
              <button className="mar-r-15 pagination-btn pagination-btn-pre">  Previous </button>
              <button className="pagination-btn pagination-btn-next">Next  </button>
            </div> */}

          </div>
        </div>
      ) : (
        <div className={`AddPurchaseOrders`} >
          <div className="overlay-pop" onClick={props.closeSidebar}></div>
          <form onSubmit={updateOrder}>
            <div className="userHeader d-flex align-items-center justify-content-between">
              <div className="UserName">
                <h2>Edit Item Details</h2>
              </div>
              <div className="iconRight" onClick={props.closeSidebar}>
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
                      setDragging(false)
                      // this.setState({ dragging: false });
                      e.preventDefault();
                      onSelectFile(e, true);
                    }}
                    onDragOver={(e) => {
                      setDragging(true)
                      // this.setState({ dragging: true });
                      e.preventDefault();
                    }}
                    onDragEnd={() => {
                      setDragging(false)
                      // this.setState({ dragging: false })
                    }

                    }
                    onDragLeave={() => {
                      setDragging(false)
                      //this.setState({ dragging: false })
                    }}
                    htmlFor="upld_image"
                    className={`df acc upld_lbl ${itemFileName
                      ? "selected " +
                      itemFileName
                        .substring(
                          itemFileName.lastIndexOf(".") + 1,
                          itemFileName.length
                        )
                        .toLowerCase()
                      : ""
                      } ${dragging ? "dragging" : ""}`}
                  >
                    {!itemImage && (
                      <label htmlFor="upld_image">
                        <img className="uploadIcon" src={uploadIcon} alt="" />
                        <span className="ffqs fwsb5 fs16">Upload Product Image</span>
                      </label>
                    )}

                    {itemImage && (

                      <div className="upld_lbld">
                        <img className="thambsImage" src={apiEndPoint + itemImage} alt={itemFileName} />
                      </div>
                    )}
                    <input
                      accept=".PNG,.png,.jpg,JPEG"
                      className="dn"
                      type="file"
                      id="upld_image"
                      onChange={onSelectFile}
                      ref={fileInput}
                    ></input>

                  </label>


                </div>
              </div>


              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item ID</span>
                </div>
                <div className="itemOutput">
                  <input type="number" id="txtRole" value={orderID} onChange={(event) => setOrderID(event.target.value)} required />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item name</span>
                </div>
                <div className="itemOutput">
                  <input type="text" id="txtRole" value={itemName} onChange={(event) => setItemName(event.target.value)} required />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Description</span>
                </div>
                <div className="itemOutput">
                  <input type="text" id="txtRole" value={description} onChange={(event) => setDescription(event.target.value)} required />
                </div>
              </div>


              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>New Warranty Date</span>
                </div>
                <div className="itemOutput">
                  <DatePicker
                    selected={newEditExDate}
                    onChange={DateCurrent}
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>
              </div>


            </div>

            <div className="itemfooter text-end">
              <button className="pop_wth_btn" onClick={cancelEdit} >Cancel</button>
              <button className="save-btn" type="submit">Save</button>

            </div>

          </form>
        </div>


      )}
    </>
  )
}


const mapStateToProps = ({ USER, EDIT_CLIENT_DATA, ItemStatusList, EXPIRATION_DATE, PurchasedOrder }) => ({ USER, EDIT_CLIENT_DATA, ItemStatusList, EXPIRATION_DATE, PurchasedOrder });
export default connect(mapStateToProps, { getItemsOrder, UpdateItemOrder, editClientData, getWarrantyExpiration, getPurchaseOrder, AddWarrantyExpiration })(EditPurchaseOrders);
