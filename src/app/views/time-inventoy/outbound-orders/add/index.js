import React, { Component } from 'react'
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getOutboundOrder, AddOutboundOrder, getOrderId, getPurchaseOrder, getItemsOrder,getItemPurchaseOrder } from "../../../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ToastMessage from '../../../../components/toast';
import { MSG } from "../../../../utils";
import _ from 'lodash';
class AddOrdersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      deliveryDate: "",
      status: "Pending",
      isChecked: false,
      itemList:[],
      dataList: [],
      purchaseId:'',
      itemId: '',
      isSerialShow: false,
      isAddOrderShow: this.props.isAddOrderShow
    }

  }

  date = (e) => {
    this.setState({ date: e });
  };
  deliveryDate = (e) => {
    this.setState({ deliveryDate: e });
  };
  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  }
  selectChange = (item) => {
    

     this.setState({ itemId: item });
    let serialMatch = this.state.itemList.filter(res => res.itemId === item).map(res=>({purchaseId:res._id,serialNumber:res.serialNumber?.toString()}));
   
    if (serialMatch) {
      this.setState({ purchaseId: serialMatch[0].purchaseId });
      this.setState({ serialNumber: serialMatch, isSerialShow: true });
    }else{
      ToastMessage({ type: MSG.ERROR, message: "Not added serial number"});
      this.setState({ isSerialShow: false });
    }
   

  }

  AddOrder = async ($e) => {
    
    $e.preventDefault();
    let payload = {
      orderID: this.state.orderId,
      totalPrice: this.state.totalPrice,
      qty: this.state.qty,
      date: this.state.date,
      deliveryDate: this.state.deliveryDate,
      clientInformation: this.state.clientInformation,
      purchaseID:this.state.purchaseId,
      itemId: this.state.itemId,
      isBilled: this.state.isChecked,
    }
    await this.props.AddOutboundOrder(payload);
    this.props.closeSidebar()
  }

  async componentDidMount() {
    
    let data=await getItemPurchaseOrder();
   


    this.setState({ itemList:data, dataList: _.uniqBy(data,"itemId"), purchaseId: data[0].itemId }, () => {
      this.selectChange(this.state.purchaseId);
    });

    // await this.props.getPurchaseOrder();
    // let defaultSelect = this.props.PurchasedOrder

   
  }


  // async dataCurrent(e) {


  //   if(e.length){
  //     await this.props.getOrderId(e);

  //     if (this.props.ItemsOrderR.length) {
  //       this.setState({dataList:this.props.ItemsOrderR})
  //       this.selectHasValue()
  //     }else {
  //       ToastMessage({ type: MSG.ERROR, message: MSG.ORDER_ID_NOT_MATCH_MSG });
  //     }
  //   }

  // }

  // selectHasValue = () =>{

  //   if(this.props.ItemsOrderR.length){
  //     this.setState({itemId : this.props.ItemsOrderR[0]._id})
  //   }
  // }



  render() {
    const { dataList, isSerialShow } = this.state
    return (

      <>
        <div className={`AddPurchaseOrders`} >
        <div className="overlay-pop" onClick={this.props.closeSidebar}></div>
          <form onSubmit={this.AddOrder} >
            <div className="userHeader d-flex align-items-center justify-content-between">
              <div className="UserName">
                <h2>Add Outbound Orders Detail</h2>
              </div>
              <div className="iconRight" onClick={this.props.closeSidebar}>
                <img src={iconRight} alt=""></img>
              </div>
            </div>
            <div className="itembody">
              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Order ID</span>
                </div>
                <div className="itemOutput">
                  <input
                    type="number"
                    value={this.state.orderId}
                    onChange={(e) => this.setState({ orderId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Date</span>
                </div>
                <div className="itemOutput">
                  <DatePicker
                    selected={this.state.date}
                    onChange={this.date}
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Delivery Date</span>
                </div>
                <div className="itemOutput">
                  <DatePicker
                    selected={this.state.deliveryDate}
                    onChange={this.deliveryDate}
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Total Price</span>
                </div>
                <div className="itemOutput">
                  <input type="number"
                    value={this.state.totalPrice}
                    onChange={(e) => this.setState({ totalPrice: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Client Name</span>
                </div>
                <div className="itemOutput">
                  <input type="text"
                    value={this.state.clientInformation}
                    onChange={(e) => this.setState({ clientInformation: e.target.value })}
                    required
                  />
                </div>
              </div>


              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Item Name</span>
                </div>
                <div className="itemOutput">

                  <select className="roleSelect" value={this.state.itemId} onChange={(e)=>this.selectChange(e.target.value)} required>
                    {dataList.map((el,i) => (
                      <option key={i} value={el.itemId}>{el.itemName}</option>
                    ))}

                  </select>
                </div>
              </div>

              {isSerialShow ? <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Serial Number</span>
                </div>
                <div className="itemOutput">
                <select className="roleSelect" value={this.state.purchaseId} onChange={(e)=>this.setState({purchaseId:e.target.value})} required>
                    {this.state.serialNumber.map((el,i) => (
                      <option key={i} value={el.purchaseId}>{el.serialNumber}</option>
                    ))}

                  </select>
                  {/* <span>{this.state.serialNumber}</span> */}
                </div>
              </div> : null}



              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Qty</span>
                </div>
                <div className="itemOutput">
                  <input type="number" value={this.state.qty}
                    onChange={(e) => this.setState({ qty: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Billed</span>
                </div>
                <div className="itemOutput text-start">
                  <input type="checkbox"
                    defaultChecked={this.state.isChecked}
                    onChange={this.toggleChange}
                  />

                </div>
              </div>


            </div>
            <div className="itemfooter text-end">
              <button className="pop_wth_btn" onClick={this.props.closeSidebar}>Cancel</button>
              <button className="save-btn">Save</button>

            </div>
          </form>
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS, ItemsOrderR, PurchasedOrder }) => ({ USER, GET_USERS, ItemsOrderR, PurchasedOrder });
export default connect(mapStateToProps, { getOutboundOrder, AddOutboundOrder, getOrderId, getPurchaseOrder, getItemsOrder })(AddOrdersView);