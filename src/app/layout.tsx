import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { auth } from "@/lib/auth";

// ข้อมูล Metadata ประจำระบบจัดการสต็อกสินค้า
export const metadata: Metadata = {
  title: "ระบบจัดการสต็อกสินค้า",
  description: "ระบบจัดการสต็อกสินค้าสำหรับร้านค้าขนาดเล็ก รองรับการจัดการสินค้า คลัง และการแบ่งสิทธิ์ผู้ใช้",
};

/**
 * RootLayout Component
 * โครงสร้างหลักของทั้งแอปพลิเคชัน (Server Component)
 * ทำการดึง Session ของผู้ใช้งานปัจจุบัน และห่อหุ้มโครงสร้างด้วย Providers และ Navbar
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ดึงข้อมูลเซสชันของผู้ใช้ที่ล็อกอินอยู่ในปัจจุบันจากฝั่งเซิร์ฟเวอร์
  const session = await auth();

  return (
    <html lang="th">
      <body className="font-sans antialiased min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {/* ครอบด้วย SessionProvider ผ่านคอมโพเนนต์ Providers */}
        <Providers>
          {/* แถบเมนูด้านบน พร้อมส่งข้อมูลเซสชันเริ่มต้น */}
          <Navbar session={session} />

          {/* ส่วนเนื้อหาหลัก จัดวางให้อยู่กึ่งกลางพร้อม Padding ที่เหมาะสม */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* ส่วนท้ายของระบบ (Footer) */}
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            <div className="max-w-7xl mx-auto px-4">
              <p>ระบบจัดการสต็อกสินค้า &copy; {new Date().getFullYear()} สงวนลิขสิทธิ์</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
