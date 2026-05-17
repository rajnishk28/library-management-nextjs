import api from "@/lib/api/axios";

export const adminService = {
  async getStats() {
    const { data } = await api.get("/stats/admin");
    return data;
  },

  async getUsers() {
    const { data } = await api.get("/users/");
    return data;
  },

  async deleteUser(userId) {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  async updateUserStatus(userId, active) {
    const { data } = await api.patch(`/users/${userId}/status`, { active });
    return data;
  },

  async getBooks() {
    const { data } = await api.get("/books/");
    return data;
  },

  async addBook(payload) {
    const { data } = await api.post("/books/", payload);
    return data;
  },

  async updateBook(bookId, payload) {
    const { data } = await api.put(`/books/${bookId}`, payload);
    return data;
  },

  async deleteBook(bookId) {
    const { data } = await api.delete(`/books/${bookId}`);
    return data;
  },

  async getRequests() {
    const { data } = await api.get("/issues/");
    return data;
  },

  async updateRequestStatus(issueId, status) {
    const { data } = await api.patch(`/issues/${issueId}/status`, { status });
    return data;
  },

  async getUserIssues(userId) {
    const { data } = await api.get(`/issues/user/${userId}`);
    return data;
  },

  async getInventory() {
    const { data } = await api.get("/issues/inventory");
    return data;
  },
};
