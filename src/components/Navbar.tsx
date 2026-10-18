"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

// ประเภทของ Props สำหรับ Navbar
interface NavbarProps {
  session?: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: "ADMIN" | "USER" | string;
      image?: string | null;
    };
  } | null;
}

/**
 * Navbar Component
 * แถบเมนูนำทางหลักด้านบนของระบบ แสดงโลโก้ เมนูนำทาง ข้อมูลผู้ใช้งาน บทบาท (Badge)
 * และปุ่มออกจากระบบ / เข้าสู่ระบบ
 */
export default function Navbar({ session: initialSession }: NavbarProps) {
  // ดึงข้อมูลเซสชันฝั่ง Client เพื่ออัปเดตสถานะแบบ Real-time เมื่อมีการล็อกอินหรือออกจากระบบ
  const { data: clientSession } = useSession();
  const session = clientSession !== undefined ? clientSession : initialSession;
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  // สถานะเปิด/ปิดเมนูบนหน้าจอขนาดเล็ก (Mobile)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ฟังก์ชันจัดการการออกจากระบบ
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ส่วนโลโก้และชื่อระบบ */}
          <div className="flex items-center space-x-8">
            <Link
              href="/products"
              className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white hover:text-indigo-300 transition-colors"
            >
              <span className="text-2xl">📦</span>
              <span>ระบบสต็อกสินค้า</span>
            </Link>

            {/* เมนูนำทางหลักสำหรับหน้าจอ Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/products"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              >
                รายการสินค้า
              </Link>

              {/* แสดงปุ่มเพิ่มสินค้าเฉพาะผู้ดูแลระบบ (ADMIN) */}
              {isAdmin && (
                <Link
                  href="/products/new"
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800/50 transition-colors flex items-center gap-1"
                >
                  <span>➕</span>
                  <span>เพิ่มสินค้า</span>
                </Link>
              )}
            </div>
          </div>

          {/* ส่วนข้อมูลผู้ใช้งานและการล็อกอิน (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* ข้อมูลชื่อและอีเมล */}
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {user.name || "ผู้ใช้งาน"}
                  </div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>

                {/* ป้ายแสดงบทบาท (Role Badge): ADMIN สีแดง, USER สีน้ำเงิน */}
                {isAdmin ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
                    ADMIN
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    USER
                  </span>
                )}

                {/* ปุ่มออกจากระบบ */}
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              // กรณีผู้ใช้ยังไม่ได้เข้าสู่ระบบ
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* ปุ่ม Hamburger Menu สำหรับหน้าจอมือถือ */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="เปิดเมนู"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* เมนูนำทางแบบย่อสำหรับหน้าจอมือถือ (Mobile Menu) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 px-4 pt-3 pb-4 space-y-3 bg-slate-900">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800"
          >
            รายการสินค้า
          </Link>
          {isAdmin && (
            <Link
              href="/products/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-300 hover:text-white hover:bg-indigo-900/40"
            >
              ➕ เพิ่มสินค้า
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {user.name || "ผู้ใช้งาน"}
                    </div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  {isAdmin ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      USER
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
