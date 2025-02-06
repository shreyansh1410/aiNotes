import axios from "axios";

const API_URL = "http://localhost:3000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  signup: (username: string, email: string, password: string) =>
    api.post("/auth/signup", { username, email, password }),
};

export const notesService = {
  getNotes: () => api.get("/notes"),
  createNote: (note: any) => api.post("/notes", note),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
  updateNote: (id: string, note: any) => api.put(`/notes/${id}`, note),
  uploadImage: async (file: File) => {
    console.log("Uploading file:", file); // Add debug log
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(`${API_URL}notes/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });

    console.log("Upload response:", response.data); // Add debug log
    return response.data;
  },
};

export default api;
