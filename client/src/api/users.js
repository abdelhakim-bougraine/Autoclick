import { request } from "./http";
import { getStoredToken } from "./auth";

const authHeaders = () => ({
  Authorization: `Bearer ${getStoredToken() || ""}`,
});

export function fetchUsers() {
  return request("/api/auth/users", {
    headers: authHeaders(),
  });
}

export function createUser(payload) {
  return request("/api/auth/users", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateUserById(userId, payload) {
  return request(`/api/auth/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deleteUserById(userId) {
  return request(`/api/auth/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
