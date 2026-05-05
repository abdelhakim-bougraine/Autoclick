import { request } from "./http";

const AUTH_EVENT = "autoclick-auth-changed";

export function getStoredUser() {
  const rawUser = localStorage.getItem("autoclickUser");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("autoclickToken");
}

export function clearAuth() {
  localStorage.removeItem("autoclickToken");
  localStorage.removeItem("autoclickUser");
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
