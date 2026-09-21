const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("jp_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      body?.message || body || `Request failed (${response.status})`
    );
  }

  return body;
}

export const api = {
  health: () => request("/health"),

  pets: (params = {}) => {
    const q = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        q.set(key, value);
      }
    });

    return request(`/pets?${q.toString()}`);
  },

  pet: (id) => request(`/pets/${id}`),

  createPet: (data) =>
    request("/pets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePet: (id, data) =>
    request(`/pets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  removePet: (id) =>
    request(`/pets/${id}`, {
      method: "DELETE",
    }),

  shelterPets: () => request("/shelter/pets"),

  shelterApplications: () => request("/shelter/applications"),

  updateShelterApplicationStatus: (id, status) =>
    request(`/shelter/applications/${id}/status?status=${status}`, {
      method: "PATCH",
    }),

  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request("/users/me"),

  favorites: () => request("/favorites"),

  addFavorite: (petId) =>
    request(`/favorites/${petId}`, {
      method: "POST",
    }),

  removeFavorite: (petId) =>
    request(`/favorites/${petId}`, {
      method: "DELETE",
    }),

  applications: () => request("/applications"),

  application: (id) => request(`/applications/${id}`),

  apply: (data) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};