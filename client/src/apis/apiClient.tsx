import ApiError from "../utils/ApiError";

export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("inv_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 204 No Content response
  if (response?.status === 204) return null as any;

  if (!response.ok) {
    const { status, statusText } = response;
    throw new ApiError(statusText, status);
  }

  return response.json();
}
