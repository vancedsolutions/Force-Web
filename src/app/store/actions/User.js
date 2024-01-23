import axios from "axios";
import { API, MSG } from "../../utils";
import { LOGOUT, SET_USER, SET_USER_ERROR } from "../types";
import { Storage } from './../../utils/storage'
import ToastMessage from '../../components/toast';

export const loginAction = (credentials) => {
    return (dispatch) => {
        axios.post(API.login, credentials).then(response => {
            let { username, company } = credentials;
            let { data, companyDetails, userDetails, permissions } = response.data;
            let user = { username, company, role: (userDetails.portalAccess || "Client"), ...data, companyDetails, userDetails, permissions };
            user.companyId = companyDetails._id;
            user.compSystemId = companyDetails.companyId;
            if (companyDetails.companyType === 'Admin' && !userDetails.role) {
                dispatch({
                    type: SET_USER_ERROR,
                    payload: {
                        data: "Not Authorized to sign-in, please contact your system Admin",
                        status: 403,
                        statusMessage: "FORBIDDEN",
                        error: true
                    }
                });
                ToastMessage({
                    type: MSG.ERROR,
                    message: "Not Authorized to sign-in, please contact your system Admin"
                })
            } else {
                Storage.setItem("USER", user);
                dispatch({
                    type: SET_USER,
                    payload: user
                });
            }
        }).catch(e => {
            dispatch({
                type: SET_USER_ERROR,
                payload: {
                    e, error: true
                }
            })
            ToastMessage({ type: MSG.ERROR, message: MSG.LOGIN_ERROR });
        })




    }
};
export const refreshUserAction = () => {
    const USER = Storage.getItem("USER");
    return {
        type: SET_USER,
        payload: USER || {}
    }
}

export const refreshToken = () => {
    return async (dispatch) => {
        await axios.get(API.refreshToken).then(response => {
            let user = Storage.getItem("USER");
            let { token, ttl, units } = response.data;
            user = { ...user, token, ttl, units };
            Storage.clearAll();
            Storage.setItem("USER", user);
            dispatch({
                type: SET_USER,
                payload: user
            });
        }).catch(e => {
            dispatch({
                type: SET_USER_ERROR,
                payload: {
                    e, error: true
                }
            })
        })
    }
}
export const logout = () => {
    Storage.clearAll();
    return {
        type: LOGOUT,
        payload: {}
    }
}
