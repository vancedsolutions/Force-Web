import axios from "axios";
import { apiEndPoint } from "./constants";
import { getUserAuth, getUserExpAuth } from './helpers';
import {  refreshToken } from "../store/actions";

axios.defaults.baseURL = apiEndPoint;

axios.interceptors.request.use(req => {


  let userInfo = getUserAuth();
  req.headers = {
    ...req.headers,
    ...userInfo
  };
  req.headers["authentication"] = userInfo.token?.startsWith('bearer ') ? userInfo.token : `bearer ${userInfo.token}`
  return req;
});

axios.interceptors.response.use(
  res => res,
  err => {

    if (err.response.status === 404) {
      throw new Error(`${err.config.url} not found`);
    }
    else if (err.response.status === 401) {
      refreshToken();
    }
    throw err;
  }
);
