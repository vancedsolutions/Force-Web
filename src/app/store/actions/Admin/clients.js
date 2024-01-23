import axios from "axios";
import { API } from "../../../utils/api";
import { GET_COMPANIES, SET_ERROR } from "../../types"
export const companiesAction = (payload) => {
    return async (dispatch) => {
        await axios.post('api/listing/get-companies', payload).then(response => {

            dispatch({
                type: GET_COMPANIES,
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

export const getAllClient = async (payload) => {

    const response = await axios.post('api/listing/get-companies', payload);
    return response.data;
}

