"use client";

import React from "react";

// Props สำหรับคอมโพเนนต์ Pagination
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

/**
 * Pagination Component
 * แสดงส่วนแบ่งหน้า พร้อมปุ่ม ย้อนกลับ, หมายเลขหน้า (แสดงสูงสุด 5 หน้าโดยอิงจากหน้าปัจจุบัน), และปุ่ม ถัดไป
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // หากมีหน้าน้อยกว่าหรือเท่ากับ 1 หน้า ไม่จำเป็นต้องแสดง Pagination
  if (totalPages <= 1) {
    return null;
  }

  // คำนวณช่วงหมายเลขหน้าที่จะแสดง (สูงสุด 5 หน้า)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200">
      {/* ข้อความบอกสถานะหน้าปัจจุบัน */}
      <div className="text-sm text-slate-600">
        แสดงผล <span className="font-semibold text-slate-900">หน้า {page}</span> จากทั้งหมด{" "}
        <span className="font-semibold text-slate-900">{totalPages} หน้า</span>
      </div>

      {/* แถบปุ่มเปลี่ยนหน้า */}
      <div className="flex items-center space-x-1.5">
        {/* ปุ่มก่อนหน้า */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            page <= 1
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-sm"
          }`}
        >
          &larr; ก่อนหน้า
        </button>

        {/* ปุ่มหมายเลขหน้า */}
        {pages.map((p) => {
          const isActive = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[36px] h-9 px-2 text-sm font-medium rounded-md border transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* ปุ่มถัดไป */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            page >= totalPages
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-sm"
          }`}
        >
          ถัดไป &rarr;
        </button>
      </div>
    </div>
  );
}
