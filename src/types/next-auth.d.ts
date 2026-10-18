import { DefaultSession } from "next-auth";

// ขยายประเภทข้อมูล (Type Augmentation) ของ next-auth เพื่อรองรับฟิลด์ role ใน User และ Session
declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

// ขยายประเภทข้อมูลของ next-auth/jwt เพื่อรองรับฟิลด์ role ใน JWT Token
declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
  }
}

// ขยายประเภทข้อมูลของ AdapterUser เพื่อรองรับบทบาทในฐานข้อมูล
declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: "ADMIN" | "USER";
  }
}
