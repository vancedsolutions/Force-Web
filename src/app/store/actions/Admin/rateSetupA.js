import Axios from "axios";
import { GET_WAGE_RATE_LOCATIONS } from "../../types";
import ToastMessage from '../../../components/toast';
import {
  API, MSG
} from "../../../utils";
export const addWageLocation = (val) => (dispatch) => {
  Axios.post(API.wageLocation, val);
};

export const getWageLocations = (val) => async (dispatch) => {
  let wages = await Axios.get(API.getLocationWage, val);
  dispatch({ type: GET_WAGE_RATE_LOCATIONS, payload: wages.data.data });
};

export const addWageRate = (val, type) => async (dispatch, getState) => {
  await Axios.post(API.wageRate(type), val);
  // ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
  dispatch(getWageLocations());
};

export const deleteWageRate = (id) => async (dispatch) => {
  await Axios.delete(API.wageRate(id));
  ToastMessage({ type: MSG.SUCCESS, message: MSG.DELETE_MSG });
  dispatch(getWageLocations());
};
