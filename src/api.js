import axios from "axios";
import { API_URL } from "./configs/APIUrl";
axios.defaults.withCredentials = true;
const PROTOCOL = window.location.protocol;

export const apiSearchTime = (params)=>{
  return axios.get(`${PROTOCOL}${API_URL}/player_betting/search_time`,{params})
};
export const apiSearchId = (params)=>{
  return axios.get(`${PROTOCOL}${API_URL}/player_betting/search_id`,{params})
};
export const apiDetailLink = (params)=>{
  return axios.get(`${PROTOCOL}${API_URL}/player_betting/detail_link`,{params})
}