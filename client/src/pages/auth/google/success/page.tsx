"use client";
import { useEffect } from "react";
import { userApiRequest } from "@/api-requests/user";
import { handleErrorApi } from "@/lib/error";
import { authStorage } from "@/storage/features/auth.storage";
import { useAppStore } from "@/stores/app-store";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccessPage() {
  const navigate = useNavigate();
  const { setUser } = useAppStore();

  const load = async () => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const refreshToken = url.searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      authStorage.saveAccessToken(accessToken);
      try {
        const rsp = await userApiRequest.getProfile();
        const user = rsp.payload;
        setUser(user);
      } catch (error) {
        handleErrorApi({
          error,
        });
      }

      navigate("/admin/courses");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return <p>Log in...</p>;
}
