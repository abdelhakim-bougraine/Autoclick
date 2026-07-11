const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL =
  configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : "");

export async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("API URL not configured. Set VITE_API_BASE_URL in frontend env.");
  }

  const { headers: customHeaders, ...requestOptions } = options;

  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const response = await fetch(`${normalizedBase}${path}`, {
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
