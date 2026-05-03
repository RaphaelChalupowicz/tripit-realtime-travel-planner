import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhotoCameraOutlined from "@mui/icons-material/PhotoCameraOutlined";
import { useThemeMode } from "../app/ThemeModeProvider";
import { useAuthStore } from "../features/auth/authStore";
import { uploadAvatarPng } from "../features/auth/avatarUpload";
import { supabase } from "../lib/supabase";
import { syncUser } from "../features/auth/authApi";
import { getErrorMessage } from "../lib/errors";

// ============================================================================
// Constants
// ============================================================================

const PROFILE_IMAGE_QUERY_CACHE_BUST = "cb";
const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "First name and last name are required.",
  UPDATE_NAME: "Failed to update your name.",
  SIGN_OUT: "Failed to sign out.",
  DELETE_ACCOUNT: "Failed to delete account.",
  UPLOAD_AVATAR: "Failed to upload avatar.",
};

// ============================================================================
// Component
// ============================================================================

/**
 * ProfilePage component for user profile management.
 * Displays user information, allows editing profile details and avatar,
 * and provides options for account management (sign out, delete).
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { appUser, signOut, deleteAccount, isLoading, setAppUser } =
    useAuthStore();
  const { mode } = useThemeMode();
  const isDarkMode = mode === "dark";

  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(appUser?.firstName ?? "");
  const [lastName, setLastName] = useState(appUser?.lastName ?? "");
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());

  useEffect(() => {
    setFirstName(appUser?.firstName ?? "");
    setLastName(appUser?.lastName ?? "");
  }, [appUser?.firstName, appUser?.lastName]);

  useEffect(() => {
    if (!isEditingProfile) {
      setFirstName(appUser?.firstName ?? "");
      setLastName(appUser?.lastName ?? "");
    }
  }, [appUser?.firstName, appUser?.lastName, isEditingProfile]);

  const updateSupabaseMetadata = useCallback(
    async (first: string, last: string) => {
      try {
        await supabase.auth.updateUser({
          data: {
            first_name: first,
            last_name: last,
            full_name: `${first} ${last}`.trim(),
          },
        });
      } catch (err) {
        console.warn("Failed to update Supabase user metadata:", err);
      }
    },
    [],
  );

  const handleSaveName = useCallback(async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      await Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: ERROR_MESSAGES.REQUIRED_FIELDS,
      });
      return;
    }

    try {
      setIsSavingProfile(true);

      await updateSupabaseMetadata(trimmedFirstName, trimmedLastName);

      const updated = await syncUser({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        profileImageUrl: appUser?.profileImageUrl ?? undefined,
      });

      setAppUser(updated);
      setAvatarVersion(Date.now());
      setIsEditingProfile(false);

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile changes have been saved.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error, ERROR_MESSAGES.UPDATE_NAME);
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: errorMessage,
      });
    } finally {
      setIsSavingProfile(false);
    }
  }, [
    firstName,
    lastName,
    appUser?.profileImageUrl,
    updateSupabaseMetadata,
    setAppUser,
  ]);

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);

        const publicUrl = await uploadAvatarPng(file);

        await updateSupabaseMetadata(
          firstName.trim() || appUser?.firstName || "",
          lastName.trim() || appUser?.lastName || "",
        );

        const updated = await syncUser({
          firstName: firstName.trim() || appUser?.firstName || "",
          lastName: lastName.trim() || appUser?.lastName || "",
          profileImageUrl: publicUrl,
        });

        setAppUser(updated);
        setAvatarVersion(Date.now());

        await Swal.fire({
          icon: "success",
          title: "Photo uploaded",
          text: "Your avatar has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        const errorMessage = getErrorMessage(err, ERROR_MESSAGES.UPLOAD_AVATAR);
        await Swal.fire({
          icon: "error",
          title: "Upload failed",
          text: errorMessage,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [
      firstName,
      lastName,
      appUser?.firstName,
      appUser?.lastName,
      updateSupabaseMetadata,
      setAppUser,
    ],
  );

  const handleAvatarFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleAvatarUpload(file);
      }
      (e.target as HTMLInputElement).value = "";
    },
    [handleAvatarUpload],
  );

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error, ERROR_MESSAGES.SIGN_OUT);
      await Swal.fire({
        icon: "error",
        title: "Sign out failed",
        text: errorMessage,
      });
    }
  }, [signOut, navigate]);

  const handleDeleteAccount = useCallback(async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete account?",
      text: "This action cannot be undone. Your account and all data will be permanently removed.",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete permanently",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAccount();
      navigate("/login");
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(
        error,
        ERROR_MESSAGES.DELETE_ACCOUNT,
      );
      await Swal.fire({
        icon: "error",
        title: "Deletion failed",
        text: errorMessage,
      });
    }
  }, [deleteAccount, navigate]);

  const getPageBackgroundGradient = useCallback(() => {
    return isDarkMode
      ? "radial-gradient(circle at top left, rgba(28, 100, 242, 0.16), transparent 32%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.18), transparent 28%), linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98))"
      : "radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)";
  }, [isDarkMode]);

  const getTextColor = useCallback(
    (light: string, dark: string) => {
      return isDarkMode ? dark : light;
    },
    [isDarkMode],
  );

  const userDisplayName =
    `${appUser?.firstName ?? ""} ${appUser?.lastName ?? ""}`.trim() ||
    "Unnamed profile";

  const profileImageUrl = appUser?.profileImageUrl
    ? `${appUser.profileImageUrl}${appUser.profileImageUrl.includes("?") ? "&" : "?"}${PROFILE_IMAGE_QUERY_CACHE_BUST}=${avatarVersion}`
    : undefined;

  const avatarAlt = `${appUser?.firstName ?? ""} ${appUser?.lastName ?? ""} profile picture`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, md: 5 },
        background: getPageBackgroundGradient(),
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2,
              color: getTextColor("#475569", "rgba(255,255,255,0.65)"),
            }}
          >
            Profile
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.05,
              color: getTextColor("#0f172a", "#f8fafc"),
            }}
          >
            Your account
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            boxShadow: isDarkMode
              ? "0 24px 80px rgba(2, 6, 23, 0.45)"
              : "0 24px 80px rgba(15, 23, 42, 0.12)",
            background: isDarkMode
              ? "linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(17, 24, 39, 0.94))"
              : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248, 250, 252, 0.96))",
            backdropFilter: "blur(14px)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(148, 163, 184, 0.28)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent 38%, rgba(14, 165, 233, 0.08))"
                : "linear-gradient(135deg, rgba(37, 99, 235, 0.07), transparent 42%, rgba(14, 165, 233, 0.06))",
              pointerEvents: "none",
            }}
          />

          <Stack spacing={3} sx={{ position: "relative" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
            >
              <Avatar
                src={profileImageUrl}
                alt={avatarAlt}
                sx={{
                  width: 96,
                  height: 96,
                  border: `4px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.95)"}`,
                  boxShadow: isDarkMode
                    ? 2
                    : "0 12px 28px rgba(15, 23, 42, 0.16)",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                }}
              />

              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip
                    icon={<BadgeOutlined />}
                    label={userDisplayName}
                    sx={{
                      fontWeight: 700,
                      bgcolor: isDarkMode
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(15, 23, 42, 0.04)",
                      color: isDarkMode ? "#f8fafc" : "#0f172a",
                    }}
                  />
                  <Chip
                    icon={<EmailOutlined />}
                    label={appUser?.email ?? "No email"}
                    variant="outlined"
                    sx={{
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(148, 163, 184, 0.45)",
                      color: isDarkMode ? "rgba(255,255,255,0.9)" : "#0f172a",
                      bgcolor: isDarkMode
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.9)",
                    }}
                  />
                  <Chip
                    icon={<AdminPanelSettingsOutlined />}
                    label={appUser?.isAdmin ? "Admin" : "Member"}
                    color={appUser?.isAdmin ? "secondary" : "default"}
                    variant={appUser?.isAdmin ? "filled" : "outlined"}
                    sx={{
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(148, 163, 184, 0.45)",
                      color: isDarkMode ? "rgba(255,255,255,0.9)" : "#0f172a",
                      bgcolor: appUser?.isAdmin
                        ? undefined
                        : isDarkMode
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(255,255,255,0.9)",
                    }}
                  />
                </Stack>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: getTextColor("#0f172a", "#f8fafc"),
                  }}
                >
                  {userDisplayName}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 680,
                    color: getTextColor("#475569", "rgba(248,250,252,0.72)"),
                  }}
                >
                  Manage your personal details and avatar from one clean place.
                  Changes are saved to Supabase and mirrored into the backend
                  user record.
                </Typography>
              </Stack>

              <Button
                variant="contained"
                startIcon={<PhotoCameraOutlined />}
                onClick={() => setIsEditingProfile(true)}
                disabled={isEditingProfile}
                aria-label="Edit your profile"
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  boxShadow: 2,
                  bgcolor: isDarkMode ? "primary.main" : "#2563eb",
                }}
              >
                Edit profile
              </Button>
            </Stack>

            {isEditingProfile && (
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  bgcolor: isDarkMode
                    ? "rgba(15, 23, 42, 0.96)"
                    : "rgba(248, 250, 252, 0.98)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(148, 163, 184, 0.2)",
                }}
              >
                <Stack spacing={2.25}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                  >
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/png"
                      style={{ display: "none" }}
                      onChange={handleAvatarFileChange}
                      aria-label="Upload profile picture"
                    />

                    <label htmlFor="avatar-upload">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<PhotoCameraOutlined />}
                        disabled={isUploading}
                        sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                      >
                        {isUploading ? "Uploading..." : "Change photo"}
                      </Button>
                    </label>

                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 520,
                        color: getTextColor("#64748b", "rgba(255,255,255,0.7)"),
                      }}
                    >
                      Use a PNG avatar. The new photo updates your Supabase auth
                      profile and the backend user record.
                    </Typography>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSavingProfile || isUploading}
                      fullWidth
                      slotProps={{
                        input: {
                          "aria-label": "First name",
                        },
                      }}
                    />

                    <TextField
                      label="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSavingProfile || isUploading}
                      fullWidth
                      slotProps={{
                        input: {
                          "aria-label": "Last name",
                        },
                      }}
                    />
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                  >
                    <Button
                      onClick={handleSaveName}
                      variant="contained"
                      disabled={isLoading || isSavingProfile || isUploading}
                      sx={{ borderRadius: 999, px: 3 }}
                    >
                      {isSavingProfile ? "Saving..." : "Save changes"}
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => setIsEditingProfile(false)}
                      disabled={isUploading || isSavingProfile}
                    >
                      Cancel
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      Save closes edit mode automatically.
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between" }}
          >
            <Button
              onClick={handleLogout}
              color="warning"
              variant="contained"
              disabled={isLoading}
              aria-label="Sign out of your account"
              sx={{ borderRadius: 999, px: 3 }}
            >
              Sign out
            </Button>

            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="outlined"
              disabled={isLoading}
              aria-label="Delete your account permanently"
              sx={{ borderRadius: 999, px: 3 }}
            >
              Delete account
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
