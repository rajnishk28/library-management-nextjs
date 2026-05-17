import api from "@/lib/api/axios";

export const authService = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  async signup(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
};
