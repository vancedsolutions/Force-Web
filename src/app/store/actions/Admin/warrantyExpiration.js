import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, ADD_EXPIRATION_DATE, GET_EXPIRATION_DATE } from "../../types"

export const getWarrantyExpiration = (itmeId) => {

    return async (dispatch) => {
        await axios.post(API.getWarrantyExpiration(itmeId)).then(response => {
            dispatch({
                type: GET_EXPIRATION_DATE,
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


export const AddWarrantyExpiration = (payload) => {

    return async (dispatch) => {
        await axios.post(API.addWarrantyExpiration, payload).then(response => {
            dispatch({
                type: ADD_EXPIRATION_DATE,
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
