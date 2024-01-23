import React, { Component } from 'react'
import { connect } from "react-redux";
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getPurchaseOrder, AddPurchaseOrder, getOrderId, getItemsOrder,autoOrderIdGenrated} from "../../../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ToastMessage from '../../../../components/toast';
import { MSG } from "../../../../utils";
import _ from 'lodash';
class AddOrdersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseDate: "",
      deliveryDate: "",
      status: "Pending",
      isChecked: false,
      dataList: [],
      orderIdError: false,
      itemId: '',
      isExists: true
    }

  }

  purchaseDate = (e) => {
    // let dateCur = moment(e).format('DD-MM-YYYY');
    this.setState({ purchaseDate: e });
  };
  deliveryDate = (e) => {
    this.setState({ deliveryDate: e });
  };
  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    }); 
  }

  selectChange = (e) => {
    this.setState({ itemId: e.target.value }, () => {
      this.checkSerialNo(this.state.serialNumber);
    });
  
  }

  AddOrder = async ($e) => {
    
    $e.preventDefault();
    let payload = {
      orderID: this.state.orderId,
      totalPrice: this.state.totalPrice,
      qty: this.state.qty,
      purchaseDate: this.state.purchaseDate,
      deliveryDate: this.state.deliveryDate,
      status: this.state.status,
      itemId: this.state.itemId,
      serialnumber: this.state.serialNumber,
    }
    await this.props.AddPurchaseOrder(payload);
    this.props.closeSidebar()
  }

  async  componentDidMount(){
    await this.props.getItemsOrder();
    let data = this.props.ItemsOrderR
    
    let recordeList =_.uniqBy(data.records,"_id")
    recordeList.forEach(element => {
      ;
      let fd = data.records.filter(res => res._id === element._id);
      let serialFilterItem = fd.map(res => res.serialNumber);
      if (serialFilterItem.length) {
        element.serialNumber = fd.map(res => res.serialNumber);
      } else {
        element.serialNumber = [];
         }
      
         });
       
    this.setState({ dataList:recordeList });
    
    if (recordeList.length) {
      let da = recordeList;
      this.setState({
        itemId:da[0]._id
     })
    }
    if (this.props.ItemStatusList.length) {
      let defaultStatus = this.props.ItemStatusList;
      this.setState({
        status: defaultStatus[0]._id
      })
    }
     
    let getOrderId = await autoOrderIdGenrated();
    this.setState({ orderId: getOrderId });
    await this.props.getPurchaseOrder();
    let defaultSelect = this.props.PurchasedOrder
  }
  checkSerialNo(serialno) {
    
    let selectedItem=this.state.dataList.filter(d=>d._id===this.state.itemId)
    let exists =selectedItem.filter(res => res.serialNumber.find(a=>a===serialno))
    if (exists.length) {
      this.setState({ serialNumber: serialno,isExists:false })
    } else {
      this.setState({serialNumber: serialno,isExists:true})
    }
  }

  


  render() {
    const {dataList,isExists} = this.state
    return (
      <>
        <div className={`AddPurchaseOrders`} >
          <div className="overlay-pop" onClick={this.props.closeSidebar}></div>
          <form onSubmit={this.AddOrder} >
            <div className="userHeader d-flex align-items-center justify-content-between">
              <div className="UserName">
                <h2>Add Purchase Orders Detail</h2>
              </div>
              <div className="iconRight" onClick={this.props.closeSidebar}>
                <img src={iconRight} alt=""></img>
              </div>
            </div>
            <div className="itembody">
              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Order ID </span>
                </div>
                <div className="itemOutput">
                  <input
                    type="text"
                    value={this.state.orderId}
                    onChange={(e) => this.setState({ orderId: e.target.value })}
                    readOnly
                  />
                </div>
              </div>

              <div className="itemList d-flex align-items-center justify-content-between">
                <div className="itemLabel">
                  <span>Serial Number</span>
                </div>
                <div className="itemOutput">
                
                  <input type="number"
                    value={this.state.serialNumber}
                    onChange={(e) => this.checkSerialNo(e.target.value)}
                    required
                  />
                  {(!isExists)&&(<span className="Error">{MSG.ExistSerialNo}</span>)}
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
                  <span>Item Name</span>
                </div>
                <div className="itemOutput">

                <select className="roleSelect" value={this.state.itemId} onChange={this.selectChange}  required>
                    {dataList.map(el => (
                      <option key={el._id} value={el._id}>{el.itemName}</option>
                    ))}

                  </select>

                  {/* <input type="text"
                    value={this.state.title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                    required
                  /> */}
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
                  <span>Status</span>
                </div>
                <div className="itemOutput">

                  <select className="roleSelect" value={this.state.status} onChange={(e) => this.setState({ status: e.target.value })} >
                    {this.props.ItemStatusList.map(el => (
                      <option value={el._id}>{el.statusName}</option>
                    ))}

                  </select>
                </div>
              </div>

            </div>
            <div className="itemfooter text-end">
              <button className="pop_wth_btn" onClick={this.props.closeSidebar}>Cancel</button>
              <button className="save-btn" type="submit" disabled={!isExists}>Save</button>
            </div>
          </form>

        </div>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS, ItemStatusList, ItemsOrderR,PurchasedOrder }) => ({ USER, GET_USERS, ItemStatusList, ItemsOrderR,PurchasedOrder });
export default connect(mapStateToProps, { getPurchaseOrder, AddPurchaseOrder, getOrderId, getItemsOrder })(AddOrdersView);