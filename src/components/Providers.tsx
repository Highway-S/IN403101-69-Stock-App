"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

/**
 * Providers Component
 * คอมโพเนนต์สำหรับครอบ Client Components ทั้งหมดด้วย SessionProvider จาก NextAuth
 * เพื่อให้คอมโพเนนต์ลูกสามารถเข้าถึงข้อมูลการล็อกอินและสถานะเซสชันผ่าน useSession() ได้
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
