import Axios from "axios";
import { GET_CSR_ASSIGNMENTS, ADD_UPDATE_CSR, SET_ERROR, DELETE_CSR_ASSIGNMENTS, ADD_CSR_SETTINGS } from "../../types";
import { API } from "../../../utils";


export const getCsrAssignments = () => async (dispatch) => {
    let CsrAssignmentsList = await Axios.get(API.getCsrAssignments);
    dispatch({ type: GET_CSR_ASSIGNMENTS, payload: CsrAssignmentsList.data });
};

export const updateCsrAssignments = (data) => async (dispatch) => {
    await Axios.post(API.updateCsrAssignments, { data });
    await dispatch({ type: ADD_UPDATE_CSR, payload: data });
};

export const addCsrAssignments = (data) => async (dispatch) => {
    await Axios.post(API.addCsrAssignments, { data });
    await dispatch({ type: ADD_CSR_SETTINGS, payload: data });
};

export const DeleteCsrAssignments = (id) => {

    return async (dispatch) => {
        await Axios.delete(API.deleteCsrAssignments(id)).then(response => {
            dispatch({
                type: DELETE_CSR_ASSIGNMENTS,
                payload: response.data
            });
        }).catch(e => {
            console.log(e);
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            })
        })
    }
}