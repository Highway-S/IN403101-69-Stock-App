import type { NextAuthConfig } from "next-auth";

/**
 * authConfig สำหรับการทำงานในระดับ Edge Runtime (เช่น Next.js Middleware)
 * แยกการตั้งค่าที่ไม่ผูกกับ Node.js APIs (ไม่มี prisma adapter หรือ bcryptjs)
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึงหน้าเว็บ (ใช้ใน Middleware)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // หน้าสาธารณะที่ไม่ต้องล็อกอิน
      const isPublicPath =
        pathname.startsWith("/login") || pathname.startsWith("/register");

      // เส้นทาง API สำหรับ Authentication
      const isAuthApi =
        pathname.startsWith("/api/auth") || pathname.startsWith("/api/register");

      // อนุญาตให้เรียก API Auth และหน้า static assets ได้เสมอ
      if (isAuthApi) return true;

      // หากยังไม่ได้ล็อกอิน และไม่ใช่หน้าสาธารณะ -> ส่ง false เพื่อ redirect ไปหน้า /login
      if (!isLoggedIn && !isPublicPath) return false;

      // หากล็อกอินแล้ว และพยายามเข้าหน้า /login หรือ /register -> redirect ไปหน้า /products
      if (isLoggedIn && isPublicPath) {
        return Response.redirect(new URL("/products", nextUrl));
      }

      return true;
    },
    // จัดการข้อมูลใน JWT Token เมื่อล็อกอินสำเร็จ
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER";
        token.id = user.id;
      }
      return token;
    },
    // ส่งต่อข้อมูลจาก JWT Token ไปยัง Session Object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = (token.role as "ADMIN" | "USER") || "USER";
        session.user.id = (token.id as string) || (token.sub as string);
      }
      return session;
    },
  },
  providers: [], // Array ว่างสำหรับ Edge; ผู้ให้บริการตัวเต็มจะใส่ใน auth.ts
} satisfies NextAuthConfig;
