import { storage } from "@/storage/local-storage";
import { type Account } from "@/types/account.type";
import type { JwtPayload } from "@/types/jwt.type";
import { jwtDecode } from "jwt-decode";

const USER_KEY = "user";
const SESSION_TOKEN_KEY = "sessionToken";

export interface SessionTokenInfo {
  sessionToken: string;
  expiresAt: string;
}

export const authStorage = {
  getUser() {
    const user = storage.get(USER_KEY) as Account | undefined;
    if (!user) return undefined;

    if (!this.isSessionValid()) {
      this.clear();
      return undefined;
    }

    return user;
  },

  saveUser(user: Account) {
    storage.set(USER_KEY, user);
  },

  saveAuth(user: Account, accessToken: string) {
    console.log("saveAuth", user);
    storage.set(USER_KEY, user);
    storage.set(SESSION_TOKEN_KEY, accessToken);
  },

  getRawAccessToken(): string | undefined {
    return storage.get(SESSION_TOKEN_KEY) as string | undefined;
  },

  getAccessToken(): string | undefined {
    if (!this.isSessionValid()) {
      this.clear();
      return undefined;
    }
    return this.getRawAccessToken();
  },

  saveAccessToken(accessToken: string) {
    return storage.set(SESSION_TOKEN_KEY, accessToken);
  },

  clear() {
    storage.remove(USER_KEY);
    storage.remove(SESSION_TOKEN_KEY);
  },

  isSessionValid(): boolean {
    const token = this.getRawAccessToken();
    if (!token) return false;
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded || !decoded.exp) return false;

    const expiresAtTime = decoded.exp * 1000;

    return Date.now() < expiresAtTime;
  },
};
