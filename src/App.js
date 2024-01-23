import './App.scss';
import './app/utils/axios';
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomeView from "./app/views/home";
import AdminLoginView from "./app/views/login/index-admin"
import LoginView from "./app/views/login";
import { bindActionCreators } from "redux";
import { refreshUserAction } from './app/store/actions';
import { getUserExpAuth} from './app/utils/helpers';
import  loading from './app/assets/images/loader_all.png'
 
class App extends Component {
    constructor(props) {
        super(props);
        if (getUserExpAuth()) {
            props.refreshUserAction();
        }
        this.state = {
            loader: true
        }
       
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({loader:false})
          }, 2000);
        
    }

    render() {
        return (
            <>
            {/* {this.state.loader ? 
             <div id="loading_all">
                <img src={loading}/>
            </div> 
            : ""  } */}
                <BrowserRouter>
                    <Switch>
                        <Route path='/admin/login' component={AdminLoginView} />
                        <Route path='/login' component={LoginView} />
                        <Route path='/' component={HomeView} />
                    </Switch>
                </BrowserRouter>
               
            </> 
        );
    }
}
const mapStateToProps = (state) => ({
    USER: state.USER
});
const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        refreshUserAction,
    }, dispatch)
)
export default connect(mapStateToProps, mapDispatchToProps)(App)
