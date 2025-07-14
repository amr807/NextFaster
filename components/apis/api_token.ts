import { cookies } from "next/headers";
import { refreshAccessToken } from "./refresh_token";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retry = true
) {
  const cookieStore = cookies();
  let token = (await cookieStore).get("access_token")?.value;

  let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  cache: "no-store"  });

  if (res.status === 401 && retry) {
    try {
      token = await refreshAccessToken();
    } catch {
      throw new Error("Token refresh failed");
    }

    res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      credentials: "include",
      next: { revalidate: 60 },
    });
  }

  if (!res.ok) {
    throw new Error(`Fetch failed with status ${res.status}`);
  }

  return res.json();
}
