import Axios from "axios";
import { GET_CLIENTS, GET_CLIENT } from "../../types";
import { API, MSG } from "../../../utils"
import ToastMessage from '../../../components/toast';
export const getClients = () => async (dispatch) => {
  let clients = await Axios.get(API.getClients);

  dispatch({
    type: GET_CLIENTS,
    payload: clients.data.data,
  });
};

export const updateClient = (vals) => async (dispatch) => {
  let client = await Axios.post(API.updateClients, { ...vals });

  dispatch({ type: GET_CLIENT, payload: client.data.data });
  ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
};

export const getClient = (company) => async (dispatch) => {
  let client = await Axios.post(API.clientsByCompany(company));

  dispatch({ type: GET_CLIENT, payload: client.data.data });
};
