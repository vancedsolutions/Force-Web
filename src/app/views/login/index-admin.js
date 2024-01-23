import './style.scss'
import React, { Component } from "react";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import {
    loginAction,
} from './../../store/actions'

import adminLogo from '../../assets/images/admin-logo.svg';
import { SET_USER_ERROR } from "../../store/types";

class AdminLoginView extends Component {

    constructor(props) {
        super(props);

    }
    // variables
    state = {
        username: '',
        password: '',
        company: 'pcpayadmin',
        role: 'Admin',
        signingIn: false,

    };

    // lifecycle hooks
    componentDidMount() {

        this.checkUserAndRedirect();

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkUserAndRedirect();
    }
    render() {
        return (
            <>
                <div className="BgLogin">
                    <div className="adminLogin">
                        <div className="imgcontainer">
                            <img src={adminLogo} alt="Avatar" className="avatar" />
                        </div>

                        <form className="adminLoginForm" onSubmit={this.login}>

                            <div className="form-group">
                                <label>Username</label>
                                <input variant="outlined" margin="normal" required id="username" type="text" label="User Name" name="username" autoComplete="username" autoFocus onChange={(event) => this.setState({ username: event.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="d-flex align-items-center justify-content-between"><span>Password </span> </label>
                                <input variant="outlined" margin="normal" required name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={(event) => this.setState({ password: event.target.value })} />
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

        this.setState({ signingIn: true })
        this.props.loginAction({
            company: this.state.company,
            password: this.state.password,
            username: this.state.username,
            role: this.state.role

        })


    }
    checkUserAndRedirect = async () => {

        if (this.props.USER && Object.keys(this.props.USER).length) {

            this.props.history.push('/');
        }
    }
}
const mapStateToProps = ({ USER, user_Error }) => ({ USER, user_Error });
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        loginAction,


    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AdminLoginView);
