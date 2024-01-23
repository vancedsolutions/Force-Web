import axios from "axios";
import { API } from "../../../utils/api";
import { GET_WAGE_PARITY_REPORT, SET_ERROR } from "../../types"
export const wageParityAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.wageParityReport, payload).then(response => {
            dispatch({
                type: GET_WAGE_PARITY_REPORT,
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