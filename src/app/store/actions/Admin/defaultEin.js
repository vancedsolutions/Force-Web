import axios from "axios";
import { API, MSG } from "../../../utils";
import { GET_DEFAULT_EIN, SET_ERROR, SAVE_DEFAULT_EIN } from "../../types"
import ToastMessage from '../../../components/toast';

export const saveDefaultEIN = (payload) => {
    return async (dispatch) => {
        await axios.post(API.saveDefaultEIN, payload).then(response => {
            dispatch({
                type: SAVE_DEFAULT_EIN,
                payload: response.data
            });
            ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
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
export const getDefaultEINByCompanyID = (company) => {
    return async (dispatch) => {
        await axios.get(API.getDefaultEIN(company)).then(response => {
            dispatch({
                type: GET_DEFAULT_EIN,
                payload: response.data
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
