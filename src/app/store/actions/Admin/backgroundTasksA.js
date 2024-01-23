import Axios from "axios";
import { GET_BG_TASKS } from "../../types";
import { API, MSG } from "../../../utils";
import ToastMessage from '../../../components/toast';


export const getBackgroundTasks = () => async (dispatch) => {
  let tasksList = await Axios.get(API.backgroundTasks);

  dispatch({ type: GET_BG_TASKS, payload: tasksList.data });
};

export const updateClientBGTask = (data) => async (dispatch) => {
  let { name, value, clientId } = data;
  await Axios.post(API.updateBackgroundTasks, {
    taskName: name,
    value,
    clientId,
  });

  await dispatch(getBackgroundTasks());
  ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
};
