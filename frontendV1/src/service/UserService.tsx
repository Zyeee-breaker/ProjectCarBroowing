import api from "./ApiService";

// GET ALL
export const getUsers = () => api.get("/users/profile");
export const getAllUsers = () => api.get("/users");

// GET ONE
export const getUser = (id: number) =>
  api.get(`/users/profile/${id}`);
export const getUserstaff = () =>
  api.get(`/usersstaff`);

// CREATE
export const createUser = (data: any) =>
  api.post("/users", data);

// UPDATE
export const updateUser = (id: number, data: any) =>
  api.put(`/users/profile/${id}`, data);
export const updateUserstaff = (id: number, data: any) =>
  api.put(`/usersstaff/${id}`, data);
export const AdminupdateUser = (id: number, data: any) =>
  api.put(`/users/${id}`, data);

// DELETE
export const deleteUser = (id: number) =>
  api.delete(`/users/profile/${id}`);
export const deleteUserstaff = (id: number) =>
  api.delete(`/users/${id}`);
export const AdmindeleteUser = (id: number) =>
  api.delete(`/users/${id}`);

export const completeProfile = (userId: number, data: any) =>
  api.post(`/users/${userId}/profile`, data);
