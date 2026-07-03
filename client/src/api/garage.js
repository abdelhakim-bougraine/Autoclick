import { request } from "./http";
import { getStoredToken } from "./auth";

const authHeaders = () => ({
  Authorization: `Bearer ${getStoredToken() || ""}`,
});

export function fetchNearbyGarages({ lng, lat, type }) {
  const params = new URLSearchParams({ lng, lat });
  if (type) params.append("type", type);
  return request(`/api/garages/nearby?${params.toString()}`);
}

export function fetchAllGarages() {
  return request("/api/garages", {
    headers: authHeaders(),
  });
}

export function createGarage(payload) {
  return request("/api/garages", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateGarageById(garageId, payload) {
  return request(`/api/garages/${garageId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deleteGarageById(garageId) {
  return request(`/api/garages/${garageId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export function updateGarageSubscription(garageId, months) {
  return request("/api/garages/subscription", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ garageId, months }),
  });
}
