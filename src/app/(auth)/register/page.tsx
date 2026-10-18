"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "@/lib/validations";

/**
 * หน้าสมัครสมาชิก (Register Page)
 * ผู้ใช้กรอก ชื่อ อีเมล รหัสผ่าน แล้วระบบจะสร้างบัญชีและเข้าสู่ระบบอัตโนมัติ
 */
export default function RegisterPage() {
  const router = useRouter();

  // สถานะของฟอร์ม
  const [name, setName] = useState("");
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
    const validation = registerSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const firstError =
        validation.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง";
      setError(firstError);
      setLoading(false);
      return;
    }

    try {
      // ส่งข้อมูลไปยัง API ลงทะเบียน
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        setLoading(false);
        return;
      }

      // สมัครสำเร็จ → เข้าสู่ระบบอัตโนมัติ
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        // สมัครสำเร็จแต่ Auto-Login ไม่ได้ ให้ไปหน้า login เอง
        router.push("/login");
      } else {
        router.push("/products");
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-md">
        {/* การ์ดฟอร์มสมัครสมาชิก */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {/* หัวข้อ */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📝</div>
            <h1 className="text-2xl font-bold text-slate-900">สมัครสมาชิก</h1>
            <p className="text-sm text-slate-500 mt-1">
              สร้างบัญชีเพื่อเข้าใช้ระบบจัดการสต็อก
            </p>
          </div>

          {/* แสดงข้อผิดพลาด */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* ฟอร์มสมัครสมาชิก */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ช่องชื่อ */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                ชื่อ
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อของคุณ"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

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
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                required
                minLength={6}
              />
            </div>

            {/* ปุ่มสมัครสมาชิก */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>
          </form>

          {/* ลิงก์ไปหน้าเข้าสู่ระบบ */}
          <p className="mt-6 text-center text-sm text-slate-500">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
