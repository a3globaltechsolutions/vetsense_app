import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ success: true }); // silent

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  //  SEND EMAIL HERE  (we can implement phase 5)
  console.log("Reset Token:", token);

  return NextResponse.json({ success: true });
}
