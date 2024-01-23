import axios from "axios";
import { API } from "../../utils/api";
import { SET_ERROR, LOCATION_LIST } from "../types"

export const GetLocationWage = () => {
    return async (dispatch) => {
        await axios.get(API.countryLocation).then(response => {
            dispatch({
                type: LOCATION_LIST,
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