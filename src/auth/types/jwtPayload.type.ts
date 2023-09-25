import { ROLE } from "@prisma/client";

export type JwtPayload = {
    email: string;
    roleId: number;
    sub: number;
  };