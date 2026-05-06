import { getRequest, postRequest, patchRequest } from "./baseApi";
import { API_ROUTES } from "./apiRoutes";

/* =============================
   USERS
============================= */

export const getUserByEmail = (email) =>
  getRequest(API_ROUTES.USERS, { params: { email } });

export const getUserById = (id) => getRequest(`${API_ROUTES.USERS}/${id}`);

export const createUser = (data) => postRequest(API_ROUTES.USERS, data);

export const updateUser = (id, data) =>
  patchRequest(`${API_ROUTES.USERS}/${id}`, data);
