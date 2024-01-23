import axios from "axios";
import { API, MSG } from "../../../utils";
import { ROLE_LIST, ADD_ROLE, SET_ERROR, USER_ROLE_PERMISSION, SET_USER, ROLE_CONFIG } from "../../types";
import ToastMessage from '../../../components/toast';

export const AddRoleAction = (payload) => {

    return async (dispatch) => {

        await axios.post(API.addRole, payload).then(response => {
            dispatch({
                type: ADD_ROLE,
                payload: response.data.data
            });
            ToastMessage({ type: MSG.SUCCESS, message: MSG.ADD_ROLE });
        }).catch(e => {
            ToastMessage({ type: MSG.ERROR, message: e });
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            })
        })
    }
};

export const GetRoleAction = (company) => {
    return async (dispatch) => {
        await axios.post(`api/role/get-role/${company}`).then(response => {
            dispatch({
                type: ROLE_LIST,
                payload: response.data.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            })
        })
    }
};
export const UpdateRoleAction = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updateRoleList, payload).then(response => {
            dispatch({
                type: ADD_ROLE,
                payload: response.data.data
            });
            ToastMessage({ type: MSG.SUCCESS, message: MSG.EDIT_ROLE });
        }).catch(e => {

            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            })
            ToastMessage({ type: MSG.ERROR, message: e });
        })
    }
};
export const GetRolePermissionAction = (username) => {

    return async (dispatch) => {
        await axios.post(`api/role/get-role-by-username/${username}`).then(response => {

            dispatch({
                type: USER_ROLE_PERMISSION,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            })
        })
    }
};
export const GetRole = async (username) => {
    let response = await axios.get(`api/role/get-role-by-username/${username}`);
    return response?.data;
};

export const GetRoleConfig = () => {

    return async (dispatch) => {
        await axios.get(API.getRoleConfig).then(response => {

            dispatch({
                type: ROLE_CONFIG,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            })
        })
    }

};
