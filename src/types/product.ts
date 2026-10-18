// ประเภทข้อมูลสำหรับสินค้าและข้อมูลการแบ่งหน้าในระบบจัดการสต็อก

// ข้อมูลสินค้า (Product) ที่ส่งกลับมาจาก API
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity?: number; // มีเฉพาะสำหรับผู้ดูแลระบบ (ADMIN)
  unit: string;
  description?: string;
  lowStock?: boolean; // มีเฉพาะสำหรับ ADMIN: true เมื่อสินค้ามีจำนวน <= เกณฑ์เตือนสต็อกต่ำ
  inStock?: boolean; // มีเฉพาะสำหรับผู้ใช้ทั่วไป (USER): true เมื่อสินค้ามีในสต็อก (> 0)
  createdAt?: string;
  updatedAt?: string;
}

// ข้อมูลการแบ่งหน้า (Pagination)
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// โครงสร้างผลลัพธ์จาก API /api/products
export interface ProductsApiResponse {
  products: Product[];
  pagination: PaginationData;
}
