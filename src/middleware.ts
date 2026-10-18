import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// ใช้งาน auth middleware จากการตั้งค่าแบบ Edge-compatible (auth.config.ts)
// เพื่อไม่ให้ดึงโมดูล Node.js เช่น prisma หรือ bcryptjs เข้ามาใน Edge Runtime
export default NextAuth(authConfig).auth;

// กำหนด Matcher ป้องกันเส้นทางทั้งหมด ยกเว้น static assets และ favicon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
