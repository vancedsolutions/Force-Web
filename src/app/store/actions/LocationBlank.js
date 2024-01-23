import axios from "axios";
import { API } from "../../utils/api";
import { SET_ERROR, ADD_LOCATION_BLANK, GET_LOCATION_BLANK } from "../types"


export const getLocationBlank = async (orderId) => {

    let response = await axios.get(API.getLocationBlank(orderId));
    return response.data || []

}

export const AddLocationBlank = async (payload) => {
    let response = await axios.post(API.addLocationBlank, payload);
    return response.data;

};