import { supabase } from "../../lib/supabase";

const AVATAR_BUCKET = import.meta.env.VITE_SUPABASE_AVATAR_BUCKET ?? "avatars";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function uploadAvatarPng(file: File): Promise<string> {
  if (file.type !== "image/png") {
    throw new Error("Only PNG files are allowed.");
  }

  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    throw new Error("Missing Supabase environment variables.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const filePath = `${user.id}/avatar.png`;

  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${AVATAR_BUCKET}/${filePath}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "image/png",
        "x-upsert": "true",
      },
      body: file,
    },
  );

  if (!uploadResponse.ok) {
    const responseText = await uploadResponse.text();

    if (responseText.toLowerCase().includes("row-level security")) {
      throw new Error(
        `Supabase storage still has an RLS policy issue for bucket \"${AVATAR_BUCKET}\". Check the bucket policies in Supabase Storage.`,
      );
    }

    throw new Error(
      `Failed to upload avatar (${uploadResponse.status}): ${responseText}`,
    );
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
}
