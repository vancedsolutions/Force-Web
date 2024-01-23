import axios from "axios";
import { API } from "../../../utils/api";
import { REPORT_ID, SET_ERROR } from "../../types"


export const savePayrollRange = (clientId, payload) => {
    return async (dispatch) => {
        await axios.post(API.payrollRange(clientId), payload).then(response => {
            dispatch({
                type: REPORT_ID,
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
}
