import Axios from "axios";
import { GET_PAYROLL_EARNINGS_CODES, GET_SAVED_EARNINGS_CODES, SET_ERROR } from "../../types";
import { API } from "../../../utils/api";

export const getEarningsCodes = (companyId, companyShortName) => async (dispatch) => {

    // API.getEarningCodesByCompanyReportSetting(companyId)
    await Axios.post(API.getEarningCodesByCompany(companyId)).then((response) => {



        dispatch({
            type: GET_PAYROLL_EARNINGS_CODES,
            // payload: response.data.items,
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
}





export const setWageParityECS = (values) => async (dispatch) => {
    await Axios.post(API.setWageParityECS, values);
};

export const getSavedEarningsCodes = (companyId) => async (dispatch) => {
    if (!companyId) return;
    let earningsCodes = await Axios.post(
        API.getSavedEarningsCodes(companyId)
    );

    dispatch({
        type: GET_SAVED_EARNINGS_CODES,
        payload: earningsCodes.data,
    });
};


