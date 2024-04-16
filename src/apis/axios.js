import authApi from "./authApi";
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_ENDPOINT_URL + "/api/v1/",
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    /**
     * * Sau khi gọi refresh token thì lần sau gọi lại get user
     * * thì nó sẽ set lại header request lên server
     */
    const token = localStorage.getItem("accessToken");

    if (typeof token === "string" && token !== null && !token !== "" && token !== undefined) {
      console.log(token);
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const config = error.config;
    const response = error?.response;
    // console.log({ config, response });

    /**
     * * Kiểm tra nếu nó bằng đường dẫn "/auth/refresh-token" thì sẽ return error
     * * Nếu không sẽ bị lặp vô tận
     */
    if (response && response.status === 403 && config.url === "/auth/refresh-token") {
      return Promise.reject(error);
    }

    // * kiểm tra accessToken hết hạn thì sẽ gọi "/auth/refresh-token" để cung cấp lại accessTonken
    if (response && response.status === 403 && response.data.message === "jwt expired") {
      const res = await authApi.refreshToken();

      if (res.data) {
        // * Sau khi gọi refresh token thì chúng ta sẽ có accessToken mới
        // * và set vào localStorage sau đó set headers cho axios
        localStorage.setItem("accessToken", res.data.accessToken);

        instance.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken;
        return instance(config);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
