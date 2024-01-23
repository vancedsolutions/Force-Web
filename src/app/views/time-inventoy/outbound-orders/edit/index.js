import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getOutboundOrder, AddOutboundOrder, UpdateOutboundOrder, getOrderId, getSerialNumber, AddWarrantyExpiration, getItemPurchaseOrder, addSerialNumber } from "../../../../store/actions";
import { editClientData } from "../../../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import AddIcon from '../../../../assets/images/ionic-ios-add-circle-outline.png';
import ToastMessage from '../../../../components/toast';
import { MSG } from "../../../../utils";
import _ from 'lodash';
export const OutboundOrdersView = (props) => {

  const [editForm, setEditForm] = useState(true);
  const [orderID, setOrderID] = useState("");
  const [date, setDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [qty, setQty] = useState("");
  const [clientInformation, setClientInformation] = useState("");
  const [isBilled, setIsBilled] = useState();
  const [serialNumber, setSerialNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [curItemId, setCurItemId] = useState("");
  const [title, setTitle] = useState("");
  const [CurrentDateModify, setCurrentDate] = useState("");
  const [DeliveryDateModify, setCurrentDeliveryDate] = useState("");

  const [dataSerial, setDataSerial] = useState("");
  const [ItemData, setItemData] = useState("");
  const [PropsId, setPropsId] = useState("");


  useEffect(() => {
    setOrderID(props.EDIT_CLIENT_DATA?.orderID);
    setDate(new Date(props.EDIT_CLIENT_DATA?.date));
    setDeliveryDate(new Date(props.EDIT_CLIENT_DATA?.deliveryDate));
    setTotalPrice(props.EDIT_CLIENT_DATA?.totalPrice);
    setQty(props.EDIT_CLIENT_DATA?.qty);
    setClientInformation(props.EDIT_CLIENT_DATA?.clientInformation);
    setIsBilled(props.EDIT_CLIENT_DATA?.isBilled);
    setTitle(props.EDIT_CLIENT_DATA?.itemId.itemName);
    let CurrentDate = moment(props.EDIT_CLIENT_DATA?.date).format('MMM DD yyyy');
    let CurrentDeliveryDate = moment(props.EDIT_CLIENT_DATA?.deliveryDate).format('MMM DD yyyy');
    setCurrentDate(CurrentDate);
    setCurrentDeliveryDate(CurrentDeliveryDate);
    setPropsId(props.EDIT_CLIENT_DATA?._id)
    dataCurrent();
  }, [])

  const editOrder = () => {
    setEditForm(!editForm)
  };
  const cancelEdit = () => {
    setEditForm(!editForm)
  }
  const DateCurrent = (e) => {
    setDate(e)
  };
  const deliveryDateCur = (e) => {
    setDeliveryDate(e)
  };

  const updateOrder = async ($e) => {
    $e.preventDefault();
    let payload = {
      id: props.EDIT_CLIENT_DATA?._id,
      orderID: orderID,
      date: date,
      deliveryDate: deliveryDate,
      totalPrice: totalPrice,
      qty: qty,
      clientInformation: clientInformation,
      isBilled: isBilled
    }
    await props.UpdateOutboundOrder(payload);
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

    let data = await getItemPurchaseOrder();
    let recordList = _.uniqBy(data, "itemId");
    recordList.forEach(element => {
      let fd = data.filter(res => res.itemId === element.itemId);
      let serialFilterItem = fd.map(res => res.serialNumber);
      if (serialFilterItem.length) {
        let serialData = serialFilterItem.reduce((arr, data) => {
          if (data.length) {
            arr.push(data)
          }
          return arr;
        }, [])

        element.serialNumber = serialData
      } else {
        element.serialNumber = [];
      }

    });
    setItemData(recordList);

    setSerialNumber(recordList.find(res => res._id === props.EDIT_CLIENT_DATA?.purchaseID).serialNumber[0]);
    setDataSerial(recordList.find(res => res._id === props.EDIT_CLIENT_DATA?.purchaseID).serialNumber)

    setCurItemId(props.EDIT_CLIENT_DATA?.purchaseID)
  }


  const selectChange = (e) => {

    setCurItemId(e.target.value)
    let dataSerial = ItemData.filter(res => res._id === e.target.value)
    if (dataSerial.length) {
      setSerialNumber(dataSerial[0].serialNumber[0])
      setDataSerial(dataSerial[0].serialNumber)
    } else {
      ToastMessage({ type: MSG.ERROR, message: "Not added serial number" });
    }
  }

  const addSNumber = async (e) => {
    let payload = {
      outboundId: PropsId,
      serialnumber: serialNumber,
      poId: curItemId
    }
    await addSerialNumber(payload)
  }
  return (
    <>
      {editForm ? (
        <div className={`AddPurchaseOrders`} >
          <div className="overlay-pop" onClick={props.closeSidebar}></div>
          <div className="userHeader d-flex align-items-center justify-content-between">
            <div className="UserName">
              <h2>Outbound Orders Detail: {orderID} </h2>
            </div>
            <div className="iconRight" onClick={props.closeSidebar}>
              <img src={iconRight} alt=""></img>
            </div>
          </div>
          <div className="itembody">

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Order ID</span>
              </div>
              <div className="itemOutput text-end">
                {orderID}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Date</span>
              </div>
              <div className="itemOutput text-end">
                {CurrentDateModify}
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
                {totalPrice}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Client Name</span>
              </div>
              <div className="itemOutput text-end">
                {clientInformation}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Item Name</span>
              </div>
              <div className={`itemOutput text-end`} >
                {props.EDIT_CLIENT_DATA?.itemId.itemName}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Qty</span>
              </div>
              <div className="itemOutput text-end">
                {qty}
              </div>
            </div>

            <div className="itemList d-flex align-items-center justify-content-between">
              <div className="itemLabel">
                <span>Billed</span>
              </div>
              <div className="itemOutput text-end">
                {isBilled ? "Yes" : "No"}
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
                            <th>Item</th>
                          </tr>
                        </thead>


                        <tbody>
                          <tr>
                            <td>
                              <select className="roleSelect" value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} >

                                {dataSerial.length ? dataSerial.map((el, i) => (
                                  <option value={el} key={i}>{el}</option>
                                )) : null}

                              </select>


                            </td>

                            <td>
                              <select className="roleSelect" value={curItemId} onChange={selectChange} disabled={true}>

                                {ItemData.length ? ItemData.map((el, i) => (
                                  <option key={i} value={el._id}>{el.itemName}</option>
                                )) : null}



                              </select>
                            </td>
                          </tr>
                        </tbody>



                      </table>
                    </div>
                    <div className="expiration-footer">
                      <button className="add-we-date-btn" type="submit" onClick={addSNumber}><img src={AddIcon} alt="" /> Add </button>
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
                <h2>Edit Outbound Orders Detail : {orderID}</h2>
              </div>
              <div className="iconRight" onClick={props.closeSidebar}>
                <img src={iconRight} alt=""></img>
              </div>
            </div>
            <div className="itembody">
              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Order ID</span>
                </div>
                <div className="itemOutput">
                  <input type="number" id="txtRole" value={orderID} onChange={(event) => setOrderID(event.target.value)} required readOnly></input>
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Date</span>
                </div>
                <div className="itemOutput">
                  <DatePicker
                    selected={date}
                    onChange={DateCurrent}
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
                <div className={`itemOutput text-end`} >

                  <input type="text" id="txtRole" value={props.EDIT_CLIENT_DATA?.itemId.itemName} required readOnly />

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
                  <input type="number" id="txtRole" value={totalPrice} onChange={(event) => setTotalPrice(event.target.value)} required />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Client Name</span>
                </div>
                <div className={`itemOutput text-end`} >
                  <input type="text" id="txtRole" value={clientInformation} onChange={(event) => setClientInformation(event.target.value)} required />
                </div>
              </div>



              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Qty</span>
                </div>
                <div className="itemOutput text-end">

                  <input type="text"
                    value={qty}
                    onChange={(event) => setQty(event.target.value)}
                    required />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Billed</span>
                </div>
                <div className="itemOutput text-start">
                  <input type="checkbox"
                    defaultChecked={isBilled}
                    onChange={(event) => setIsBilled(event.target.checked)}
                  />

                </div>
              </div>
            </div>

            <div className="itemfooter text-end">
              <button className="pop_wth_btn" onClick={cancelEdit} >Cancel</button>
              <button className="save-btn" type="submit" >Save</button>

            </div>

          </form>
        </div>


      )}
    </>
  )
}


const mapStateToProps = ({ USER, EDIT_CLIENT_DATA, OrderIdR, SERIAL_NUMBER_R, PurchasedOrder, OutboundOrderR }) => ({ USER, EDIT_CLIENT_DATA, OrderIdR, SERIAL_NUMBER_R, PurchasedOrder, OutboundOrderR });
export default connect(mapStateToProps, { getOutboundOrder, AddOutboundOrder, UpdateOutboundOrder, editClientData, getOrderId, getSerialNumber, AddWarrantyExpiration })(OutboundOrdersView);
