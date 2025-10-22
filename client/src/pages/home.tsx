import { useAppStore } from "@/stores/app-store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user, isLoading } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role === "ADMIN") {
      navigate("/admin/courses", { replace: true });
    }
  }, [isLoading]);
  return <div>home</div>;
}
