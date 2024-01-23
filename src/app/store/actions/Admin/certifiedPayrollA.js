import { post } from "axios";
import { MSG } from "../../../utils";
import  ToastMessage  from '../../../components/toast';
export const setCertifiedECS = (values) => async (dispatch) => {
  await post("api/certified-payroll/earnings-codes", values);
  ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
};


