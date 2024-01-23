import axios from 'axios';
import { API } from "../../../utils/api";
import { SET_ERROR, GET_PAYROLL_DETAIL } from "../../types"

export async function getLatestPayrollsNew(company) {
    return axios.get(`api/certified-payroll/last-payrolls-new/${company}`);
};

export async function getCPReport(company, payrollId) {
    return axios.get('api/certified-payroll/new-cp-pdf', {
        params: { company, payrollId },
        responseType: 'arraybuffer'
    })
}

export const payrollDetailAction = (company) => {

    return async (dispatch) => {
        await axios.get(`api/payroll/get-payroll/${company}`).then(response => {
            dispatch({
                type: GET_PAYROLL_DETAIL,
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

