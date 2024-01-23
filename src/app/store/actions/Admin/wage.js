import axios from "axios";
import { API } from "../../../utils/api";
import { ADD_WAGE, UPDATE_WAGE, DELETE_WAGE, SET_ERROR, GET_WAGE_LIST, UPDATE_PERVIOUS_DATE } from "../../types"
export const AddWageAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.addWage, payload).then(response => {
            dispatch({
                type: ADD_WAGE,
                payload: response.data.data
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

export const UpdatePerviousDateEmptyAction = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updatePerviousDate, payload).then(response => {
            dispatch({
                type: UPDATE_PERVIOUS_DATE,
                payload: response.data.data
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
}
export const UpdateWageAction = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updateWage, payload).then(response => {
            dispatch({
                type: UPDATE_WAGE,
                payload: response.data.data
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
}
export const DeleteWageAction = (id) => {
    return async (dispatch) => {
        await axios.delete(API.deleteWage(id)).then(response => {
            dispatch({
                type: DELETE_WAGE,
                payload: response.data.data
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
}
export const GetWageAction = () => {
    return async (dispatch) => {
        await axios.post(API.getWage).then(response => {
            dispatch({
                type: GET_WAGE_LIST,
                payload: response.data.data
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
}
