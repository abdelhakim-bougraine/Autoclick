import { request } from "./http";
import { getStoredToken } from "./auth";

const authHeaders = () => ({
  Authorization: `Bearer ${getStoredToken() || ""}`,
});

export function fetchProducts() {
  return request("/api/products");
}

export function createProduct(payload) {
  return request("/api/products", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateProductById(productId, payload) {
  return request(`/api/products/${productId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deleteProductById(productId) {
  return request(`/api/products/${productId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
