import Axios from "axios";
import {
    API, MSG
} from "../../utils"
import ToastMessage from '../../components/toast';
import {
    GET_WAGE_PARITY_REPORT,
    TEAM_SUPPORT_REGESTER,
    LATE_PAYROLL,
    LATE_PAYROLL_DETAIL,
    NO_PAYROLL_ACTIVITY,
    ALL_USERS,
    PATIENT_HOURS,
    SET_ERROR,
    GET_COMPANIES
} from "../types";
export const getSyncWageParity = () => async (dispatch) => {

    await Axios.get(API.getSyncWageParity).then((response) => {
        dispatch({
            type: GET_WAGE_PARITY_REPORT,
            payload: response.data.data,
        });
    }).catch(e => {
        dispatch({
            type: SET_ERROR,
            payload: {
                e,
                error: true
            }
        })
    });

};
export const getSyncTeamSupportRegister = () => async (dispatch) => {

    await Axios.get(API.getSyncTeamSupportRegister).then((response) => {
        dispatch({
            type: TEAM_SUPPORT_REGESTER,
            payload: response.data.data,
        });
    }).catch(e => {
        dispatch({
            type: SET_ERROR,
            payload: {
                e,
                error: true
            }
        })
    });

};
export const getSyncPatientHourReport = (payload) => async (dispatch) => {

    await Axios.post(API.syncPatientHourReport, { payload }).then((response) => {
        dispatch({
            type: PATIENT_HOURS,
            payload: response.data.data,
        });
    }).catch(e => {
        dispatch({
            type: SET_ERROR,
            payload: {
                e,
                error: true
            }
        })
        ToastMessage({ type: MSG.ERROR, message: e });
    });

};
export const getSyncLatePayrollDetails = () => async (dispatch) => {

    await Axios.get(API.getSyncLatePayrollDetails).then((response) => {
        dispatch({
            type: LATE_PAYROLL_DETAIL,
            payload: response.data.data,
        });
    }).catch(e => {
        dispatch({
            type: SET_ERROR,
            payload: {
                e,
                error: true
            }
        })
    });

};
export const getSyncLatePayroll = () => async (dispatch) => {

    await Axios.get(API.getSyncLatePayroll).then((response) => {
        dispatch({
            type: LATE_PAYROLL,
            payload: response.data.data,
        });
    }).catch(e => {
        dispatch({
            type: SET_ERROR,
            payload: {
                e,
                error: true
            }
        })
    });

};
export const getSyncNoPayrollActivity = () => async (dispatch) => {

    await Axios.get(API.getSyncNoPayrollActivity).then((response) => {
        dispatch({
            type: NO_PAYROLL_ACTIVITY,
            payload: response.data.data,
        });
    }).catch(e => {
        dispatch({
            type: SET_ERROR,
            payload: {
                e,
                error: true
            }
        })
    });

};
export const getSyncClient = () => async (dispatch) => {
    await Axios.get(`api/sync-report/sync-clients`).then((response) => {
        dispatch({
            type: GET_COMPANIES,
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
    });
}

export const getSyncUser = () => async (dispatch) => {
    await Axios.get(API.getSyncUser).then((response) => {
        dispatch({
            type: ALL_USERS,
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
    });
}

async function syncPayrollAction(company) {
    let response = await Axios.get(API.getSyncPayroll(company));
    return response
}
async function getSyncCostCenter(company) {
    let response = await Axios.get(API.getSyncCostCenter(company));
    return response
}
async function getSyncEarningsCodes(company) {
    let response = await Axios.get(API.syncEarningCodeByCompanyCode(company));
    return response
}

async function getSyncEins(company) {
    let response = await Axios.get(API.syncCompanyEins(company));
    return response;
}

export const syncCompanyData = (company) => async () => {
    let response = await Axios.all([getSyncEarningsCodes(company), getSyncCostCenter(company), syncPayrollAction(company), getSyncEins(company)]);
    return response;
}