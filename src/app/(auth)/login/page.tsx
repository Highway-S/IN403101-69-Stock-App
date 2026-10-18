"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/lib/validations";

/**
 * หน้าเข้าสู่ระบบ (Login Page)
 * รองรับการเข้าสู่ระบบด้วยอีเมล+รหัสผ่าน และ GitHub OAuth
 */
export default function LoginPage() {
  const router = useRouter();

  // สถานะของฟอร์ม
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันจัดการการ Submit ฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ตรวจสอบข้อมูลด้วย Zod ก่อนส่ง
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง";
      setError(firstError);
      setLoading(false);
      return;
    }

    try {
      // เรียก signIn ของ NextAuth ด้วย Credentials Provider
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        // เข้าสู่ระบบสำเร็จ ไปหน้ารายการสินค้า
        router.push("/products");
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเข้าสู่ระบบผ่าน GitHub
  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl: "/products" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-md">
        {/* การ์ดฟอร์มเข้าสู่ระบบ */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {/* หัวข้อ */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📦</div>
            <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
            <p className="text-sm text-slate-500 mt-1">
              ระบบจัดการสต็อกสินค้า
            </p>
          </div>

          {/* แสดงข้อผิดพลาด */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* ฟอร์มเข้าสู่ระบบ */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ช่องอีเมล */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            {/* ช่องรหัสผ่าน */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            {/* ปุ่มเข้าสู่ระบบ */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* เส้นแบ่ง */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-slate-400">หรือ</span>
            </div>
          </div>

          {/* ปุ่มเข้าสู่ระบบผ่าน GitHub */}
          <button
            onClick={handleGitHubLogin}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            เข้าสู่ระบบด้วย GitHub
          </button>

          {/* ลิงก์ไปหน้าสมัครสมาชิก */}
          <p className="mt-6 text-center text-sm text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
