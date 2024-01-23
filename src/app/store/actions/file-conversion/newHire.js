import axios from "axios";
import { NEW_HIRE, SET_ERROR } from "../../types"
export const newHireAction = (payload) => {
    return async (dispatch) => {
        await axios.post('api/file-transform/new-hire', payload).then(response => {

            dispatch({
                type: NEW_HIRE,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e, error: true
                }
            });
        });
    };
};