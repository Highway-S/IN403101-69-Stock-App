import { PrismaClient } from "@prisma/client";

// ฟังก์ชันสร้าง Prisma Client อินสแตนซ์เดี่ยว (Singleton pattern)
// เพื่อป้องกันการสร้าง Connection ซ้ำซ้อนระหว่าง Hot-reloading ในโหมด Development
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// ขยาย Global scope สำหรับ TypeScript เพื่อเก็บ PrismaClient
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// ใช้งานอินสแตนซ์เดิมถ้ามีอยู่แล้ว หรือสร้างใหม่ถ้ายังไม่มี
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// ในโหมด Development ให้เก็บอินสแตนซ์ไว้ใน globalThis
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
