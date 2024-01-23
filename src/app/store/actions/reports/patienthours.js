import axios from "axios";
import { API } from "../../../utils/api";
import {
    PATIENT_HOURS, SET_ERROR, COORDINATOR, EINS, SYNC_PH
} from "../../types"
export const patientHoursAction = (payload) => {
    return async (dispatch) => {
        await axios.post('api/patient-hours/patient-hours-report', payload).then(response => {
            dispatch({
                type: PATIENT_HOURS,
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


export const coordinatorAction = () => {
    return async (dispatch) => {
        await axios.get(API.getAllCoordinators).then(response => {
            dispatch({
                type: COORDINATOR,
                payload: response.data.data
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

export const EinsHourAction = (id) => {
    return async (dispatch) => {
        await axios.get(`api/patient-hours/get-eins/${id}`).then(response => {
            dispatch({
                type: EINS,
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

export const SyncPHAction = (company) => {
    return async (dispatch) => {
        await axios.get(API.getSyncPHPayrollPerCompany(company)).then(response => {
            dispatch({
                type: SYNC_PH,
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


