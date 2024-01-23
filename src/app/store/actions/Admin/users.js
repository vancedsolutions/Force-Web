import axios from "axios";
import { API } from "../../../utils/api";
import { ALL_USERS, SET_ERROR } from "../../types"


export const getUsers = (payload) => {
    return async (dispatch) => {
        await axios.post(API.getAllUsers, payload).then(response => {

            dispatch({
                type: ALL_USERS,
                payload: response.data.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}




