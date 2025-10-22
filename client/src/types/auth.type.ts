import { type Account } from "@/types/account.type";

export type RegisterRes = {
  accessToken: string;
  refreshToken: string;
  account: Account;
};

export type LoginRes = RegisterRes;
