import Axios from "axios";
import { API } from "../../utils";
export const fileImageUpload = async(payload) => {

    const response = await Axios.post(API.saveFileUpload,payload);
    return response.data['data'];

};