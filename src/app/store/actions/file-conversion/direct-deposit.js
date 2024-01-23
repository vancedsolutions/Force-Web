import axios from "axios";
import { DIRECT_DEPOSIT, SET_ERROR } from "../../types";
import { MSG } from '../../../utils/message'
import Toast from '../../../components/toast';
export const directDepositAction = (payload) => {
    return async (dispatch) => {
        await axios.post('api/file-transform/direct-deposit', payload).then(response => {

            dispatch({
                type: DIRECT_DEPOSIT,
                payload: response.data
            });
            Toast()
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