import axios from "axios";
import { API, MSG } from "../../../utils";
import { SET_ERROR, GET_BILLING_SERVICES, UPDATE_BILLING_SERVICES } from "../../types";
import ToastMessage from '../../../components/toast';

export const getBillingServices = (payload) => {

    return async (dispatch) => {
        await axios.post(API.getSavedBillingServices, payload).then(response => {

            dispatch({
                type: GET_BILLING_SERVICES,
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
}


export const UpdateBillingServices = (payload) => async () => {
    await axios.post(API.addUpdateBillingService, payload);
    ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
};


