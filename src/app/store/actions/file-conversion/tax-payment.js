import axios from "axios";
import { API } from "../../../utils/api";
import { TAX_PAYMENT, SET_ERROR } from "../../types"
export const taxPaymentAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.taxPayment, payload).then(response => {

            dispatch({
                type: TAX_PAYMENT,
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