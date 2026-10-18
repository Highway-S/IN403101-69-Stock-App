"use client";

import React from "react";

// ประเภทของ Props สำหรับคอมโพเนนต์ StockBadge
export interface StockBadgeProps {
  isAdmin?: boolean;
  quantity?: number;
  unit?: string;
  lowStock?: boolean;
  inStock?: boolean;
}

/**
 * StockBadge Component
 * คอมโพเนนต์แสดงป้ายสถานะสต็อกสินค้า:
 * - สำหรับ ADMIN: แสดงจำนวนคงเหลือ พร้อมหน่วย และสีบ่งบอกสถานะ (แดง=หมด, ส้ม=ใกล้หมด, เขียว=ปกติ)
 * - สำหรับ USER ทั่วไป: แสดงเฉพาะป้าย "มีของ" หรือ "หมดของ" เพื่อไม่เปิดเผยจำนวนสต็อกที่แท้จริง
 */
export default function StockBadge({
  isAdmin = false,
  quantity = 0,
  unit = "ชิ้น",
  lowStock = false,
  inStock = false,
}: StockBadgeProps) {
  // การแสดงผลสำหรับผู้ดูแลระบบ (ADMIN)
  if (isAdmin) {
    // 1. สินค้าหมดสต็อก (จำนวนเท่ากับ 0)
    if (quantity === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm">
          <span>❌</span>
          <span>หมดสต็อก (0 {unit})</span>
        </span>
      );
    }

    // 2. สินค้าใกล้หมดสต็อก (lowStock เป็น true หรือจำนวน 1-5 ชิ้น)
    if (lowStock || (quantity > 0 && quantity <= 5)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
          <span>⚠️</span>
          <span>ใกล้หมด ({quantity} {unit})</span>
        </span>
      );
    }

    // 3. สินค้ามีเพียงพอในสต็อก (ปกติ)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
        <span>✅</span>
        <span>{quantity} {unit}</span>
      </span>
    );
  }

  // การแสดงผลสำหรับผู้ใช้งานทั่วไป (USER)
  // หาก inStock เป็นจริง หรือ quantity มากกว่า 0
  const available = inStock !== undefined ? inStock : quantity > 0;

  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>มีของ</span>
      </span>
    );
  }

  // กรณีสินค้าหมดสำหรับ USER
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-red-500"></span>
      <span>หมดของ</span>
    </span>
  );
}
