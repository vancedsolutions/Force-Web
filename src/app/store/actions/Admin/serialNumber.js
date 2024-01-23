import axios from "axios";
import { API } from "../../../utils/api";
import { SET_ERROR, GET_SERIAL_NUMBER } from "../../types"

export const getSerialNumber = () => {

    return async (dispatch) => {
        await axios.post(API.getSerialNumber).then(response => {
            dispatch({
                type: GET_SERIAL_NUMBER,
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


export const addSerialNumber = async (payload) => {
    let response = await axios.post(API.addSerialNumber, payload);
    return response.data || [];
}