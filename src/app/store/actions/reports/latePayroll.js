import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, LATE_PAYROLL, LATE_PAYROLL_DETAIL } from "../../types"
export const latePayrollAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.getLatePayroll, payload).then(response => {
            dispatch({
                type: LATE_PAYROLL,
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

export const latePayrollDetailAction = () => {
    return async (dispatch) => {
        await axios.post(API.getLatePayrollDetail).then(response => {
            dispatch({
                type: LATE_PAYROLL_DETAIL,
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