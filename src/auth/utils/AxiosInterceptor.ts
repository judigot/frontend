import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const accessToken: string = localStorage.getItem("accessToken") || "";
    // const accessToken: string = getToken("accessToken");

    config.headers["Content-Type"] = "application/json";
    config.headers["Authorization"] = accessToken
      ? `Bearer ${accessToken}`
      : ``;

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    return Promise.reject(error);
  }
);

const getToken = (cookieID: string) => {
  const name = cookieID + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export default axios;
