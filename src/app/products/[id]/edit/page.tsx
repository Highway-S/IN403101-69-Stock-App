"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/types/product";

/**
 * EditProductPage Component
 * หน้าสำหรับแก้ไขข้อมูลสินค้าที่มีอยู่ในระบบ (จำกัดสิทธิ์เฉพาะ ADMIN เท่านั้น)
 * - ดึงข้อมูลสินค้าเดิมผ่าน GET /api/products/[id]
 * - นำข้อมูลมาแสดงในแบบฟอร์ม ProductForm (mode="edit")
 */
export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: session, status } = useSession();

  // State สำหรับเก็บข้อมูลสินค้าเดิม สถานะการโหลด และข้อผิดพลาด
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ดึงข้อมูลสินค้าที่ต้องการแก้ไขจาก API
  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("ไม่พบสินค้าที่ต้องการแก้ไขในระบบ");
          }
          throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
        }

        const data = await res.json();
        // รองรับทั้งแบบส่ง object มาตรงๆ หรือห่อด้วย { product: ... }
        const productData = data.product || data;
        setProduct(productData);
      } catch (err: any) {
        console.error("Fetch product error:", err);
        setFetchError(err.message || "ไม่สามารถดึงข้อมูลสินค้าได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

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

  // สถานะขณะกำลังโหลดข้อมูลสินค้าจาก API
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-600">
          กำลังโหลดข้อมูลสินค้าสำหรับแก้ไข...
        </p>
      </div>
    );
  }

  // กรณีเกิดข้อผิดพลาดหรือไม่พบสินค้า
  if (fetchError || !product) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          เกิดข้อผิดพลาด
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          {fetchError || "ไม่พบข้อมูลสินค้าที่ระบุ"}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          กลับหน้ารายการสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ส่วนหัวของหน้า */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>✏️</span>
            <span>แก้ไขสินค้า: {product.name}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            แก้ไขข้อมูลรายละเอียดและปรับปรุงยอดคงเหลือในสต็อกสินค้า
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

      {/* แบบฟอร์มแก้ไขสินค้าในโหมด edit พร้อมข้อมูลเริ่มต้น */}
      <ProductForm
        mode="edit"
        productId={id}
        initialData={{
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          quantity: product.quantity ?? 0,
          unit: product.unit,
          description: product.description || "",
        }}
      />
    </div>
  );
}
