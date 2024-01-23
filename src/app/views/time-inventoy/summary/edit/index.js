import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getPurchaseOrder, AddPurchaseOrder, UpdatePurchaseOrder } from "../../../../store/actions/Admin/purchaseOrder";
import { editClientData } from "../../../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProductIMG from '../../../../assets/images/JBL_Flip4_Black_Hero.png'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PurchaseOrders from '../../purchase-orders';
import OutboundOrders from '../../outbound-orders';
import { apiEndPoint } from "../../../../utils/constants";
import moment from "moment";
import MiniPurchaseView from "../Mini-purchase-orders"
import MiniOutboundView from "../Mini-outbound-orders"
import MiniInstockOrdersView from "../Mini-instock-orders"


export const EditPurchaseOrders = (props) => {

  const [editForm, setEditForm] = useState(true);
  const [orderID, setOrderID] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [outboundDate, setOuboundDate] = useState("");
  const [billedqty, setBilledQty] = useState("");
  const [outboundqty, setOutboundQty] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    setOrderID(props.EDIT_CLIENT_DATA?.orderID);
    setPurchaseDate(props.EDIT_CLIENT_DATA?.purchaseDate !== null ? moment(props.EDIT_CLIENT_DATA?.purchaseDate).format('DD MMM yyyy') : "");
    setOuboundDate(props.EDIT_CLIENT_DATA?.outBoundOrderDate !== null ? moment(props.EDIT_CLIENT_DATA?.outBoundOrderDate).format('DD MMM yyyy') : "");
    setBilledQty(props.EDIT_CLIENT_DATA?.isBilledQty);
    setOutboundQty(props.EDIT_CLIENT_DATA?.outBoundQty);
    setItemName(props.EDIT_CLIENT_DATA?.itemName);
    setItemDescription(props.EDIT_CLIENT_DATA?.itemDescription)
    setCurrentStock(props.EDIT_CLIENT_DATA?.currentStock)
    setImage(props.EDIT_CLIENT_DATA?.itemImage)
  }, [])

  const cancelEdit = () => {
    setEditForm(!editForm)
  }


  return (
    <>

      <div className={`AddPurchaseOrders`} >
        <div className="overlay-pop" onClick={props.closeSidebar}></div>
        <div className="userHeader d-flex align-items-center justify-content-between">
          <div className="UserName">
            <h2>Summary Detail: {orderID} </h2>
          </div>
          <div className="iconRight" onClick={props.closeSidebar}>
            <img src={iconRight} alt=""></img>
          </div>
        </div>
        <div className="itembody">

          <div className="itemList  d-flex align-items-center justify-content-between">
            <div className="product_feature">
              <img src={apiEndPoint + image} style={{ width: '80px' }} />
            </div>
            <div className="product_title text-start">
              <h3>{itemName}</h3>
              <p>{itemDescription}</p>
            </div>
          </div>

          <div className="itemList d-flex align-items-center justify-content-between">
            <div className="itemLabel">
              <span>Current in stock</span>
            </div>
            <div className="itemOutput text-end">
              {currentStock}
            </div>
          </div>
          <div className="itemList d-flex align-items-center justify-content-between">
            <div className="itemLabel">
              <span>Outbound QTY</span>
            </div>
            <div className="itemOutput text-end">
              {outboundqty}
            </div>
          </div>
          <div className="itemList d-flex align-items-center justify-content-between">
            <div className="itemLabel">
              <span>Billed QTY</span>
            </div>
            <div className="itemOutput text-end">
              {billedqty}
            </div>
          </div>
          <div className="itemList d-flex align-items-center justify-content-between">
            <div className="itemLabel">
              <span>Last purchase date</span>
            </div>
            <div className="itemOutput text-end">
              {purchaseDate}
            </div>
          </div>

          <div className="itemList d-flex align-items-center justify-content-between">
            <div className="itemLabel">
              <span>Last outbound order date</span>
            </div>
            <div className="itemOutput text-end">
              {outboundDate}
            </div>
          </div>

          <div className="order_small_tab">
            <Tabs>
              <div className="tabNav d-flex align-items-center justify-content-between">
                <TabList>
                  <Tab>Purchase Orders</Tab>
                  <Tab>Outbound Orders</Tab>
                  <Tab>In-stock</Tab>
                </TabList>
              </div>
              <div className="tabContent">
                <TabPanel>
                  <MiniPurchaseView />
                </TabPanel>
                <TabPanel>
                  <MiniOutboundView />
                </TabPanel>
                <TabPanel>
                  <MiniInstockOrdersView />
                </TabPanel>
              </div>
            </Tabs>

          </div>
        </div>
        <div className="itemfooter height-sammary d-flex align-items-right justify-content-end">

        </div>
      </div>

    </>
  )
}


const mapStateToProps = ({ USER, EDIT_CLIENT_DATA }) => ({ USER, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { getPurchaseOrder, AddPurchaseOrder, UpdatePurchaseOrder, editClientData })(EditPurchaseOrders);
