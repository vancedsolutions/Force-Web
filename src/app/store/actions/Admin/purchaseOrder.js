import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, ADD_PURCHARE_ORDER, GET_PURCHARE_ORDER, UPDATE_PURCHARE_ORDER } from "../../types"

export const getPurchaseOrder = () => {

    return async (dispatch) => {
        await axios.post(API.getPurchaseOrder).then(response => {
            dispatch({
                type: GET_PURCHARE_ORDER,
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


export const AddPurchaseOrder = (payload) => {
    return async (dispatch) => {
        await axios.post(API.addPurchaseOrder, payload).then(response => {
            dispatch({
                type: ADD_PURCHARE_ORDER,
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

export const UpdatePurchaseOrder = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updatePurchaseOrder, payload).then(response => {
            dispatch({
                type: UPDATE_PURCHARE_ORDER,
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

export const autoOrderIdGenrated = async () => {
    let response = await axios.post(API.getAutoGenerate);
    return response.data;
}


