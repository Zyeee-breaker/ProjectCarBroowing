import api from "./ApiService";

/* ================= CARS ================= */
export const getCars = () => api.get("/cars");

export const getCar = (id: number) =>
  api.get(`/cars/${id}`);

export const createCar = (data: any) =>
  api.post("/cars", data);

export const updateCar = (id: number, data: any) =>
  api.put(`/cars/${id}`, data);

export const deleteCar = (id: number) =>
  api.delete(`/cars/${id}`);


/* ================= CARS CATEGORY ================= */
export const getCarCategories = () =>
  api.get("/cars-category");

export const createCarCategory = (data: any) =>
  api.post("/cars-category", data);

export const updateCarCategory = (id: number, data: any) =>
  api.put(`/cars-category/${id}`, data);

export const deleteCarCategory = (id: number) =>
  api.delete(`/cars-category/${id}`);


/* ================= CARS UNIT ================= */
export const getCarUnits = () =>
  api.get("/cars-unit");

export const getCarUnit = (id: number) =>
  api.get(`/cars-unit/${id}`);

export const createCarUnit = (data: any) =>
  api.post("/cars-unit", data);

export const updateCarUnit = (id: number, data: any) =>
  api.put(`/cars-unit/${id}`, data);

export const deleteCarUnit = (id: number) =>
  api.delete(`/cars-unit/${id}`);


/* ================= CARS FEATURE ================= */
export const getCarFeatures = () =>
  api.get("/cars-feature");

export const getCarFeature = (id: number) =>
  api.get(`/cars-feature/${id}`);

export const createCarFeature = (data: any) =>
  api.post("/cars-feature", data);

export const updateCarFeature = (id: number, data: any) =>
  api.put(`/cars-feature/${id}`, data);

export const deleteCarFeature = (id: number) =>
  api.delete(`/cars-feature/${id}`);


/* ================= CARS IMAGE ================= */
export const getCarImages = () =>
  api.get("/cars-image");

export const getCarImage = (id: number) =>
  api.get(`/cars-image/${id}`);

export const createCarImage = (formData: FormData) =>
  api.post("/cars-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateCarImage = (id: number, formData: FormData) =>
  api.post(`/cars-image/${id}`, formData);

export const deleteCarImage = (id: number) =>
  api.delete(`/cars-image/${id}`);

export const getCarImagesByCar = (id: number) =>
  api.get(`/cars/${id}/images`);