import http from "@/lib/http";
import type { LoginBody, RegisterBody } from "@/schemas/auth.schema";
import type { LoginRes, RegisterRes } from "@/types/auth.type";

const authApiRequest = {
  sLogin: (body: LoginBody) => http.post<LoginRes>("/auth/signin", body),
  register: (body: RegisterBody) =>
    http.post<RegisterRes>("/auth/signup", body),
  forgotPassword: (email: string) => http.get(`/auth/forgot-password/${email}`),
  verifyEmail: (token: string) => http.get(`/auth/verify-email/${token}`),
  sLogout: ({
    refreshToken,
    accessToken,
  }: {
    refreshToken: string;
    accessToken: string;
  }) =>
    http.post(
      "/auth/logout",
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
};

export default authApiRequest;
