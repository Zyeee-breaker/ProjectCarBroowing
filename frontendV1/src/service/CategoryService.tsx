import api from "./ApiService";

// MAIN CATEGORY
export const getMainAllCategories = () =>api.get("/main-categories");

export const getMainCategory = (id: number) =>api.get(`/main-categories/${id}`);

export const createMainCategory = (data: any) =>api.post("/main-categories", data);

export const updateMainCategory = (id: number, data: any) =>api.put(`/main-categories/${id}`, data);

export const deleteMainCategory = (id: number) =>api.delete(`/main-categories/${id}`);


// CHILD CATEGORY
export const getChildAllCategories = () =>api.get("/child-categories");

export const getChildCategory = (id: number) =>api.get(`/child-categories/${id}`);

export const createChildCategory = (data: any) =>api.post("/child-categories", data);

export const updateChildCategory = (id: number, data: any) =>api.put(`/child-categories/${id}`, data);

export const deleteChildCategory = (id: number) =>api.delete(`/child-categories/${id}`);