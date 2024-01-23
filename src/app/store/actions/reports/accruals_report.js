import axios from "axios";
import { API } from "../../../utils/api";
import { GET_ACCRUALS_REPORT, SET_ERROR } from "../../types"
export const GetAccrualsReport = (company) => {
    return async (dispatch) => {
        await axios.get(API.getAccrualsNew(company)).then(response => {
            dispatch({
                type: GET_ACCRUALS_REPORT,
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

