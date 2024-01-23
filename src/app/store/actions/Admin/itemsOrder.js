import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, ADD_ITEM_ORDER, GET_ITEMS_ORDER, UPDATE_ITEM_ORDER, ITEMS_STATUS } from "../../types"

export const getItemsOrder = () => {
    return async (dispatch) => {
        await axios.post(API.getItemsOrder).then(response => {
            dispatch({
                type: GET_ITEMS_ORDER,
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


export const AddItemOrder = (payload) => {
    return async (dispatch) => {
        await axios.post(API.addItemOrder, payload).then(response => {
            dispatch({
                type: ADD_ITEM_ORDER,
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

export const UpdateItemOrder = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updateItemOrder, payload).then(response => {
            dispatch({
                type: UPDATE_ITEM_ORDER,
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

export const getStatus = () => {
    return async (dispatch) => {
        await axios.post(API.getItemStatus).then(response => {
            dispatch({
                type: ITEMS_STATUS,
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


