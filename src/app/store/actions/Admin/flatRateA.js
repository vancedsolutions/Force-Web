import axios from "axios";
import { API } from "../../../utils/api";
import { MIN_WAGE_LOCATION_DATA, SET_ERROR } from "../../types"


export const getFlateRateId = (selectedLocationId) => {
    return async (dispatch) => {
        await axios.post(API.getMinWageLocationId(selectedLocationId)).then(response => {
            dispatch({
                type: MIN_WAGE_LOCATION_DATA,
                payload: response.data.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}