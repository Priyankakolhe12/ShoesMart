import api from "./axios";

export const getRequest = async (url, config = {}) => {
  const res = await api.get(url, config);
  return res.data;
};

export const postRequest = async (url, data, config = {}) => {
  const res = await api.post(url, data, config);
  return res.data;
};

export const patchRequest = async (url, data) => {
  const res = await api.patch(url, data);
  return res.data;
};

export const deleteRequest = async (url) => {
  const res = await api.delete(url);
  return res.data;
};
