"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import StockBadge from "@/components/StockBadge";
import DeleteButton from "@/components/DeleteButton";

// Props สำหรับคอมโพเนนต์ ProductTable
interface ProductTableProps {
  products: Product[];
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

/**
 * ProductTable Component
 * ตารางแสดงรายการสินค้า:
 * - แสดง ชื่อสินค้า, รหัส SKU, หมวดหมู่, ราคา
 * - สำหรับ ADMIN: แสดงจำนวนคงเหลือพร้อมสถานะสต็อกเตือน และคอลัมน์จัดการ (แก้ไข/ลบ)
 * - สำหรับ USER: แสดงสถานะความพร้อมของสินค้า (มีของ / หมดของ) โดยไม่แสดงจำนวนตัวเลข
 * - มีการจัดการกรณีไม่พบข้อมูล (Empty State)
 */
export default function ProductTable({
  products,
  isAdmin = false,
  onDelete,
}: ProductTableProps) {
  // กรณีไม่มีสินค้าในรายการ แสดง Empty State
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="text-4xl mb-3">📦</div>
        <h3 className="text-lg font-semibold text-slate-800">ไม่พบสินค้า</h3>
        <p className="text-sm text-slate-500 mt-1">
          ไม่มีรายการสินค้าที่ตรงกับเงื่อนไขการค้นหาหรือไม่มีสินค้าในระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* ส่วนหัวตาราง (Table Header) */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                ชื่อสินค้า
              </th>
              <th scope="col" className="py-3.5 px-4">
                SKU
              </th>
              <th scope="col" className="py-3.5 px-4">
                หมวดหมู่
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                ราคา
              </th>
              <th scope="col" className="py-3.5 px-4 text-center">
                {isAdmin ? "จำนวนคงเหลือ" : "สถานะ"}
              </th>
              {isAdmin && (
                <th scope="col" className="py-3.5 px-4 text-center">
                  จัดการ
                </th>
              )}
            </tr>
          </thead>

          {/* รายการข้อมูลสินค้าแต่ละแถว (Table Body) */}
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const formattedPrice = (product.price || 0).toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* ชื่อสินค้าและคำอธิบายย่อ */}
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                    <div>
                      <span className="font-semibold">{product.name}</span>
                      {product.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* รหัส SKU */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 border border-slate-200">
                      {product.sku}
                    </span>
                  </td>

                  {/* หมวดหมู่สินค้า */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-block bg-slate-50 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200">
                      {product.category}
                    </span>
                  </td>

                  {/* ราคาสินค้า */}
                  <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                    {formattedPrice} บาท
                  </td>

                  {/* คอลัมน์สต็อก: แสดง StockBadge ตามสิทธิ์ของผู้ใช้ */}
                  <td className="py-3.5 px-4 text-center">
                    <StockBadge
                      isAdmin={isAdmin}
                      quantity={product.quantity}
                      unit={product.unit}
                      lowStock={product.lowStock}
                      inStock={product.inStock}
                    />
                  </td>

                  {/* คอลัมน์จัดการ: สำหรับ ADMIN เท่านั้น (ปุ่มแก้ไข และ ปุ่มลบ) */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* ลิงก์แก้ไขสินค้า */}
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                        >
                          <span>✏️</span>
                          <span>แก้ไข</span>
                        </Link>

                        {/* ปุ่มลบสินค้า */}
                        <DeleteButton
                          productId={product.id}
                          productName={product.name}
                          onDeleted={() => {
                            if (onDelete) onDelete(product.id);
                          }}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
