"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SearchFilterBar, { SearchFilterValues } from "@/components/SearchFilterBar";
import ProductTable from "@/components/ProductTable";
import Pagination from "@/components/Pagination";
import { Product } from "@/types/product";

/**
 * ProductsPage Component
 * หน้ารายการสินค้าหลักของระบบ (Client Component)
 * - ดึงข้อมูลสินค้าจาก /api/products พร้อมพารามิเตอร์ค้นหา กรอง และแบ่งหน้า
 * - ตรวจสอบสิทธิ์ผู้ใช้งาน (ADMIN / USER) ผ่าน useSession
 * - แสดงปุ่ม "เพิ่มสินค้า" สำหรับ ADMIN
 * - จัดการสถานะการโหลด ข้อผิดพลาด และการลบสินค้า
 */
export default function ProductsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  // State สำหรับเก็บข้อมูลสินค้าและการแบ่งหน้า
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State สำหรับตัวกรองและการค้นหา
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // ฟังก์ชันดึงข้อมูลสินค้าจาก API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (status) params.append("status", status);
      params.append("page", String(page));
      params.append("limit", "10");

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้");
      }

      const data = await res.json();

      // รองรับโครงสร้าง Response ทั้งแบบ { products, pagination } หรือแบบ Array ตรง
      const productList = Array.isArray(data)
        ? data
        : data.products || data.data || [];
      const paginationInfo = data.pagination || {
        totalPages: data.totalPages || 1,
        total: data.total || productList.length,
      };

      setProducts(productList);
      setTotalPages(paginationInfo.totalPages || 1);
      setTotalItems(paginationInfo.total || productList.length);
    } catch (err: any) {
      console.error("Fetch products error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
    } finally {
      setLoading(false);
    }
  }, [search, category, status, page]);

  // เรียกโหลดข้อมูลเมื่อเงื่อนไขการค้นหาหรือหน้าเปลี่ยน
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // จัดการเมื่อผู้ใช้กดค้นหาจาก SearchFilterBar
  const handleSearch = (filters: SearchFilterValues) => {
    setSearch(filters.search);
    setCategory(filters.category);
    setStatus(filters.status);
    setPage(1); // รีเซ็ตกลับไปหน้า 1 ทุกครั้งที่มีการค้นหาใหม่
  };

  // จัดการเมื่อมีการลบสินค้าสำเร็จ
  const handleDeleteProduct = (deletedId: string) => {
    // ลบออกจาก state ทันทีเพื่อความลื่นไหล
    setProducts((prev) => prev.filter((p) => p.id !== deletedId));
    // ดึงข้อมูลใหม่จากเซิร์ฟเวอร์เพื่อปรับตัวเลข Pagination
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า: แสดงชื่อหน้าและปุ่มเพิ่มสินค้าสำหรับ ADMIN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>📦</span>
            <span>รายการสินค้า</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ระบบจัดการสต็อกสินค้าและตรวจสอบความพร้อมในคลังสินค้า
            {totalItems > 0 && ` (ทั้งหมด ${totalItems} รายการ)`}
          </p>
        </div>

        {/* ปุ่มเพิ่มสินค้าใหม่ แสดงเฉพาะเมื่อผู้ใช้เป็น ADMIN */}
        {isAdmin && (
          <Link
            href="/products/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span>➕</span>
            <span>เพิ่มสินค้าใหม่</span>
          </Link>
        )}
      </div>

      {/* แถบค้นหาและตัวกรอง */}
      <SearchFilterBar
        onSearch={handleSearch}
        isAdmin={isAdmin}
        initialValues={{ search, category, status }}
      />

      {/* ข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาดในการโหลด */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={fetchProducts}
            className="text-xs font-semibold underline hover:text-red-800"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      {/* สถานะกำลังโหลดข้อมูล */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
          <p className="text-sm font-medium text-slate-600">
            กำลังโหลดรายการสินค้า...
          </p>
        </div>
      ) : (
        <>
          {/* ตารางแสดงรายการสินค้า */}
          <ProductTable
            products={products}
            isAdmin={isAdmin}
            onDelete={handleDeleteProduct}
          />

          {/* คอมโพเนนต์แบ่งหน้า Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
