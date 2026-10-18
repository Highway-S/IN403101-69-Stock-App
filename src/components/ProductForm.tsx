"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { productSchema } from "@/lib/validations";
import { CATEGORIES } from "@/lib/constants";

// ประเภท Props ของ ProductForm
interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    sku: string;
    category: string;
    price: number;
    quantity?: number;
    unit: string;
    description?: string;
  };
  productId?: string;
}

/**
 * ProductForm Component
 * ฟอร์มสำหรับสร้างและแก้ไขข้อมูลสินค้า
 * ใช้ Zod validation ตรวจสอบข้อมูลก่อนส่ง
 */
export default function ProductForm({
  mode,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();

  // สถานะของข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    category: initialData?.category || "",
    price: initialData?.price?.toString() || "",
    quantity: initialData?.quantity?.toString() || "0",
    unit: initialData?.unit || "",
    description: initialData?.description || "",
  });

  // สถานะข้อผิดพลาดของแต่ละฟิลด์
  const [errors, setErrors] = useState<Record<string, string>>({});
  // สถานะข้อผิดพลาดจาก API
  const [apiError, setApiError] = useState("");
  // สถานะกำลังโหลด
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันอัปเดตค่าฟิลด์
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ล้าง error ของฟิลด์ที่แก้ไข
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // ฟังก์ชันส่งฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setErrors({});
    setLoading(true);

    // แปลงค่าตัวเลขก่อน validate
    const dataToValidate = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity, 10) || 0,
      unit: formData.unit,
      description: formData.description,
    };

    // ตรวจสอบด้วย Zod
    const validation = productSchema.safeParse(dataToValidate);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0]?.toString();
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      // เลือก URL และ method ตามโหมด (create / edit)
      const url =
        mode === "create" ? "/api/products" : `/api/products/${productId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();

      if (!res.ok) {
        // แสดง error จาก API
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.errors)) {
            if (Array.isArray(msgs) && msgs.length > 0) {
              fieldErrors[key] = msgs[0] as string;
            }
          }
          setErrors(fieldErrors);
        }
        setApiError(data.message || "เกิดข้อผิดพลาด");
        setLoading(false);
        return;
      }

      // สำเร็จ → กลับไปหน้ารายการสินค้า
      router.push("/products");
      router.refresh();
    } catch {
      setApiError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8"
    >
      {/* แสดงข้อผิดพลาดจาก API */}
      {apiError && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ชื่อสินค้า */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ชื่อสินค้า <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="เช่น หูฟังบลูทูธ"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500"
            } focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* รหัส SKU */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            รหัส SKU <span className="text-red-500">*</span>
          </label>
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="เช่น ELEC-001"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.sku
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500"
            } focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900`}
          />
          {errors.sku && (
            <p className="mt-1 text-xs text-red-600">{errors.sku}</p>
          )}
        </div>

        {/* หมวดหมู่ (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            หมวดหมู่ <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.category
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500"
            } focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900 bg-white`}
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        {/* ราคา */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ราคา (บาท) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.price
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500"
            } focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        {/* จำนวนคงเหลือ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            จำนวนคงเหลือ <span className="text-red-500">*</span>
          </label>
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.quantity
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500"
            } focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900`}
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
          )}
        </div>

        {/* หน่วยสินค้า */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            หน่วย <span className="text-red-500">*</span>
          </label>
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="เช่น ชิ้น, กล่อง, แพ็ค"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.unit
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500"
            } focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900`}
          />
          {errors.unit && (
            <p className="mt-1 text-xs text-red-600">{errors.unit}</p>
          )}
        </div>

        {/* รายละเอียดสินค้า (Full width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            รายละเอียด
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับสินค้า (ถ้ามี)"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 resize-none"
          />
        </div>
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading
            ? "กำลังบันทึก..."
            : mode === "create"
            ? "เพิ่มสินค้า"
            : "บันทึกการแก้ไข"}
        </button>

        {/* ปุ่มยกเลิก */}
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
