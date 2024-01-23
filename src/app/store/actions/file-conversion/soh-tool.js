import axios from "axios";
import { API } from "../../../utils/api";
import { COUNTY_WAGE, EARNING_CODE, SET_ERROR } from "../../types"
export const MinWageAction = () => {
    return async (dispatch) => {
        await axios.get(API.countryWage).then(response => {
            dispatch({
                type: COUNTY_WAGE,
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

export const EarningCodeAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.earningCode, payload).then(response => {
            dispatch({
                type: EARNING_CODE,
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