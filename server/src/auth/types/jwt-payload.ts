import { Role } from 'src/modules/users/entities/user.entity';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};
