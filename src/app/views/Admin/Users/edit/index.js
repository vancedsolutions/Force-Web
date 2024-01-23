import React, { Component } from 'react'
import { connect } from "react-redux";
import './style.scss';
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import { getUsers } from "../../../../store/actions";

class EditUser extends Component {
  constructor(props) {
    super(props);
  }

  state = {

    showPassword: 'text',
  }

  showPasswordF = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }



  render() {



    return (

      <>
        <div className={`userEdit ${this.props.classNames} `} >


          <div className="overlay-pop" onClick={this.props.closeSidebar}></div>
          <div className="userHeader d-flex align-items-center justify-content-between">
            <div className="UserName">
              <h2>{this.props.isSelectedRowData?.fullName}</h2>
            </div>
            <div className="iconRight" onClick={this.props.closeSidebar}>
              <img src={iconRight} alt=""></img>
            </div>
          </div>
          <div className="userbody">
            <div className="userList d-flex align-items-center justify-content-between">
              <div className="userNameLabel">
                <span>Name</span>
              </div>
              <div className="userNameOutput">
                <span>:   {this.props.isSelectedRowData?.fullName}</span>
              </div>
              <div className="userAction text-right">
                <span className="text-blue">Edit</span>
              </div>
            </div>
            <div className="userList d-flex align-items-center justify-content-between">
              <div className="userNameLabel">
                <span>Email</span>
              </div>
              <div className="userNameOutput">
                <span>:  {this.props.isSelectedRowData?.Email}</span>
              </div>
              <div className="userAction text-right">
                <span className="text-blue">Edit</span>
              </div>
            </div>
            <div className="userList d-flex align-items-center justify-content-between">
              <div className="userNameLabel">
                <span>Role</span>
              </div>
              <div className="userNameOutput">
                <select className="roleSelect">
                  <option>{this.props.isSelectedRowData?.portalAccess}</option>
                </select>
              </div>
              <div className="userAction text-right">

              </div>
            </div>
            <div className="userList d-flex align-items-center justify-content-between">
              <div className="userNameLabel">
                <span>Password </span>
              </div>
              <div className="userNameOutput">
                <input type={this.state.showPassword ? "password" : "text"} />
              </div>
              <div className="userAction text-right">
                <span className="text-grey" onClick={this.showPasswordF}>{this.state.showPassword ? "Show" : "Hide"}</span>
                <span className="text-blue">Change</span>
              </div>
            </div>
            <div className="userList d-flex align-items-center justify-content-between">
              <div className="userNameLabel">
                <span>Display Avatar</span>
              </div>
              <div className="userNameOutput">
                <span>:  Yes</span>
              </div>
              <div className="userAction text-right">

              </div>
            </div>


          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ USER, GET_USERS }) => ({ USER, GET_USERS });
export default connect(mapStateToProps, { getUsers })(EditUser);