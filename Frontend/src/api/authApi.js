import { getRequest, postRequest } from "./baseApi";
import { API_ROUTES } from "./apiRoutes";

export const register = (data) =>
  postRequest(`${API_ROUTES.AUTH}/register`, data);

export const login = (data) => postRequest(`${API_ROUTES.AUTH}/login`, data);

export const getMe = () => getRequest(`${API_ROUTES.AUTH}/get-me`);

export const logout = () => getRequest(`${API_ROUTES.AUTH}/logout`);

export const refreshToken = () =>
  getRequest(`${API_ROUTES.AUTH}/refresh-token`);

export const verifyEmail = (data) =>
  postRequest(`${API_ROUTES.AUTH}/verify-email`, data);

export const resendOTP = (data) =>
  postRequest(`${API_ROUTES.AUTH}/resend-otp`, data);
