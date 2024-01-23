import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getPurchaseOrder, AddPurchaseOrder, UpdatePurchaseOrder, getOrderId, AddWarrantyExpiration, getSerialNumber } from "../../../../store/actions";
import { editClientData } from "../../../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import AddIcon from '../../../../assets/images/ionic-ios-add-circle-outline.png';
import ToastMessage from '../../../../components/toast';
import { MSG } from "../../../../utils";
import _ from 'lodash';
export const EditOrdersView = (props) => {

  const [editForm, setEditForm] = useState(true);
  const [orderID, setOrderID] = useState("");
  const [purchaseDate, setPurchaseDate] = useState();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [title, setTitle] = useState("");
  const [qty, setQty] = useState("");
  const [status, setStatus] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [curItemId, setCurItemId] = useState("");
  const [purchaseData, setPurchaseData] = useState("");
  const [PurchaseDateModify, setCurrentPurchaseDate] = useState("");
  const [DeliveryDateModify, setCurrentDeliveryDate] = useState("");

  const [dataSerial, setDataSerial] = useState("");


  const [PropsId, setPropsId] = useState("");



  useEffect(() => {

    setOrderID(props.EDIT_CLIENT_DATA?.orderID);
    setPurchaseDate(new Date(props.EDIT_CLIENT_DATA?.purchaseDate));
    setDeliveryDate(new Date(props.EDIT_CLIENT_DATA?.deliveryDate))
    setTotalPrice(props.EDIT_CLIENT_DATA?.totalPrice)
    setQty(props.EDIT_CLIENT_DATA?.qty)
    setStatus(props.EDIT_CLIENT_DATA?.status['_id'])
    setTitle(props.EDIT_CLIENT_DATA?.itemId.itemName)

    let CurrentPurchaseDate = moment(props.EDIT_CLIENT_DATA?.purchaseDate).format('MMM DD yyyy');
    let CurrentDeliveryDate = moment(props.EDIT_CLIENT_DATA?.deliveryDate).format('MMM DD yyyy');

    setCurrentPurchaseDate(CurrentPurchaseDate)
    setCurrentDeliveryDate(CurrentDeliveryDate)
    dataCurrent(props.EDIT_CLIENT_DATA?.orderID)

  }, [])

  const editOrder = () => {
    setEditForm(!editForm)
  };
  const cancelEdit = () => {
    setEditForm(!editForm)
  }
  const purchaseDateCur = (e) => {
    setPurchaseDate(e)
  };

  const deliveryDateCur = (e) => {
    setDeliveryDate(e)
  };
  const updateOrder = async ($e) => {

    $e.preventDefault();
    let payload = {
      id: props.EDIT_CLIENT_DATA?._id,
      orderID: orderID,
      purchaseDate: purchaseDate,
      deliveryDate: deliveryDate,
      totalPrice: totalPrice,
      qty: qty,
      status: status,
      itemId: title,
    }
    await props.UpdatePurchaseOrder(payload);
    props.closeSidebar()
  }
  const ExpireDate = (e) => {
    setExpireDate(e)
  };

  const addExpireDate = async ($e) => {

    $e.preventDefault();
    let date = new Date();
    let payload = {
      itemId: PropsId,
      modifiedDate: date,
      warrantyExpiraon: expireDate,
      serialnumber: serialNumber
    }
    await props.AddWarrantyExpiration(payload);
    props.closeSidebar()
  }

  const dataCurrent = async ($e) => {
    await props.getSerialNumber();
    await props.getOrderId($e);
    await props.getPurchaseOrder();
    let defaultSelect = props.PurchasedOrder.records[0]._id
    let data = _.uniqBy(props.PurchasedOrder.records, "itemId._id");
    setPurchaseData(data)
    let PropsId = props.EDIT_CLIENT_DATA?.itemId._id

    setPropsId(PropsId)

    // setCurItemId(data[0]?.itemId._id);
    selectChange(PropsId)

  }


  const selectChange = (e) => {
    setCurItemId(e)

    if (Object.keys(props.SERIAL_NUMBER_R).length) {
      let dataSerial = props.SERIAL_NUMBER_R?.filter(res => res.itemId === e)
      if (dataSerial) {
        setDataSerial(dataSerial)
      } else {
        ToastMessage({ type: MSG.ERROR, message: "Not added serial number" });
      }
    }

  }


  return (

    <>
      {editForm ? (
        <div className={`AddPurchaseOrders`} >
          <div className="overlay-pop" onClick={props.closeSidebar}></div>
          <div className="userHeader d-flex align-items-center justify-content-between">
            <div className="UserName">
              <h2>Purchase Orders Detail: {props.purchaseData.orderID} </h2>
            </div>
            <div className="iconRight" onClick={props.closeSidebar}>
              <img src={iconRight} alt=""></img>
            </div>
          </div>
          <div className="itembody">

            <div className="itemList first_list d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                {props.EDIT_CLIENT_DATA?.itemId.itemName}
              </div>
              <div className="itemOutput text-end">
                {props.purchaseData.totalPrice}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Order ID</span>
              </div>
              <div className="itemOutput text-end">
                {props.purchaseData.orderID}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Purchase Date</span>
              </div>
              <div className="itemOutput text-end">
                {PurchaseDateModify}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Delivery Date</span>
              </div>
              <div className="itemOutput text-end">
                {DeliveryDateModify}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Total Price</span>
              </div>
              <div className="itemOutput text-end">
                {props.purchaseData.totalPrice}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Qty</span>
              </div>
              <div className="itemOutput text-end">
                {props.purchaseData.qty}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Status</span>
              </div>
              <div className={`itemOutput text-end`} >
                {props.purchaseData.purchaseStatus}
              </div>
            </div>

            <div className="warranty-expiration">
              <div className="add-warranty-table">
                <form onSubmit={addExpireDate} >
                  <div className="custom-table">
                    <div className="overflow">
                      <table>
                        <thead>
                          <tr>
                            <th>Serial Number </th>
                            <th>Ex. Date </th>
                            <th>Item</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <select className="roleSelect" value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} >
                                {dataSerial.length ? dataSerial.map((el, i) => (<option value={el.itemId} key={i}>{el.serialnumber}</option>)) : null}</select>
                              {/* {dataSerial} */}
                              {/* <select className="roleSelect" value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} >
                                {props.SERIAL_NUMBER_R.length ? props.SERIAL_NUMBER_R.map(el => (
                                  <option value={el._id}>{el.serialnumber}</option>
                                )) : null}
                              </select> */}


                            </td>
                            <td> <DatePicker
                              selected={expireDate}
                              onChange={ExpireDate}
                              dateFormat="MM/dd/yyyy"
                              required
                            /></td>
                            <td>
                              <select className="roleSelect" value={curItemId} onChange={(e) => selectChange(e.target.value)} disabled={true}>

                                {purchaseData.length ? purchaseData.map((el, i) => (
                                  <option value={el.itemId['_id']} key={i}>{el.itemName}</option>
                                )) : null}


                              </select>
                            </td>
                          </tr>
                        </tbody>



                      </table>
                    </div>
                    <div className="expiration-footer">
                      <button className="add-we-date-btn" type="submit"><img src={AddIcon} alt="" /> Save </button>
                    </div>

                  </div>

                </form>

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
                <h2>Edit Purchase Orders Detail</h2>
              </div>
              <div className="iconRight" onClick={props.closeSidebar}>
                <img src={iconRight} alt=""></img>
              </div>
            </div>
            <div className="itembody">
              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item ID</span>
                </div>
                <div className="itemOutput">
                  <input type="number" id="txtRole" value={orderID} onChange={(event) => setOrderID(event.target.value)} required readOnly></input>
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Purchase Date</span>
                </div>
                <div className="itemOutput">
                  <DatePicker
                    selected={purchaseDate}
                    onChange={purchaseDateCur}
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>
              </div>
              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Delivery Date</span>
                </div>
                <div className="itemOutput text-end">
                  <DatePicker
                    selected={deliveryDate}
                    onChange={deliveryDateCur}
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item Name</span>
                </div>
                <div className="itemOutput text-end">
                  <input type="text" id="txtRole" value={props.EDIT_CLIENT_DATA?.itemId.itemName} required readOnly></input>

                  {/* <select className="roleSelect" value={title} onChange={(event) => setTitle(event.target.value)} disabled>
                    {props.OrderIdR.length ? props.OrderIdR.map(el => (
                      <option value={el._id}>{el.itemName}</option>
                    )) : null}
                  </select> */}
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Total Price</span>
                </div>
                <div className="itemOutput text-end">
                  <input type="number" id="txtRole" value={totalPrice} onChange={(event) => setTotalPrice(event.target.value)} required></input>
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Qty</span>
                </div>
                <div className="itemOutput text-end">
                  <input type="number" id="txtRole" value={qty} onChange={(event) => setQty(event.target.value)} required></input>
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Status</span>
                </div>
                <div className={`itemOutput text-end`} >
                  <select className="roleSelect" value={status} onChange={(event) => setStatus(event.target.value)} required>
                    {props.ItemStatusList.map((el, i) => (
                      <option key={i} value={el._id}>{el.statusName}</option>
                    ))}
                  </select>
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


const mapStateToProps = ({ USER, EDIT_CLIENT_DATA, ItemStatusList, OrderIdR, SERIAL_NUMBER_R, PurchasedOrder }) => ({ USER, EDIT_CLIENT_DATA, ItemStatusList, OrderIdR, SERIAL_NUMBER_R, PurchasedOrder });
export default connect(mapStateToProps, { getPurchaseOrder, AddPurchaseOrder, UpdatePurchaseOrder, editClientData, getOrderId, AddWarrantyExpiration, getSerialNumber })(EditOrdersView);
