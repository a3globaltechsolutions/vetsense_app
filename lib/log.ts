import { prisma } from "./prisma";

export async function logAction(userId: string, action: string) {
  await prisma.auditLog.create({
    data: { userId, action },
  });
}
