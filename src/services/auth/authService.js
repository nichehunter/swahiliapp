import authApi from "@/libs/axios/auth";

// =========================================================
// LOGIN
// =========================================================

export const login = async (data) => {
  const response = await authApi.post("/auth/customer/login", data);

  return response.data;
};

// =========================================================
// REGISTER
// =========================================================

export const registration = async (data) => {
  const response = await authApi.post("/auth/registration", data);

  return response.data;
};

// =========================================================
// LOGIN with Google
// =========================================================

export const loginGoogle = async (data) => {
  const response = await authApi.post("/auth/google/login", data);

  return response.data;
};
