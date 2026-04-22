import { supabase } from "../../lib/supabase";
import type { AppUser, SyncUserRequest } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL environment variable.");
}

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error("No active Supabase access token found.");
  }

  return token;
}

async function getAccessTokenOrNull(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

export async function syncUser(
  payload: SyncUserRequest = {},
): Promise<AppUser> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/auth/sync-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to sync user: ${errorText}`);
  }

  return response.json();
}

export async function getCurrentUser(): Promise<AppUser> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch current user: ${errorText}`);
  }

  return response.json();
}

export async function deleteCurrentUser(): Promise<void> {
  const token = await getAccessTokenOrNull();

  if (!token) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to delete current user: ${errorText}`);
  }
}

export async function deleteAccount(): Promise<void> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/auth/account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete account: ${errorText}`);
  }
}

export async function completeProfile(payload: {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}): Promise<AppUser> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to complete profile: ${errorText}`);
  }

  return response.json();
}
