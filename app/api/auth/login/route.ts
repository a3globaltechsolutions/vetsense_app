/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { throwAuth, AuthError } from "@/lib/auth/errors";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      throwAuth("Email and password are required", 400);
    }

    // Find staff user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throwAuth("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throwAuth("Invalid email or password", 401);
    }

    // Create tokens (payload only needs ID & role)
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Set HttpOnly cookies
    setAuthCookies(accessToken, refreshToken);

    // Log login action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
      },
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);

    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
