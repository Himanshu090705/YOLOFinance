import Cookies from "js-cookie";

export const isAuthenticated = () => {
  return !!Cookies.get("authToken");
};

export const logout = () => {
  Cookies.remove("authToken");
};
