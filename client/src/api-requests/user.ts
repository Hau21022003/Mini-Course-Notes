import http from "@/lib/http";
import type { Account } from "@/types/account.type";

const BASE_URL = "/users";
export const userApiRequest = {
  getProfile: () => http.get<Account>("/users/profile"),
  findOne: (userId: string) => http.get<Account>(`${BASE_URL}/${userId}`),
};
