const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function request(path, options = {}) {
  const { headers: customHeaders, ...requestOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `${response.status} ${response.statusText}` ||
        "Request failed",
    );
  }

  return data;
}

export default API_BASE_URL;
