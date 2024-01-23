import axios from "axios";
import {API} from "../../../utils/api";

export const saveEmail =  async(payload) => {
    return await axios.post(API.saveEmail, payload).catch((e)=>{console.log(e)});
};

export const getEmail = async (payload) => {
    let response = await axios.post(API.getEmail,payload);
    return response.data||[];
}
export const getEmailHistory = async (payload) => {
    let response = await axios.post(API.getEmailHistory,payload);
    return response.data||[];
}
export const getCompanyByPermission=async(payload) => {
    return await axios.post(API.getCompanyByPermission, payload).catch((e)=>{console.log(e)});
};
export const emailDelete=async(id) => {
    return await axios.delete(API.removeEmail(id)).catch((e)=>{console.log(e)});
};

export const updateEmail = async (payload) => {
    return await axios.put(API.updateEmail, payload).catch(e => console.log(e));
}