import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "./baseApi";
import { API_ROUTES } from "./apiRoutes";

export const getAllProducts = async () => {
  const data = await getRequest(`${API_ROUTES.PRODUCTS}/get-all`);
  if (!Array.isArray(data)) return [];
  return data.map((product) => ({
    ...product,
    id: product.id || product._id,
  }));
};

export const getProductById = async (id) => {
  const data = await getRequest(`${API_ROUTES.PRODUCTS}/get/${id}`);
  if (!data?.product) return data;
  return {
    ...data,
    product: {
      ...data.product,
      id: data.product.id || data.product._id,
    },
  };
};

export const createProduct = (formData) =>
  postRequest(`${API_ROUTES.PRODUCTS}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, data, isFormData = false) => {
  if (isFormData) {
    return patchRequest(`${API_ROUTES.PRODUCTS}/update/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return patchRequest(`${API_ROUTES.PRODUCTS}/update/${id}`, data);
};

export const deleteProduct = (id) =>
  deleteRequest(`${API_ROUTES.PRODUCTS}/delete/${id}`);
