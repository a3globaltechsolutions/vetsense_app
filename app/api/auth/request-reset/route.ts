import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Do not reveal user existence
      return NextResponse.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token expiry (1 hour)
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Save token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expires,
      },
    });

    // Reset link (frontend)
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // TODO — send via email (optional for now)
    // await sendResetEmail(user.email, resetLink);

    return NextResponse.json({
      message: "Password reset link generated",
      resetLink, // return for now until email service is added
    });
  } catch (err) {
    console.error("RESET REQUEST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
