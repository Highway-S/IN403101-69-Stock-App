import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/lib/auth.config";

// รายการผู้ให้บริการการเข้าสู่ระบบ (Authentication Providers)
const providers: Provider[] = [
  // เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน (Credentials)
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // ตรวจสอบความถูกต้องของรูปแบบข้อมูลผ่าน Zod schema
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      const { email, password } = parsed.data;

      // ค้นหาผู้ใช้งานจากฐานข้อมูลด้วยอีเมล
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // หากไม่พบผู้ใช้ หรือผู้ใช้ไม่มีรหัสผ่าน (เช่น สมัครผ่าน OAuth)
      if (!user || !user.password) {
        return null;
      }

      // เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านที่แฮชไว้ในฐานข้อมูล
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        return null;
      }

      // ส่งคืนข้อมูลผู้ใช้เพื่อใช้สร้าง Session
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      };
    },
  }),
];

// เพิ่ม GitHub OAuth Provider หากมีการตั้งค่า GITHUB_CLIENT_ID และ GITHUB_CLIENT_SECRET ใน .env
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

// กำหนดค่าและส่งออกฟังก์ชันจัดการการยืนยันตัวตนสำหรับ NextAuth v5
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers,
});
