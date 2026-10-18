"use client";

import React, { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

// ประเภทพารามิเตอร์ที่ส่งกลับไปยังฟังก์ชัน onSearch
export interface SearchFilterValues {
  search: string;
  category: string;
  status: string;
}

// Props สำหรับ SearchFilterBar
interface SearchFilterBarProps {
  onSearch: (filters: SearchFilterValues) => void;
  isAdmin?: boolean;
  initialValues?: Partial<SearchFilterValues>;
}

/**
 * SearchFilterBar Component
 * แถบค้นหาและตัวกรองข้อมูลสินค้า:
 * - ค้นหาจากชื่อสินค้าหรือรหัส SKU
 * - กรองตามหมวดหมู่ (ดึงรายการจาก CATEGORIES)
 * - กรองตามสถานะสต็อก (มีของ, หมดของ, และ ใกล้หมด สำหรับ ADMIN เท่านั้น)
 */
export default function SearchFilterBar({
  onSearch,
  isAdmin = false,
  initialValues,
}: SearchFilterBarProps) {
  // สถานะค่าในฟอร์มค้นหา
  const [search, setSearch] = useState(initialValues?.search || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [status, setStatus] = useState(initialValues?.status || "");

  // ฟังก์ชันส่งค่าการค้นหาเมื่อผู้ใช้กด Submit หรือกดปุ่มค้นหา
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search, category, status });
  };

  // ฟังก์ชันล้างค่าตัวกรองทั้งหมด
  const handleReset = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    onSearch({ search: "", category: "", status: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 transition-all"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* ช่องค้นหาชื่อหรือ SKU */}
        <div className="lg:col-span-5">
          <label
            htmlFor="search-input"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
          >
            ค้นหาสินค้า
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาตามชื่อสินค้า หรือ SKU..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
            />
          </div>
        </div>

        {/* ตัวเลือกหมวดหมู่สินค้า */}
        <div className="lg:col-span-3">
          <label
            htmlFor="category-select"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
          >
            หมวดหมู่
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
          >
            <option value="">ทั้งหมด (ทุกหมวดหมู่)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* ตัวเลือกสถานะสินค้าในสต็อก */}
        <div className="lg:col-span-2">
          <label
            htmlFor="status-select"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
          >
            สถานะสินค้า
          </label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
          >
            <option value="">ทั้งหมด</option>
            <option value="in_stock">มีของ</option>
            <option value="out_of_stock">หมดของ</option>
            {/* ตัวเลือก 'ใกล้หมด' แสดงเฉพาะสำหรับ ADMIN เท่านั้น */}
            {isAdmin && <option value="low_stock">ใกล้หมด (Low Stock)</option>}
          </select>
        </div>

        {/* ปุ่มค้นหาและปุ่มรีเซ็ต */}
        <div className="lg:col-span-2 flex items-center space-x-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 flex items-center justify-center gap-1"
          >
            <span>ค้นหา</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="ล้างตัวกรอง"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2 px-3 rounded-lg text-sm transition-colors border border-slate-300 focus:outline-none"
          >
            ล้าง
          </button>
        </div>
      </div>
    </form>
  );
}
