import axios from "axios";
import { MSG } from "../../../utils";
import { GET_PERMISSIONS, SET_ERROR, SAVE_PERMISSIONS, GET_ROLE_PERMISSIONS, CLIENT_PERMISSIONS } from "../../types";
import ToastMessage from '../../../components/toast';

export const savePermissions = (payload) => {
    return async (dispatch) => {
        await axios.post(`api/permission/save-permissions`, payload).then(response => {
            dispatch({
                type: SAVE_PERMISSIONS,
                payload: response.data,

            });
            ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
            dispatch({
                type: GET_PERMISSIONS,
                payload: response.data
            })
        }).catch(e => {
            ToastMessage({ type: MSG.ERROR, message: e });
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
};

export const getPermissions = (clientId) => {
    return async (dispatch) => {
        const payload = { company: clientId };
        await axios.post(`api/permission/get-available-permission`, payload).then(response => {
            dispatch({
                type: GET_PERMISSIONS,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
};

export const getRolePermissions = (roleId) => {
    return async (dispatch) => {
        await axios.get(`api/permission/get-role-permissions/${roleId}`).then(res => {
            dispatch({
                type: GET_ROLE_PERMISSIONS,
                payload: res.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            });
        });
    };
};

export const getCompanyPermissions = (companyId) => {
    return async dispatch => {
        await axios.get(`api/permission/get-company-permissions/${companyId}`).then(res => {
            dispatch({
                type: CLIENT_PERMISSIONS,
                payload: res.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            });
        });
    };
};
