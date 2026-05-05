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

  const rawBody = await response.text();

  let data = null;
  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = { message: rawBody };
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
