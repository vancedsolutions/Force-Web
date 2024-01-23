import axios from "axios";
import { API } from "../../../utils/api";
import { TAX_COLLECTIONS, SET_ERROR } from "../../types"
export const taxCollectionAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.taxCollection, payload).then(response => {

            dispatch({
                type: TAX_COLLECTIONS,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            });
        });
    };
};