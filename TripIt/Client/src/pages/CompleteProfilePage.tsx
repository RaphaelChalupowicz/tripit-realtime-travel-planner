import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../features/auth/authStore";
import { uploadAvatarPng } from "../features/auth/avatarUpload.ts";

const COMPLETE_PROFILE_DRAFT_KEY = "tripit.complete-profile.draft";

type CompleteProfileDraft = {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};

function readDraft(): CompleteProfileDraft {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawDraft = window.sessionStorage.getItem(COMPLETE_PROFILE_DRAFT_KEY);

    if (!rawDraft) {
      return {};
    }

    return JSON.parse(rawDraft) as CompleteProfileDraft;
  } catch {
    return {};
  }
}

function writeDraft(draft: CompleteProfileDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    COMPLETE_PROFILE_DRAFT_KEY,
    JSON.stringify(draft),
  );
}

function clearDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(COMPLETE_PROFILE_DRAFT_KEY);
}

function getGoogleProfileDefaults(
  appUser: ReturnType<typeof useAuthStore.getState>["appUser"],
  supabaseUser: ReturnType<typeof useAuthStore.getState>["supabaseUser"],
) {
  const metadata = supabaseUser?.user_metadata;
  const identityData = supabaseUser?.identities?.[0]?.identity_data;

  const fullName =
    (metadata?.full_name as string | undefined) ??
    (metadata?.name as string | undefined) ??
    (identityData?.full_name as string | undefined) ??
    (identityData?.name as string | undefined) ??
    "";

  const googleGivenName =
    (metadata?.given_name as string | undefined) ??
    (metadata?.first_name as string | undefined) ??
    (identityData?.given_name as string | undefined) ??
    (identityData?.first_name as string | undefined) ??
    "";

  const googleFamilyName =
    (metadata?.family_name as string | undefined) ??
    (metadata?.last_name as string | undefined) ??
    (identityData?.family_name as string | undefined) ??
    (identityData?.last_name as string | undefined) ??
    "";

  const [nameFromFullNameFirst = "", ...restNameParts] = fullName
    .trim()
    .split(/\s+/);
  const nameFromFullNameLast =
    restNameParts.length > 0 ? restNameParts.join(" ") : "";

  return {
    firstName:
      appUser?.firstName ?? googleGivenName ?? nameFromFullNameFirst ?? "",
    lastName:
      appUser?.lastName ?? googleFamilyName ?? nameFromFullNameLast ?? "",
    profileImageUrl:
      appUser?.profileImageUrl ??
      (metadata?.avatar_url as string | undefined) ??
      (metadata?.picture as string | undefined) ??
      "",
  };
}

function getNameParts(displayName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmedName = displayName.trim();

  if (!trimmedName) {
    return { firstName: "", lastName: "" };
  }

  const nameParts = trimmedName.split(/\s+/);

  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: "" };
  }

  return {
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(" "),
  };
}

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { appUser, supabaseUser, completeProfile, isLoading } = useAuthStore();

  const defaults = getGoogleProfileDefaults(appUser, supabaseUser);
  const draft = readDraft();

  const [firstName, setFirstName] = useState(
    draft.firstName ?? defaults.firstName,
  );
  const [lastName, setLastName] = useState(draft.lastName ?? defaults.lastName);
  const [profileImageUrl, setProfileImageUrl] = useState(
    draft.profileImageUrl ?? defaults.profileImageUrl,
  );
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!firstName && defaults.firstName) {
      setFirstName(defaults.firstName);
    }

    if (!lastName && defaults.lastName) {
      setLastName(defaults.lastName);
    }

    if (!profileImageUrl && defaults.profileImageUrl) {
      setProfileImageUrl(defaults.profileImageUrl);
    }
  }, [
    defaults.firstName,
    defaults.lastName,
    defaults.profileImageUrl,
    firstName,
    lastName,
    profileImageUrl,
  ]);

  useEffect(() => {
    setFirstName((currentValue) => currentValue || defaults.firstName);
    setLastName((currentValue) => currentValue || defaults.lastName);
    setProfileImageUrl(
      (currentValue) => currentValue || defaults.profileImageUrl,
    );
  }, [defaults.firstName, defaults.lastName, defaults.profileImageUrl]);

  useEffect(() => {
    let cancelled = false;

    const hydrateFromSupabase = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (cancelled || error || !data.user) {
        return;
      }

      const metadata = data.user.user_metadata;
      const identityData = data.user.identities?.[0]?.identity_data;
      const rawDisplayName =
        (metadata?.full_name as string | undefined) ??
        (metadata?.name as string | undefined) ??
        (identityData?.full_name as string | undefined) ??
        (identityData?.name as string | undefined) ??
        "";

      const { firstName: displayFirstName, lastName: displayLastName } =
        getNameParts(rawDisplayName);

      const firstNameFromAuth =
        (metadata?.given_name as string | undefined) ??
        (metadata?.first_name as string | undefined) ??
        (identityData?.given_name as string | undefined) ??
        (identityData?.first_name as string | undefined) ??
        displayFirstName;

      const lastNameFromAuth =
        (metadata?.family_name as string | undefined) ??
        (metadata?.last_name as string | undefined) ??
        (identityData?.family_name as string | undefined) ??
        (identityData?.last_name as string | undefined) ??
        displayLastName;

      setFirstName((currentValue) => currentValue || firstNameFromAuth || "");
      setLastName((currentValue) => currentValue || lastNameFromAuth || "");
      setProfileImageUrl(
        (currentValue) =>
          currentValue ||
          (metadata?.avatar_url as string | undefined) ||
          (metadata?.picture as string | undefined) ||
          "",
      );
    };

    void hydrateFromSupabase();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    writeDraft({
      firstName,
      lastName,
      profileImageUrl,
    });
  }, [firstName, lastName, profileImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      setIsUploading(true);
      const uploadedUrl = await uploadAvatarPng(file);
      setProfileImageUrl(uploadedUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to upload avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await completeProfile({
        firstName,
        lastName,
        profileImageUrl,
      });

      clearDraft();

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(`Failed to complete profile. \n ${err}`);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Complete your profile
        </Typography>

        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <TextField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            label="First name"
            required
            fullWidth
          />

          <TextField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            label="Last name"
            required
            fullWidth
          />

          {profileImageUrl && (
            <Avatar
              src={profileImageUrl}
              alt="Profile preview"
              sx={{ width: 96, height: 96 }}
            />
          )}

          <Button variant="outlined" component="label" disabled={isUploading}>
            {isUploading ? "Uploading avatar..." : "Upload PNG avatar"}
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              hidden
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || isUploading}
            fullWidth
          >
            Continue
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
