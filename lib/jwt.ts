/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

interface MyJwtPayload extends JwtPayload {
  id: string;
  role: Role;
  email: string; // I later added this
}

export function signToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): MyJwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as MyJwtPayload;
  } catch {
    return null;
  }
}
