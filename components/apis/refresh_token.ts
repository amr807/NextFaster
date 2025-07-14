"use server";
import { cookies } from "next/headers";

export async function refreshAccessToken() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refresh_token")?.value;
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refreshtoken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await res.json();
  (await cookieStore).set({
    name: "access_token",
    value: data.accessToken,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return data.accessToken;
}
