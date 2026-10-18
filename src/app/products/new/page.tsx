"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProductForm from "@/components/ProductForm";

/**
 * NewProductPage Component
 * หน้าสำหรับเพิ่มสินค้าใหม่เข้าสู่ระบบ (จำกัดสิทธิ์เฉพาะ ADMIN เท่านั้น)
 */
export default function NewProductPage() {
  const { data: session, status } = useSession();

  // แสดงหน้าจอโหลดขณะตรวจสอบข้อมูลสิทธิ์และเซสชัน
  if (status === "loading") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-600">
          กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...
        </p>
      </div>
    );
  }

  // ตรวจสอบสิทธิ์: หากไม่ได้เข้าสู่ระบบ หรือบทบาทไม่ใช่ ADMIN
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          ไม่มีสิทธิ์เข้าถึงหน้านี้
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          หน้านี้สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (ADMIN) เท่านั้น หากคุณต้องการใช้งาน กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            กลับหน้ารายการสินค้า
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            เข้าสู่ระบบใหม่
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ส่วนหัวของหน้า */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>➕</span>
            <span>เพิ่มสินค้าใหม่</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            กรอกข้อมูลรายละเอียดสินค้าและจำนวนสต็อกเริ่มต้นลงในระบบ
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <span>&larr;</span>
          <span>กลับหน้ารายการ</span>
        </Link>
      </div>

      {/* แบบฟอร์มเพิ่มสินค้าในโหมด create */}
      <ProductForm mode="create" />
    </div>
  );
}
