import axios from "axios";
import { API, MSG } from "../../../utils";
import { SET_ERROR, GET_ANNUAL_BILLING_SETTINGS, UPDATE_ANNUAL_BILLING_SETTINGS } from "../../types";
import ToastMessage from '../../../components/toast';

export const getAnnualBillingSettings = () => {
    return async (dispatch) => {
        await axios.get('api/annual-billing/report-settings')
            .then(response => {
                dispatch({
                    type: GET_ANNUAL_BILLING_SETTINGS,
                    payload: response.data
                })
            }).catch(
                e => {
                    dispatch({
                        type: SET_ERROR,
                        payload: {
                            e, error: true
                        }
                    });
                });
    };
};

export const saveAnnualBillingSettings = (payload) => {
    return async (dispatch) => {
        await axios.post('api/annual-billing/update-settings', payload).then(response => {
            dispatch({
                type: UPDATE_ANNUAL_BILLING_SETTINGS,
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


