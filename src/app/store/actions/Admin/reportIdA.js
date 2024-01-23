import axios from "axios";
import { API, MSG } from "../../../utils";
import { REPORT_ID, SET_ERROR } from "../../types"
import ToastMessage from '../../../components/toast';

export const saveReportId = (clientId, payload) => {
    return async (dispatch) => {
        await axios.post(API.saveReportId(clientId), payload).then(response => {
            dispatch({
                type: REPORT_ID,
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
export const getReportId = (clientId, payload) => {
    return async (dispatch) => {
        await axios.get(API.getReportId(clientId)).then(response => {
            dispatch({
                type: REPORT_ID,
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
