import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://medicamp-api.onrender.com`,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
