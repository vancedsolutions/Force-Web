import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, GET_PERMISSION_BY_COMPANY } from "../../types";

export const getPermissionByCompany = (payload) => {
    return async (dispatch) => {
        await axios.post(`api/permission/get-permission`, payload).then(response => {
            dispatch({
                type: GET_PERMISSION_BY_COMPANY,
                payload: response.data
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

export const getReport = async (payload) => {
    const response = await axios.get(API.getReportPermission(payload));
    return response.data;
};
