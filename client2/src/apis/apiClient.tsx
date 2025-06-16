// utils/apiClient.ts

export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    console.log("res", response);
    const errorText = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}
