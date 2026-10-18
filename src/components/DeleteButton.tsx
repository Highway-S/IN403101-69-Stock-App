"use client";

import React, { useState } from "react";

// Props สำหรับปุ่มลบสินค้า DeleteButton
interface DeleteButtonProps {
  productId: string;
  productName: string;
  onDeleted?: () => void;
}

/**
 * DeleteButton Component
 * ปุ่มสำหรับลบสินค้า พร้อมหน้าต่างยืนยัน (Confirmation dialog) และสถานะการโหลด
 */
export default function DeleteButton({
  productId,
  productName,
  onDeleted,
}: DeleteButtonProps) {
  // สถานะขณะกำลังส่งคำขอลบไปยังเซิร์ฟเวอร์
  const [isDeleting, setIsDeleting] = useState(false);

  // ฟังก์ชันจัดการการคลิกลบสินค้า
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${productName}"? การกระทำนี้ไม่สามารถย้อนกลับได้`
    );

    if (!isConfirmed) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || errorData?.error || "เกิดข้อผิดพลาดในการลบสินค้า"
        );
      }

      // แจ้งเตือนคอมโพเนนต์แม่ให้โหลดข้อมูลใหม่
      if (onDeleted) {
        onDeleted();
      }
    } catch (error: any) {
      console.error("Delete product error:", error);
      alert(error.message || "ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      title={`ลบ ${productName}`}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 ${
        isDeleting ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {isDeleting ? (
        <>
          <svg
            className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-red-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>กำลังลบ...</span>
        </>
      ) : (
        <>
          <span>🗑️</span>
          <span>ลบ</span>
        </>
      )}
    </button>
  );
}
