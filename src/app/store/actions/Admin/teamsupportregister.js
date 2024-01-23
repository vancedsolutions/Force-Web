import axios from "axios";
import { API } from "../../../utils/api";
import { TEAM_SUPPORT_REGESTER, SET_ERROR } from "../../types"
export const teamSupportRegesterAction = (payload) => {
    return async (dispatch) => {
        await axios.post(API.getTeamSupportRegister, payload).then(response => {
            dispatch({
                type: TEAM_SUPPORT_REGESTER,
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

