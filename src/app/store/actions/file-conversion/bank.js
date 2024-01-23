import axios from "axios";
import { API } from "../../../utils/api";
import { BANK_CONVERSION, SET_ERROR } from "../../types"
export const bankAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.bankUpload, payload).then(response => {

            dispatch({
                type: BANK_CONVERSION,
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