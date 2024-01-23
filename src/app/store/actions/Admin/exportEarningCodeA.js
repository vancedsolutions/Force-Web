import Axios from "axios";
import {API,MSG} from "../../../utils"
import {GET_EXPORT_EARNING_CODE,EXPORT_EARNING_CODE,SET_ERROR } from "../../types";
import  ToastMessage  from '../../../components/toast';
export const getExportEarningCodeByCompanyId = (companyId) => async (dispatch) => {
  
    if (!companyId) return;
   let getExportEarningCode = await Axios.post(API.exportEarningCodeByCompanyid(companyId));
    dispatch({
      type: GET_EXPORT_EARNING_CODE,
      payload: getExportEarningCode.data.data,
    });
};
  
export const exportEarningCode = (payload) => async (dispatch) => {  
   let getExportEarningCode = await Axios.post(API.exportEarningCode,payload);
    dispatch({
      type: EXPORT_EARNING_CODE,
      payload: [getExportEarningCode.data.data],
    });
    ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
  };