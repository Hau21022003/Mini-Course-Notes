import { Role } from "@/constants/user.constant";

export type Account = {
  id: string;
  fullName: string;
  avatar?: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};
