/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Role } from "@prisma/client";
// import jwt, { JwtPayload } from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET!;

// interface MyJwtPayload extends JwtPayload {
//   id: string;
//   role: Role;
//   email: string; // I later added this
// }

// export function signToken(payload: any) {
//   return jwt.sign(payload, SECRET, { expiresIn: "7d" });
// }

// export function verifyToken(token: string): MyJwtPayload | null {
//   try {
//     return jwt.verify(token, SECRET) as MyJwtPayload;
//   } catch {
//     return null;
//   }
// }
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function signAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
