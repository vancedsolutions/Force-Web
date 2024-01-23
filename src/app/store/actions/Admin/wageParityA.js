import Axios from "axios";
import { GET_SAVED_EARNINGS_CODES, GET_WP_SETUP } from "../../types";

export const setWageParityECS = (values) => async (dispatch) => {

  await Axios.post("api/wage-parity/earnings-codes", values);
};

export const getSavedEarningsCodes = (companyId) => async (dispatch) => {
  if (!companyId) return;

  let earningsCodes = await Axios.post(
    `api/wage-parity/saved-earnings-codes/?companyId=${companyId}`
  );
  dispatch({
    type: GET_SAVED_EARNINGS_CODES,
    payload: earningsCodes.data,
  });
};

export const getWPSetup = (clientId) => async (dispatch) => {

  let cc = await Axios.post(`api/wage-parity/wp-setup/${clientId}`);
  if (!cc.data) return dispatch({ type: GET_WP_SETUP, payload: {} });

  dispatch({ type: GET_WP_SETUP, payload: cc.data.data });
};

export const setupWP = (vals) => async (dispatch, getState) => {
  // let cc =
  await Axios.post("api/wage-parity/wp-setup", vals);
  dispatch(getWPSetup(vals.clientId));
};

export const getWageRatesPerLocation = (locationId) => async (dispatch) => { };

export const wpLocationLink = (vals) => async (dispatch) => {
  await Axios.post(`api/wage-parity/wp-ll`, vals);
};
