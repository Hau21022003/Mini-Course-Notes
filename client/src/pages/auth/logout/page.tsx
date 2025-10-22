import { authStorage } from "@/storage/features/auth.storage";
import { useAppStore } from "@/stores/app-store";
import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutLogic() {
  const { setUser } = useAppStore();
  const navigator = useNavigate();

  useEffect(() => {
    authStorage.clear();
    setUser(null);
    navigator("/login");
  }, [setUser]);
  return <div className="text-sm text-gray-400">Logging out...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  );
}
