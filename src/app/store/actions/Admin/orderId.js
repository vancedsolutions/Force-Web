import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, ORDER_ID } from "../../types"


export const getOrderId = (orderId) => {

    return async (dispatch) => {
        await axios.post(API.getOrderTd(orderId)).then(response => {
            dispatch({
                type: ORDER_ID,
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
}