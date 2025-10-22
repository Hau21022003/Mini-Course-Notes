// src/components/ProtectedRoute.tsx
import type { Role } from "@/constants/user.constant";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  roles?: Role[];
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, isLoading } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
    } else if (roles && !roles.includes(user.role)) {
      navigate("/unauthorized", { replace: true });
    }
  }, [isLoading]);

  return <>{children}</>;
};
