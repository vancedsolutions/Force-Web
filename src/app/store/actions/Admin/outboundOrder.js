import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, ADD_OUTBOUND_ORDER, GET_OUTBOUND_ORDER, UPDATE_OUTBOUND_ORDER, GET_OUTBOUND_PRE_DATA } from "../../types"

export const getOutboundOrder = () => {
    return async (dispatch) => {
        await axios.post(API.getOutboundOrder).then(response => {
            dispatch({
                type: GET_OUTBOUND_ORDER,
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


export const AddOutboundOrder = (payload) => {
    return async (dispatch) => {
        await axios.post(API.addOutboundOrder, payload).then(response => {
            dispatch({
                type: ADD_OUTBOUND_ORDER,
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

export const UpdateOutboundOrder = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updateOutboundOrder, payload).then(response => {
            dispatch({
                type: UPDATE_OUTBOUND_ORDER,
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

export const getOrderIdOutbound = async (orderId) => {
    let response = await axios.get(API.getOrderTdOutbound(orderId));
    return response.data || []

}

export const getItemPurchaseOrder = async () => {
    let response = await axios.post(API.getItemByPurchaseOrder);
    return response.data || []

}


