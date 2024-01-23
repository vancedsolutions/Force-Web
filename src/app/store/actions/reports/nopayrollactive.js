import axios from "axios";
import { API } from "../../../utils/api";
import { NO_PAYROLL_ACTIVITY, SET_ERROR, CSRS } from "../../types"
export const noPayrollActivityAction = (payload) => {
    return (dispatch) => {
        axios.get(API.noPayrollActive, { params: payload })
            .then(
                response => {
                    dispatch({
                        type: NO_PAYROLL_ACTIVITY,
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

export const fetchCSRSAction = () => {
    return async (dispatch) => {
        await axios.get(API.getCSRS).then(response => {
            dispatch({
                type: CSRS,
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