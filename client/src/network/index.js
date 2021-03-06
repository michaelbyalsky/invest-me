import axios from "axios";
import Cookies from "js-cookie";

const network = axios.create({
  baseURL: "/api/v1",
});

const getToken = () => Cookies.get("accessToken");

network.interceptors.request.use((config) => {
  config.headers.authorization = `bearer ${getToken()}`;
  return config;
});

network.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    if (status === 403) {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('userId');
    Cookies.remove('username');
    Cookies.remove('rememberMe');
    }
    if (status === 408) {
      try {
        await network.post("/auth/token", {
          token: Cookies.get("refreshToken"),
        });
        const data = await network(originalRequest);
        return data;
      } catch (e) {
        throw e;
      }
    } else {
      throw error;
    }
  }
);

export default network;
