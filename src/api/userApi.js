import api from "./axios";

export const getUserByEmail = async (email) => {
  const res = await api.get(`/users?email=${email}`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};
