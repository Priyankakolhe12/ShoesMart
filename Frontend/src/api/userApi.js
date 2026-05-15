import { getRequest, postRequest, patchRequest } from "./baseApi";
import { API_ROUTES } from "./apiRoutes";

/* =============================
   USERS
============================= */

export const getAllUsers = async () => {
  const data = await getRequest(API_ROUTES.USERS);
  if (!Array.isArray(data)) return [];
  return data.map((user) => ({
    ...user,
    id: user.id || user._id,
  }));
};

export const getUserByEmail = async (email) => {
  const data = await getRequest(API_ROUTES.USERS, { params: { email } });
  if (Array.isArray(data)) {
    return data.map((user) => ({
      ...user,
      id: user.id || user._id,
    }));
  }
  return data && typeof data === "object"
    ? { ...data, id: data.id || data._id }
    : data;
};

export const getUserById = async (id) => {
  const data = await getRequest(`${API_ROUTES.USERS}/${id}`);
  return data && typeof data === "object"
    ? { ...data, id: data.id || data._id }
    : data;
};

export const createUser = (data) => postRequest(API_ROUTES.USERS, data);

export const updateUser = (id, data) =>
  patchRequest(`${API_ROUTES.USERS}/${id}`, data);
