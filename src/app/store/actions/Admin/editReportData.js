
import {EDIT_CLIENT_DATA} from "../../types"
export const editClientData = (payload) => {
    return (dispatch) => {
            dispatch({
                type: EDIT_CLIENT_DATA,
                payload: payload || [],
            });
       
    }
}




