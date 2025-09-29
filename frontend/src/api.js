import axios from "axios";

export const BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===== HANDLE ERRORS =====
const handleApi = (error) => {
  if (error.response && error.response.data) {
    console.error("API Error:", error.response.data);
    // ✅ Use Error object
    throw new Error(error.response.data.message || "An API error occurred.");
  } else {
    console.error("API Error:", error.message);
    throw new Error("Network error");
  }
};

// ===== AUTH =====
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/users/register", userData);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await API.post("/users/login", userData);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ===== USERS =====
export const getUsers = async () => {
  try {
    const res = await API.get("/users");
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const getUserById = async (id) => {
  try {
    const res = await API.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const res = await API.put(`/users/${id}`, updateData);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ===== PLAYERS / SQUAD / TEAM =====
export const getAllPlayers = async () => {
  try {
    const res = await API.get("/players");
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const getPlayerById = async (id) => {
  try {
    const res = await API.get(`/players/${id}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const getMyTeam = async () => {
  try {
    const res = await API.get("/my-team");
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ✅ EDITED: getMySquad should return the `team` property from the response
export const getMySquad = async () => {
  try {
    const res = await API.get("/my-team");
    return res.data.team || [];
  } catch (error) {
    handleApi(error);
  }
};

// ✅ EDITED: getMyStartingXI now calls the same endpoint and extracts `startingXI`
export const getMyStartingXI = async () => {
  try {
    const res = await API.get("/my-team");
    return res.data.startingXI || [];
  } catch (error) {
    handleApi(error);
  }
};

// Pick / set Starting XI
export const pickStartingXI = async (playerIds) => {
  // ✅ EDITED: Use the global API instance for consistency
  try {
    const res = await API.post("/pick", { players: playerIds });
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// Buy / Sell Players
export const buyPlayer = async (playerId) => {
  // ✅ EDITED: Use the global API instance for consistency
  try {
    const res = await API.post(`/buy/${playerId}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const sellPlayer = async (playerId) => {
  // ✅ EDITED: Use the global API instance for consistency
  try {
    const res = await API.post(`/sell/${playerId}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ===== DASHBOARD =====
export const getDashboard = async () => {
  try {
    const res = await API.get("/dashboard");
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ===== LEADERBOARD =====
export const getLeaderboard = async () => {
  try {
    const res = await API.get("/leaderboard");
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ===== GROUPS =====
export const createGroup = async ({ name }) => {
  try {
    const res = await API.post("/groups/create", { name });
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const joinGroup = async ({ code }) => {
  try {
    const res = await API.post("/groups/join", { code });
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const leaveGroup = async ({ code }) => {
  try {
    const res = await API.post("/groups/leave", { code });
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

export const getUserGroups = async (userId) => {
  try {
    const res = await API.get(`/groups/${userId}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ===== CONTACT =====
export const sendContactMessage = async (messageData) => {
  try {
    const res = await API.post("/contacts/send", messageData);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};