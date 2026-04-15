import api from "./ApiService";

export const getImages = () => api.get("/users/images");

export const getImage = (id: number) =>
  api.get(`/users/images/${id}`);

export const createImage = (data: any) =>
  api.post("/users/images", data);

export const updateImage = (id: number, data: any) =>
  api.put(`/users/images/${id}`, data);

export const deleteImage = (id: number) =>
  api.delete(`/users/images/${id}`);