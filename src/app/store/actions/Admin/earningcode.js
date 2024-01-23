import Axios from "axios";
import {API,MSG} from "../../../utils"
import { GET_EARNINGS_CODES,GET_SAVED_EARNINGS_CODES_CONVERSION_TOOL } from "../../types";
import  ToastMessage  from '../../../components/toast';
export const getConversionTools = (companyId) => async (dispatch) => {
    if (!companyId) return;
   let conversionTools = await Axios.post(API.getEarningCodesByCompany(companyId));
    dispatch({
      type: GET_EARNINGS_CODES,
      payload: conversionTools.data.data,
    });
  };

  
export const getSavedConversionTools = (companyId) => async (dispatch) => {
    if (!companyId) return;
    let earningsCodes = await Axios.post(API.saveEarningCodes(companyId) );
  
    dispatch({
      type: GET_SAVED_EARNINGS_CODES_CONVERSION_TOOL,
      payload: earningsCodes.data,
    });
  };
  
export const setWageParityECS = (values) => async (dispatch) => {
 
    await Axios.post(API.setWagePartiyEcs, values);
    ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
  };
  export const saveECS=(payload)=>async(dispatch)=>{
      await Axios.post(API.updateEarningCode, payload);
      ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
  }