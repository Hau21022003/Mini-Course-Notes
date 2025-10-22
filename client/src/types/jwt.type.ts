import { Role } from "@/constants/user.constant";

export type JwtPayload = {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  role: Role;
};
