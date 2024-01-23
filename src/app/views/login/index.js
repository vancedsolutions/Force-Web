import './style.scss'
import React, { Component } from "react";
import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { loginAction, GetRole, /* setRoleAction */ } from './../../store/actions'
import Logo from '../../assets/images/logo.png'
// import BGLogo  from '../../assets/images/excelforce-logo-only'

class LoginView extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        username: '',
        password: '',
        company: '',
        signingIn: false,
        role: '',
        isCredential: false
    };

    // lifecycle hooks

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.USER?.token) {
            this.checkUserAndRedirect();
        }
    }
    render() {
        return (
            <>
                <div className="BgLogin">
                    <div className="adminLogin">
                        <div className="imgcontainer">
                            <img src={Logo} alt="Avatar" className="avatar" />
                        </div>
                        <form className="adminLoginForm" onSubmit={this.login}>
                            <div className="form-group" >
                                <label>Company</label>
                                <input required id="companyId" type="text" label="Company" name="company" autoComplete="company" autoFocus onChange={(event) => this.setState({ company: event.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input required id="username" type="text" label="User Name" name="username" autoComplete="username" autoFocus onChange={(event) => this.setState({ username: event.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="d-flex align-items-center justify-content-between"><span>Password </span> </label>
                                <input required name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={(event) => this.setState({ password: event.target.value })} />
                                {this.state.errorMsg ? <p className="passErrror">Wrong password</p> : ""}
                            </div>
                            <div className="form-group">
                                <button className="submit-btm" type="submit">Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }

    // custom methods
    login = ($e) => {
        $e.preventDefault();
        this.props.loginAction({
            company: this.state.company,
            password: this.state.password,
            username: this.state.username,
            Role: this.state.role
        });
    }
    checkUserAndRedirect = async () => {

        /*  if (this.props.USER && Object.keys(this.props.USER).length && !this.state.isCredential) {
             let USER = this.props.USER;
 
             let response = await GetRole(username);
             let portalAccess = response.userRole[0]?.portalAccess;
             let roleData = response.role;
             this.setState({ isCredential: true });
 
             let data = {
                 Role: "",
                 company,
                 token, ttl, units, username
             }
             if (company.toUpperCase() === 'PCPAYADMIN') {
                 data.Role = 'Admin'
             } else {
                 data.Role = 'all'
             }
 
             //this.props.setRoleAction(data);*/

        this.props.history.push('/');

        // } 
    }
}
const mapStateToProps = ({ USER, user_Error }) => ({ USER, user_Error });
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        loginAction, /* setRoleAction */
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
