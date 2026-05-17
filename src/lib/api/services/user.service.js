import api from "@/lib/api/axios";

export const userService = {
  async getStats() {
    const { data } = await api.get("/stats/user");
    return data;
  },

  async getBooks() {
    const { data } = await api.get("/books/");
    return data;
  },

  async requestBook(payload) {
    const { data } = await api.post("/issues/", payload);
    return data;
  },

  async getIssues() {
    const { data } = await api.get("/issues/");
    return data;
  },

  /** User submits a return request — admin must approve it */
  async requestReturn(issueId) {
    const { data } = await api.put(`/issues/return/${issueId}`);
    return data;
  },

  async getProfile() {
    const { data } = await api.get("/users/me");
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },

  async changePassword(payload) {
    const { data } = await api.post("/users/me/change-password", payload);
    return data;
  },
};
